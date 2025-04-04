import { Module } from '@nestjs/common'
import { PostCommentsService } from './post-comments.service'
import { PostCommentsController } from './post-comments.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { PostCommentsModel } from './post-comments.model'
import { PostService } from '../post/post.service'
import { PostModel } from '../post/post.model'
import { UserModel } from '../user/user.model'
import { UserService } from '../user/user.service'
import { CommunityPostModel } from '../community-post/community-post.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: PostCommentsModel,
				schemaOptions: { collection: 'post-comments' },
			},
			{
				typegooseClass: PostModel,
				schemaOptions: { collection: 'posts' },
			},{
				typegooseClass: UserModel,
				schemaOptions: { collection: 'users' },
			},
			{
				typegooseClass: CommunityPostModel,
				schemaOptions: { collection: 'community-posts' },
			},
		]),
	],
	controllers: [PostCommentsController],
	providers: [PostCommentsService, PostService, UserService],
	exports: [PostCommentsService],
})
export class PostCommentsModule {}
