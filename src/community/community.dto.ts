import { IsOptional, IsString } from 'class-validator';

export class CommunityDto {
	@IsString()
	name: string;

	@IsString()
	genre: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	communityAvatar?: string;

	@IsString()
	@IsOptional()
	communityBackgroundPic?: string;
}
