import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { UserModel } from '../user/user.model';
import { PostModel } from '../post/post.model';

export interface CommunityModel extends Base {}

export class CommunityModel extends TimeStamps {
	@prop({ required: true, unique: true })
	name: string;

	@prop()
	description?: string;

	@prop({ type: String, default: '/uploads/default/no-avatar.jpg' })
	communityAvatar: string;

	@prop({ type: String, default: '/uploads/default/background.jpg' })
	communityBackgroundPic: string;

	@prop({ ref: () => UserModel })
	creator: Ref<UserModel>; // Связь с моделью пользователя (если необходимо)

	@prop({ ref: () => UserModel, default: [] })
	members: Ref<UserModel>[]; // Массив участников сообщества

	@prop({ ref: () => UserModel, default: [] })
	admins: Ref<UserModel>[]; // Массив администраторов сообщества

	@prop({ ref: () => PostModel, default: [] })
	posts: Ref<PostModel>[]; // Массив публикаций сообщества
}
