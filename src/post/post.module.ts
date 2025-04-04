import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { PostModel } from './post.model'
import { UserModel } from '../user/user.model'
import { UserService } from '../user/user.service'
import { CommunityPostModel } from '../community-post/community-post.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: PostModel,
				schemaOptions: { collection: 'posts' },
			},{
				typegooseClass: UserModel,
				schemaOptions: { collection: 'users' },
			},{
				typegooseClass: CommunityPostModel,
				schemaOptions: { collection: 'community-posts' },
			},
		]),
	],
	controllers: [PostController],
	providers: [PostService, UserService],
	exports: [PostService],
})
export class PostModule {}
