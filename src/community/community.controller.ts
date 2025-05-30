import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { Types } from 'mongoose';
import { CommunityDto } from './community.dto';

@Controller('community')
export class CommunityController {
	constructor(private readonly CommunityService: CommunityService) {}

	@Auth()
	@Get()
	getAllCommunities() {
		return this.CommunityService.getAllCommunities();
	}

	@Auth()
	@Get(':communityId')
	getOneCommunity(@Param('communityId') communityId: Types.ObjectId) {
		return this.CommunityService.getOneCommunity(communityId);
	}

	@Auth()
	@Get('user/:userId')
	@HttpCode(200)
	getUserCommunities(@Param('userId') userId: Types.ObjectId) {
		return this.CommunityService.getUserCommunities(userId);
	}

	@Auth()
	@Get('search/:search')
	@HttpCode(200)
	searchCommunities(@Param('search') search: string) {
		return this.CommunityService.searchAllCommunities(search);
	}

	@Auth()
	@Post()
	@HttpCode(200)
	createCommunity(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Body() dto: CommunityDto,
	) {
		return this.CommunityService.createCommunity(userId, dto);
	}

	@Auth()
	@Put(':communityId')
	updateCommunity(
		@Param('communityId') communityId: Types.ObjectId,
		@Body() dto: CommunityDto,
	) {
		return this.CommunityService.updateCommunity(communityId, dto);
	}

	@Auth()
	@Delete(':communityId')
	deleteCommunity(@Param('communityId') communityId: Types.ObjectId) {
		return this.CommunityService.deleteCommunity(communityId);
	}

	@Auth()
	@Post(':communityId')
	@HttpCode(200)
	toggleSubscribe(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Param('communityId') communityId: Types.ObjectId,
	) {
		return this.CommunityService.toggleSubscribe(userId, communityId);
	}

	@Auth()
	@Get('userSub/:communityId')
	@HttpCode(200)
	isSubscribedUser(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Param('communityId') communityId: Types.ObjectId,
	) {
		return this.CommunityService.isSubscribedUser(userId, communityId);
	}

	@Get('searchCommunities/:search')
	@Auth()
	async searchUserCommunities(
		@CurrentUser('_id') id: Types.ObjectId,
		@Param('search') search: string,
	) {
		return this.CommunityService.searchUserCommunities(id, search)
	}
}
