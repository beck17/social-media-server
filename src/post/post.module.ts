import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { PostModel } from './post.model';
import { CommunityModel } from '../community/community.model';

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: PostModel,
				schemaOptions: { collection: 'post' },
			},
			{
				typegooseClass: CommunityModel,
				schemaOptions: { collection: 'community' },
			},
		]),
	],
	controllers: [PostController],
	providers: [PostService],
	exports: [PostService],
})
export class PostModule {}
