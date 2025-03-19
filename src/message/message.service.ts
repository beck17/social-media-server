import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { MessageModel } from './message.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { MessageDto } from './message.dto'
import { ConversationService } from '../conversation/conversation.service'

@Injectable()
export class MessageService {
	constructor(
		@InjectModel(MessageModel)
		private readonly MessageModel: ModelType<MessageModel>,
		private readonly ConversationService: ConversationService,
	) {
	}

	async getMessages(userFrom: Types.ObjectId, userTo: Types.ObjectId) {
		return this.MessageModel.find({
			userTo,
			userFrom,
		})
			.populate('userTo', 'firstName')
			.populate('userFrom', 'firstName')
			.exec()
	}

	async createMessage(
		userFrom: Types.ObjectId,
		{ userTo, text, conversationId }: MessageDto,
	) {
		if (text === '') throw new BadRequestException('Сообщение пустое')

		let conversation = await this.ConversationService.getById(conversationId)

		if (!conversation) {
			await this.ConversationService.createConversation(userFrom, userTo)
		}

		const newMessage = await this.MessageModel.create({
			userTo,
			userFrom,
			text,
			conversationId,
		})

		return this.ConversationService.pushNewMessage(
			new Types.ObjectId(conversationId),
			newMessage._id,
		)
	}

	async deleteMessage(id) {
		return this.MessageModel.findByIdAndDelete(id).exec()
	}
}
