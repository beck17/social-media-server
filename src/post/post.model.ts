import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { UserModel } from '../user/user.model';
import { PostCommentsModel } from '../post-comments/post-comments.model';
import { CommunityModel } from '../community/community.model';

export interface PostModel extends Base {}

export class PostModel extends TimeStamps {
	@prop()
	text: string;

	@prop()
	image?: string;

	@prop({ ref: () => UserModel })
	user: Ref<UserModel>;

	@prop({ ref: () => CommunityModel })
	community?: Ref<CommunityModel>;

	@prop({ default: [], ref: () => PostCommentsModel })
	comments: Ref<UserModel>[];
}
