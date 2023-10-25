import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { ConversationService } from './conversation.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { Types } from 'mongoose'
import { ConversationDto } from './conversation.dto'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('conversation')
export class ConversationController {
	constructor(private readonly ConversationService: ConversationService) {}

	@Get('/:conversationId')
	@Auth()
	async getComments(@Param('conversationId') id: Types.ObjectId) {
		return this.ConversationService.getById(id)
	}

	@Post()
	@Auth()
	@HttpCode(200)
	async createConversation(
		@Body() { withUserId }: ConversationDto,
		@CurrentUser('_id') userId: Types.ObjectId,
	) {
		return this.ConversationService.createConversation(
			userId,
			new Types.ObjectId(withUserId),
		)
	}
}
