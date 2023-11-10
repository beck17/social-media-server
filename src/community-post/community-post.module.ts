import { Module } from '@nestjs/common';
import { CommunityPostService } from './community-post.service';
import { CommunityPostController } from './community-post.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommunityPostModel } from './community-post.model';
import { CommunityModel } from '../community/community.model';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CommunityPostModel,
				schemaOptions: { collection: 'community-posts' },
			},
			{
				typegooseClass: CommunityModel,
				schemaOptions: { collection: 'community' },
			},
		]),
	],
	controllers: [CommunityPostController],
	providers: [CommunityPostService],
})
export class CommunityPostModule {}
