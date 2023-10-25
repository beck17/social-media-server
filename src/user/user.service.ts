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
	) {}

	async getProfile(_id: Types.ObjectId) {
		return this.UserModel.findById(_id)
			.populate('friends', 'firstName lastName avatar')
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

	async addToFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
		const user = await this.getById(userId)
		const friend = await this.getById(friendId)

		user.friends = [...user.friends, friendId]
		friend.friends = [...friend.friends, userId]

		await user.save()
		await friend.save()

		return true
	}

	async removeFromFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
		await this.UserModel.findByIdAndUpdate(userId, {
			$pull: {
				friends: friendId,
			},
		})

		await this.UserModel.findByIdAndUpdate(friendId, {
			$pull: {
				friends: userId,
			},
		})

		return true
	}

	async isFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
		const user = await this.UserModel.findOne({
			_id: userId,
			friends: friendId,
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
