import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop, Ref } from '@typegoose/typegoose'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
	@prop({ unique: true })
	phoneNumber: number

	@prop()
	firstName: string

	@prop()
	lastName: string

	@prop()
	password: string

	@prop()
	avatar?: string

	@prop()
	backgroundPic?: string

	@prop()
	city?: string

	@prop()
	birthday?: string

	@prop({ default: [], ref: () => UserModel })
	friends: Ref<UserModel>[]

	@prop()
	postCount?: number
}
