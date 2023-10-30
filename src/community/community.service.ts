import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { CommunityModel } from './community.model';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class CommunityService {
	constructor(
		@InjectModel(CommunityModel)
		private readonly CommunityModel: ModelType<CommunityModel>,
	) {}

	async getAllCommunities() {}

	async getOneCommunity() {}

	async createCommunity() {}

	async updateCommunity() {}

	async deleteCommunity() {}
}
