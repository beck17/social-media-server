import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
	constructor(
		@InjectModel(UserModel)
		private readonly UserModel: ModelType<UserModel>,
	) {
	}

	async getProfile(_id: Types.ObjectId) {
		return this.UserModel.findById(_id)
			.populate('friends', 'firstName lastName avatar city birthday')
			.exec()
	}

	async getById(id: Types.ObjectId) {
		const user = await this.UserModel.findById(id).exec()
		if (!user) throw new NotFoundException('Профиля не существует')

		return user
	}

	async updateProfile(id: Types.ObjectId, dto: UserDto) {
		const user = await this.getById(id)

		if (dto.avatar) user.avatar = dto.avatar
		if (dto.firstName) user.firstName = dto.firstName
		if (dto.lastName) user.lastName = dto.lastName
		if (dto.backgroundPic) user.backgroundPic = dto.backgroundPic
		if (dto.city) user.city = dto.city
		if (dto.birthday) user.birthday = dto.birthday

		return user.save()
	}

	async sendFriendRequest(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
		const sender = await this.getById(senderId)
		const receiver = await this.getById(receiverId)

		if (sender === receiver) throw new NotFoundException('Вы не можете отправить запрос на дружбу самому себе')
		if (receiver.requestFriends.includes(sender._id)) throw new NotFoundException('Вы уже отправили запрос на дружбу')
		if (receiver.friends.includes(sender._id)) throw new NotFoundException('Этот пользователь уже у вас в друзьях')


		if (sender.requestFriends.includes(receiver._id)) return await this.acceptFriendRequest(sender.id, receiverId)

		receiver.requestFriends.push(sender._id)
		sender.outgoingRequestFriends.push(receiver._id)

		await receiver.save()
		await sender.save()

		return receiver
	}

	async acceptFriendRequest(userId: Types.ObjectId, requesterId: Types.ObjectId) {
		const user = await this.getById(userId)
		const requester = await this.getById(requesterId)

		if (
			!user.requestFriends.includes(requester._id) && requester.outgoingRequestFriends.includes(user._id)
		) throw new NotFoundException('Запрос на дружбу не найден')

		await this.UserModel.findByIdAndUpdate(userId, {
			$pull: {
				requestFriends: requesterId,
			},
		})
		await this.UserModel.findByIdAndUpdate(requesterId, {
			$pull: {
				outgoingRequestFriends: userId,
			},
		})

		user.friends.push(requester._id)
		requester.friends.push(user._id)

		await user.save()
		await requester.save()

		return user
	}

	async unSubscribe(userId: Types.ObjectId, requesterId: Types.ObjectId) {
		const user = await this.getById(userId)
		const requester = await this.getById(requesterId)

		if (
			!requester.requestFriends.includes(user._id) && !user.outgoingRequestFriends.includes(requester._id)
		) throw new NotFoundException('Запрос на дружбу не найден')

		await this.UserModel.findByIdAndUpdate(userId, {
			$pull: {
				outgoingRequestFriends: requesterId,
			},
		})

		await this.UserModel.findByIdAndUpdate(requesterId, {
			$pull: {
				requestFriends: userId,
			},
		})

		await user.save()
		await requester.save()

		return user
	}

	async removeFromFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
		const user = await this.getById(userId)

		if (!user.friends.includes(friendId)) throw new NotFoundException('Пользователя нет в ваших друзьях')

		await this.UserModel.findByIdAndUpdate(userId, {
			$pull: {
				friends: friendId,
			},
			$push: {
				requestFriends: friendId,
			},
		})

		await this.UserModel.findByIdAndUpdate(friendId, {
			$pull: {
				friends: userId,
			},
			$push: {
				outgoingRequestFriends: userId,
			},
		})

		await user.save()

		return user
	}

	async isFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
		const user = await this.UserModel.findOne({
			_id: userId,
			friends: friendId,
		})

		return !!user
	}

	async isSubscribe(userId: Types.ObjectId, friendId: Types.ObjectId) {
		const user = await this.UserModel.findOne({
			_id: userId,
			outgoingRequestFriends: friendId,
		})

		return !!user
	}

	async searchProfile(search: string) {
		return this.UserModel.find({
			$or: [
				{
					firstName: new RegExp(search, 'i'),
				},
				{
					lastName: new RegExp(search, 'i'),
				},
			],
		})
			.select('firstName lastName avatar')
			.sort('desc')
			.exec()
	}
}
