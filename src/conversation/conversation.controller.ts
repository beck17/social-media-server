import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common'
import { ConversationService } from './conversation.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { Types } from 'mongoose'
import { ConversationDto } from './conversation.dto'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('conversation')
export class ConversationController {
	constructor(private readonly ConversationService: ConversationService) {
	}


	@Get('/:conversationId')
	@Auth()
	async getConversationById(@Param('conversationId') id: Types.ObjectId) {
		return this.ConversationService.getById(id)
	}

	@Get('search/:searchTerm')
	@Auth()
	async searchUserConversation(
		@CurrentUser() userId: Types.ObjectId,
		@Param('searchTerm') search: string,
	) {
		return this.ConversationService.searchUserConversation(userId, search)
	}

	@Get()
	@Auth()
	async getUserConversations(@CurrentUser('_id') userId: Types.ObjectId) {
		return this.ConversationService.getUserConversations(userId)
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
