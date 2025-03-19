import { IsString } from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'
import { Types } from 'mongoose'

export class MessageDto {
	@IsString()
	text: string

	@IsObjectId()
	userTo: Types.ObjectId

	@IsObjectId()
	userFrom: Types.ObjectId

	@IsObjectId()
	conversationId: Types.ObjectId
}
