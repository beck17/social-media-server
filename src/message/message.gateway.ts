import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { MessageService } from './message.service'
import { ConversationService } from '../conversation/conversation.service'
import { Types } from 'mongoose'
import { MessageDto } from './message.dto'

@WebSocketGateway(8080, { cors: true })
export class MessageGateway {
	constructor(
		private readonly MessageService: MessageService,
		private readonly ConversationService: ConversationService,
	) {
	}

	@WebSocketServer()
	server

	@SubscribeMessage('message:get')
	async getConversation(@MessageBody('conversationId') conversationId: Types.ObjectId) {
		const conversation = await this.ConversationService.getById(
			new Types.ObjectId(conversationId),
		)
		await this.server.emit('conversation', conversation)
	}

	@SubscribeMessage('message:add')
	async addMessage(@MessageBody() dto: MessageDto) {
		await this.MessageService.createMessage(
			new Types.ObjectId(dto.userFrom),
			dto,
		)
		await this.getConversation(dto.conversationId)
	}

	// @SubscribeMessage('message')
	// async handleMessage(
	// 	@MessageBody('conversationId') conversationId: Types.ObjectId,
	// ) {
	// 	await this.server.emit('message', conversationId)
	// }
}
