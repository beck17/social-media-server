import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CommunityModel } from './community.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { CommunityDto } from './community.dto';

@Injectable()
export class CommunityService {
	constructor(
		@InjectModel(CommunityModel)
		private readonly CommunityModel: ModelType<CommunityModel>,
	) {}

	async getAllCommunities() {
		return this.CommunityModel.find().sort({ name: 1 }).exec();
	}

	async getOneCommunity(communityId: Types.ObjectId) {
		return this.CommunityModel.findById(communityId);
	}

	async createCommunity(userId: Types.ObjectId, dto: CommunityDto) {
		if (dto.description) {
			return this.CommunityModel.create({
				name: dto.name,
				description: dto.description,
				creator: userId,
			});
		} else {
			return this.CommunityModel.create({
				name: dto.name,
				creator: userId,
			});
		}
	}

	async updateCommunity(communityId: Types.ObjectId, dto: CommunityDto) {
		const community = await this.CommunityModel.findById(communityId);

		if (dto.name) community.name = dto.name;
		if (dto.description) community.description = dto.description;

		return community.save();
	}

	async deleteCommunity(communityId: Types.ObjectId) {
		const deleteCommunity = await this.CommunityModel.findByIdAndDelete({
			_id: communityId,
		});
		if (!deleteCommunity) throw new NotFoundException('Сообщество не найден');
		return deleteCommunity;
	}

	async toggleSubscribe(userId: Types.ObjectId, communityId: Types.ObjectId) {
		const community = await this.CommunityModel.findById(communityId);

		if (community.members.includes(userId)) {
			community.members = community.members.filter(
				(_id) => _id.toString() !== userId.toString(),
			);
		} else {
			community.members.push(userId);
		}

		return await community.save();
	}
}
