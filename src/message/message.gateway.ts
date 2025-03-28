import {
	ConnectedSocket,
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets'
import { MessageService } from './message.service'
import { ConversationService } from '../conversation/conversation.service'
import { Types } from 'mongoose'
import { MessageDto } from './message.dto'

@WebSocketGateway({
	cors: true,
	transports: ['websocket'],
})
export class MessageGateway {
	constructor(
		private readonly MessageService: MessageService,
		private readonly ConversationService: ConversationService,
	) {
	}

	@WebSocketServer()
	server

	@SubscribeMessage('join-conversation')
	handleJoinConversation(
		@ConnectedSocket() client,
		@MessageBody() conversationId: string,
	) {
		client.join(conversationId)
	}

	@SubscribeMessage('leave-conversation')
	handleLeaveConversation(
		@ConnectedSocket() client,
		@MessageBody() conversationId: string,
	) {
		client.leave(conversationId)
	}

	@SubscribeMessage('message:get')
	async getConversation(
		@ConnectedSocket() client,
		@MessageBody('conversationId') conversationId: Types.ObjectId,
	) {
		const conversation = await this.ConversationService.getById(
			new Types.ObjectId(conversationId),
		)

		client.to(conversationId).emit(`conversation:${conversationId}`, conversation)
	}

	@SubscribeMessage('message:add')
	async addMessage(
		@ConnectedSocket() client,
		@MessageBody() dto: MessageDto,
	) {
		await this.MessageService.createMessage(
			new Types.ObjectId(dto.userFrom),
			dto,
		)

		client.to(dto.conversationId).emit(`conversation:${dto.conversationId}`,
			await this.ConversationService.getById(dto.conversationId),
		)
	}
}
