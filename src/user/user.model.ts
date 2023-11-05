import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref } from '@typegoose/typegoose';
import { CommunityModel } from '../community/community.model';

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	phoneNumber: number;

	@prop()
	firstName: string;

	@prop()
	lastName: string;

	@prop()
	password: string;

	@prop()
	avatar?: string;

	@prop()
	backgroundPic?: string;

	@prop()
	city?: string;

	@prop()
	birthday?: string;

	@prop({ default: [], ref: () => UserModel })
	friends: Ref<UserModel>[];

	@prop({ default: [], ref: () => CommunityModel })
	communities: Ref<CommunityModel>[];

	@prop()
	postCount?: number;
}
