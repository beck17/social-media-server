import { prop, Ref } from '@typegoose/typegoose'
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { MessageModel } from '../message/message.model'
import { UserModel } from '../user/user.model'

export interface ConversationModel extends Base {
}

export class ConversationModel extends TimeStamps {
	@prop({ default: [], ref: () => MessageModel })
	messages: Ref<MessageModel>[]

	@prop({ required: true, ref: () => UserModel })
	participants: Ref<UserModel>[]

	@prop({ ref: () => MessageModel })
	lastMessage: Ref<MessageModel>

	@prop({ default: Date.now() })
	lastMessageAt: Date
}
