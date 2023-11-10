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
} from '@nestjs/common';
import { CommunityPostService } from './community-post.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Types } from 'mongoose';
import { CommunityPostDto } from './community-post.dto';

@Controller('community-post')
export class CommunityPostController {
	constructor(private readonly CommunityPostService: CommunityPostService) {}

	@Post()
	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(200)
	createCommunityPost(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Body() dto: CommunityPostDto,
	) {
		return this.CommunityPostService.createCommunityPost(userId, dto);
	}

	@Get(':communityId')
	@Auth()
	@HttpCode(200)
	getCommunityPosts(@Param('communityId') communityId: Types.ObjectId) {
		return this.CommunityPostService.getCommunityPosts(communityId);
	}

	@Put(':communityPostId')
	@Auth()
	@HttpCode(200)
	updateCommunityPost(
		@Param('communityPostId') communityPostId: Types.ObjectId,
		@Body() dto: CommunityPostDto,
	) {
		return this.CommunityPostService.updateCommunityPost(communityPostId, dto);
	}

	@Delete(':communityPostId')
	@Auth()
	@HttpCode(200)
	deleteCommunityPost(
		@Param('communityPostId') communityPostId: Types.ObjectId,
	) {
		return this.CommunityPostService.deleteCommunityPost(communityPostId);
	}
}
