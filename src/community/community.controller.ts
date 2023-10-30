import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CommunityService } from './community.service';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('community')
export class CommunityController {
	constructor(private readonly CommunityService: CommunityService) {}

	@Auth()
	@Get()
	getAllCommunities() {}

	@Auth()
	@Get()
	getOneCommunity() {}

	@Auth()
	@Post()
	createCommunity() {}

	@Auth()
	@Put()
	updateCommunity() {}

	@Auth()
	@Delete()
	deleteCommunity() {}
}
