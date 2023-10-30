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
}
