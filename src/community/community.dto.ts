import { IsOptional, IsString } from 'class-validator';

export class CommunityDto {
	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;
}
