import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { Types } from 'mongoose'
import { PostCommentsModel } from './post-comments.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { PostCommentsDto } from './dto/post-comments.dto'
import { UpdatePostCommentsDto } from './dto/update-post-comments.dto'
import { PostService } from '../post/post.service'

@Injectable()
export class PostCommentsService {
	constructor(
		@InjectModel(PostCommentsModel)
		private readonly PostCommentsModel: ModelType<PostCommentsModel>,
		private readonly PostService: PostService,
	) {}

	async getCommentsByPostId(postId: Types.ObjectId) {
		return this.PostCommentsModel.find({ postId }, '-__v')
			.sort({ crated_at: 'desc' })
			.populate('user', 'firstName lastName avatar')
			.exec()
	}

	async createComment(
		userId: Types.ObjectId,
		{ text, postId }: PostCommentsDto,
	) {
		const comment = await this.PostCommentsModel.create({
			text,
			postId,
			user: userId,
		})

		await this.PostService.pushComment(postId, comment._id)

		return comment.populate('user', 'firstName lastName avatar')
	}

	async updateComment(commentId: Types.ObjectId, dto: UpdatePostCommentsDto) {
		const comment = await this.PostCommentsModel.findByIdAndUpdate(commentId, {
			text: dto.text,
		}).exec()

		if (!comment) throw new Error('Коментария не существует')

		return comment
	}

	async removePostCommentsByPostId(postId: Types.ObjectId) {
		await this.PostCommentsModel.findByIdAndDelete({ _id: postId })

		return true
	}

	async deleteComment(commentId: Types.ObjectId) {
		const comment = await this.PostCommentsModel.findByIdAndDelete(commentId)

		await this.PostService.pullComment(comment.postId, comment._id)

		return comment
	}
}
