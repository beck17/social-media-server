import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { PostService } from './post.service'
import { Types } from 'mongoose'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { PostDto } from './post.dto'

@Controller('post')
export class PostController {
	constructor(private readonly PostService: PostService) {}

	@Auth()
	@Get()
	async getAllPosts() {
		return this.PostService.getAllPosts()
	}

	@Auth()
	@Get('/user/:userId')
	async getUserPosts(@Param('userId') userId: Types.ObjectId) {
		return this.PostService.getUserPosts(userId)
	}

	@Auth()
	@Get(':postId')
	async getPostById(@Param('postId') postId: Types.ObjectId) {
		return this.PostService.getPostByUserId(postId)
	}

	@Post()
	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	async createPost(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Body() dto: PostDto,
	) {
		return this.PostService.createPost(userId, dto)
	}

	@Delete(':id')
	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	async deletePost(@Param('id') id: Types.ObjectId) {
		return this.PostService.deletePostById(id)
	}

	@Put(':postId')
	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	async updatePost(
		@Param('postId') postId: Types.ObjectId,
		@Body() dto: PostDto,
	) {
		return this.PostService.updatePost(postId, dto)
	}
}
