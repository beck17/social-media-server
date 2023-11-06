import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { PostModel } from './post.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { PostDto } from './post.dto';
import { Types } from 'mongoose';
import { CommunityModel } from '../community/community.model';

@Injectable()
export class PostService {
	constructor(
		@InjectModel(PostModel)
		private readonly PostModel: ModelType<PostModel>,
		@InjectModel(CommunityModel)
		private readonly CommunityModel: ModelType<CommunityModel>,
	) {}

	async getAllPosts() {
		return this.PostModel.find()
			.sort({ createdAt: -1 })
			.populate('user', 'firstName lastName avatar')
			.populate('comments', '_id')
			.exec();
	}

	async getUserPosts(userId: Types.ObjectId) {
		return this.PostModel.find({ user: userId })
			.sort({ createdAt: -1 })
			.populate('user', 'firstName lastName avatar')
			.populate('comments', '_id')
			.exec();
	}

	async getPostByUserId(postId: Types.ObjectId) {
		return this.PostModel.findById(postId);
	}

	async createPost(userId: Types.ObjectId, dto: PostDto) {
		if (dto.image) {
			return this.PostModel.create({
				user: userId,
				text: dto.text,
				image: dto.image,
			});
		} else {
			return this.PostModel.create({
				user: userId,
				text: dto.text,
			});
		}
	}

	async createCommunityPost(
		userId: Types.ObjectId,
		communityId: Types.ObjectId,
		{ text, image }: PostDto,
	) {
		const post = await this.PostModel.create({
			user: userId,
			text,
			image,
			community: communityId,
		});

		const community = await this.CommunityModel.findById(communityId);
		community.post.push(communityId);
		community.save();

		return post;
	}

	async deletePostById(postId: Types.ObjectId) {
		const deletePost = await this.PostModel.findByIdAndDelete({ _id: postId });
		if (!deletePost) throw new NotFoundException('Пост не найден');
		return deletePost;
	}

	async updatePost(postId: Types.ObjectId, dto: PostDto) {
		const post = await this.getPostByUserId(postId);

		if (dto.text) post.text = dto.text;
		if (dto.image) post.image = dto.image;

		return post.save();
	}

	async pushComment(postId, commentId) {
		return this.PostModel.findByIdAndUpdate(postId, {
			$push: {
				comments: commentId,
			},
		});
	}

	async pullComment(postId, commentId) {
		return this.PostModel.findByIdAndUpdate(postId, {
			$pull: {
				comments: commentId,
			},
		});
	}
}
