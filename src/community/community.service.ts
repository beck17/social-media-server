import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { CommunityModel } from './community.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { CommunityDto } from './community.dto'
import { UserModel } from '../user/user.model'

@Injectable()
export class CommunityService {
	constructor(
		@InjectModel(CommunityModel)
		private readonly CommunityModel: ModelType<CommunityModel>,
		@InjectModel(UserModel)
		private readonly UserModel: ModelType<UserModel>,
	) {
	}

	async getAllCommunities() {
		return this.CommunityModel.find().sort({ members: -1 }).exec()
	}

	async getOneCommunity(communityId: Types.ObjectId) {
		return this.CommunityModel.findById(communityId)
			.populate('posts', 'text image createdAt')
			.exec()
	}

	async getUserCommunities(userId: Types.ObjectId) {
		const { communities } = await this.UserModel.findById(userId)
			.populate('communities', '_id name members communityAvatar genre')
			.exec()

		return communities
	}

	async createCommunity(userId: Types.ObjectId, dto: CommunityDto) {
		const user = await this.UserModel.findById(userId)
		if (dto.description) {
			const community = await this.CommunityModel.create({
				name: dto.name,
				genre: dto.genre,
				description: dto.description,
				communityAvatar: dto.communityAvatar,
				communityBackgroundPic: dto.communityBackgroundPic,
				creator: userId,
				members: [userId],
				posts: [],
			})

			user.communities.push(community._id)
			await user.save()

			return community
		} else {
			const community = await this.CommunityModel.create({
				name: dto.name,
				genre: dto.genre,
				creator: userId,
				members: [userId],
				posts: [],
			})

			user.communities.push(community._id)
			await user.save()

			return community
		}
	}

	async updateCommunity(communityId: Types.ObjectId, dto: CommunityDto) {
		const community = await this.CommunityModel.findById(communityId)

		if (dto.name) community.name = dto.name
		if (dto.description) community.description = dto.description
		if (dto.communityAvatar) community.communityAvatar = dto.communityAvatar
		if (dto.communityBackgroundPic)
			community.communityBackgroundPic = dto.communityBackgroundPic

		return community.save()
	}

	async deleteCommunity(communityId: Types.ObjectId) {
		const deleteCommunity = await this.CommunityModel.findByIdAndDelete({
			_id: communityId,
		})
		if (!deleteCommunity) throw new NotFoundException('Сообщество не найден')
		return deleteCommunity
	}

	async toggleSubscribe(userId: Types.ObjectId, communityId: Types.ObjectId) {
		const community = await this.CommunityModel.findById(communityId)
		const user = await this.UserModel.findById(userId)

		if (community.members.includes(userId)) {
			community.members = community.members.filter(
				(_id) => _id.toString() !== userId.toString(),
			)
			user.communities = user.communities.filter(
				(_id) => _id.toString() !== communityId.toString(),
			)
		} else {
			community.members.push(userId)
			user.communities.push(communityId)
		}
		await user.save()
		return await community.save()
	}

	async searchAllCommunities(search: string) {
		return this.CommunityModel.find({
			$or: [{ name: new RegExp(search, 'i') }],
		})
			.select('name communityAvatar members genre')
			.sort('desc')
			.exec()
	}

	async isSubscribedUser(userId: Types.ObjectId, communityId: Types.ObjectId) {
		const user = await this.UserModel.findById(userId)

		const isSubscribed = user.communities.filter(
			(_id) => _id.toString() === communityId.toString(),
		)

		return isSubscribed.length > 0
	}

	async searchUserCommunities(userId: Types.ObjectId, searchTerm: string) {
		const user = await this.UserModel.findById(userId)
			.select('communities')
			.lean()
			.exec()

		if (!user || !user.communities?.length) {
			return []
		}

		const query = {
			_id: { $in: user.communities },
			...(searchTerm && {
				name: new RegExp(searchTerm, 'i'),
			}),
		}

		return this.CommunityModel.find(query)
			.select('name communityAvatar members genre')
			.sort({ createdAt: -1 })
			.lean()
			.exec()
	}
}
