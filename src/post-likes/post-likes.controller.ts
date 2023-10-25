import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { PostLikesService } from './post-likes.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Types } from 'mongoose'
import { PostLikeDto } from './post-like.dto'

@Controller('post-likes')
export class PostLikesController {
	constructor(private readonly postLikesService: PostLikesService) {}

	@Auth()
	@Get(':postId')
	@HttpCode(200)
	async checkExists(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Param('postId') postId: Types.ObjectId,
	) {
		return this.postLikesService.isExists(userId, postId)
	}

	@Auth()
	@Get('count/:postId')
	@HttpCode(200)
	async getCount(@Param('postId') postId: Types.ObjectId) {
		return this.postLikesService.getCount(postId)
	}

	@Auth()
	@Post()
	@HttpCode(200)
	async createLike(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Body() dto: PostLikeDto,
	) {
		return this.postLikesService.toggleLike(userId, dto)
	}
}
