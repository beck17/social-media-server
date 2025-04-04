import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { PostModel } from './post.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { PostDto } from './post.dto'
import { Types } from 'mongoose'
import { UserModel } from '../user/user.model'
import { CommunityPostModel } from '../community-post/community-post.model'

@Injectable()
export class PostService {
	constructor(
		@InjectModel(PostModel)
		private readonly PostModel: ModelType<PostModel>,
		@InjectModel(UserModel)
		private readonly UserModel: ModelType<UserModel>,
		@InjectModel(CommunityPostModel)
		private readonly CommunityPostModel: ModelType<CommunityPostModel>,
	) {
	}

	async getAllPosts() {
		return this.PostModel.find()
			.sort({ createdAt: -1 })
			.populate('user', 'firstName lastName avatar')
			.populate('comments', '_id')
			.exec()
	}

	async getUserFeed(userId: Types.ObjectId) {
		const user = await this.UserModel.findById(userId)

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const userPosts = await this.PostModel.find({
			user: {
				$in: [userId,
					...user.friends,
					...user.outgoingRequestFriends],
			},
		})
			.sort({ createdAt: -1 })
			.populate('user', 'firstName lastName avatar')
			.populate('comments', '_id')
			.exec()

		const communityPosts = await this.CommunityPostModel.find({
			community: {
				$in: user.communities,
			},
		})
			.sort({ createdAt: -1 })
			.populate('community', 'name communityAvatar')
			.exec()

		return [...userPosts, ...communityPosts]
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
	}

	async getUserPosts(userId: Types.ObjectId) {
		return this.PostModel.find({ user: userId })
			.sort({ createdAt: -1 })
			.populate('user', 'firstName lastName avatar')
			.populate('comments', '_id')
			.exec()
	}

	async getPostByUserId(postId: Types.ObjectId) {
		return this.PostModel.findById(postId)
	}

	async createPost(userId: Types.ObjectId, dto: PostDto) {
		if (dto.image) {
			return this.PostModel.create({
				user: userId,
				text: dto.text,
				image: dto.image,
			})
		} else {
			return this.PostModel.create({
				user: userId,
				text: dto.text,
			})
		}
	}

	async deletePostById(postId: Types.ObjectId) {
		const deletePost = await this.PostModel.findByIdAndDelete({ _id: postId })
		if (!deletePost) throw new NotFoundException('Пост не найден')
		return deletePost
	}

	async updatePost(postId: Types.ObjectId, dto: PostDto) {
		const post = await this.getPostByUserId(postId)

		if (dto.text) post.text = dto.text
		if (dto.image) post.image = dto.image

		return post.save()
	}

	async pushComment(postId, commentId) {
		return this.PostModel.findByIdAndUpdate(postId, {
			$push: {
				comments: commentId,
			},
		})
	}

	async pullComment(postId, commentId) {
		return this.PostModel.findByIdAndUpdate(postId, {
			$pull: {
				comments: commentId,
			},
		})
	}
}
