import { IsString } from 'class-validator'
import { IsObjectId } from 'class-validator-mongo-object-id'

export class MessageDto {
	@IsString()
	text: string

	@IsObjectId()
	userTo: string

	@IsObjectId()
	userFrom: string

	@IsObjectId()
	conversationId: string
}
