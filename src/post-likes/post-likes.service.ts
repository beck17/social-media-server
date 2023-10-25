import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { PostLikeModel } from './post-like.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { PostLikeDto } from './post-like.dto'

@Injectable()
export class PostLikesService {
	constructor(
		@InjectModel(PostLikeModel)
		private readonly PostLikeModel: ModelType<PostLikeModel>,
	) {}

	async isExists(userId: Types.ObjectId, postId: Types.ObjectId) {
		const liked = await this.PostLikeModel.exists({
			user: userId,
			post: postId,
		}).exec()
		return !!liked
	}

	async getCount(postId: Types.ObjectId) {
		const count = await this.PostLikeModel.find({ post: postId }).exec()
		return count.length
	}

	async toggleLike(userId: Types.ObjectId, { postId }: PostLikeDto) {
		const liked = await this.PostLikeModel.exists({
			user: userId,
			post: postId,
		}).exec()

		if (!!liked) {
			return this.PostLikeModel.findOneAndDelete({
				user: userId,
				post: postId,
			}).exec()
		}

		return this.PostLikeModel.create({
			user: userId,
			post: postId,
		})
	}
}
