import { IsString } from 'class-validator'

export class ConversationDto {
	@IsString()
	withUserId: string
}
