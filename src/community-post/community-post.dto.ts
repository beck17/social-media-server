import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class CommunityPostDto {
	@IsString()
	text: string;

	@IsString()
	@IsOptional()
	image?: string;

	@IsObjectId()
	communityId: Types.ObjectId;
}
