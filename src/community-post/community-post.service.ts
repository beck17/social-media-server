import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CommunityPostModel } from './community-post.model';
import { CommunityModel } from '../community/community.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { CommunityPostDto } from './community-post.dto';

@Injectable()
export class CommunityPostService {
	constructor(
		@InjectModel(CommunityPostModel)
		private readonly CommunityPostModel: ModelType<CommunityPostModel>,
		@InjectModel(CommunityModel)
		private readonly CommunityModel: ModelType<CommunityModel>,
	) {}

	async createCommunityPost(userId: Types.ObjectId, dto: CommunityPostDto) {
		const post = await this.CommunityPostModel.create({
			text: dto.text,
			image: dto.image,
			community: dto.communityId,
			user: userId,
		});

		const community = await this.CommunityModel.findById(dto.communityId);
		community.posts.push(post._id);
		await community.save();

		return post;
	}

	async getCommunityPosts(communityId: Types.ObjectId) {
		return this.CommunityPostModel.find({ community: communityId })
			.sort({ createdAt: -1 })
			.populate('community', 'name communityAvatar');
	}

	async updateCommunityPost(
		communityPostId: Types.ObjectId,
		dto: CommunityPostDto,
	) {
		const post = await this.CommunityPostModel.findById(communityPostId);

		if (dto.text) post.text = dto.text;
		if (dto.image) post.image = dto.image;

		return await post.save();
	}

	async deleteCommunityPost(communityPostId: Types.ObjectId) {
		return this.CommunityPostModel.findByIdAndDelete(communityPostId);
	}
}
