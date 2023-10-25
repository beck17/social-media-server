import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ConversationModel } from './conversation.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { MessageModel } from '../message/message.model'

@Injectable()
export class ConversationService {
	constructor(
		@InjectModel(ConversationModel)
		private readonly ConversationModel: ModelType<ConversationModel>,
		@InjectModel(MessageModel)
		private readonly MessageModel: ModelType<MessageModel>,
	) {}

	async getById(id: Types.ObjectId) {
		return this.ConversationModel.findById(id)
			.populate({
				path: 'messages',
				populate: ['userFrom', 'userTo'],
			})
			.exec()
	}

	async createConversation(userId: Types.ObjectId, withUserId: Types.ObjectId) {
		let message = await this.MessageModel.findOne({
			userTo: userId,
			userFrom: withUserId,
		})

		if (!message) {
			// @ts-ignore
			message = await this.MessageModel.findOne({
				userTo: withUserId,
				userFrom: userId,
			})
		}

		if (message) {
			return this.ConversationModel.findOne({ messages: message._id })
		}

		return this.ConversationModel.create({
			messages: [],
		})
	}

	async pushNewMessage(
		conversationId: Types.ObjectId,
		messageId: Types.ObjectId,
	) {
		const conversation = await this.ConversationModel.findById(
			conversationId,
		).exec()
		if (!conversation) throw new NotFoundException('Диалог не найден')

		conversation.messages = [...conversation.messages, messageId]

		return conversation.save()
	}
}
