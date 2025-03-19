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
	) {
	}

	async getUserConversations(userId: Types.ObjectId) {
		return this.ConversationModel.find({
			participants: userId,
			messages: {
				$exists: true, $not: { $size: 0 },
			},
		})
			.populate('participants', 'firstName lastName avatar')
			.populate({
				path: 'lastMessage',
				select: 'text',
				options: { sort: { createdAt: -1 } },
			})
			.sort({ lastMessageAt: -1 })
			.exec()
	}

	async getById(id: Types.ObjectId) {
		return this.ConversationModel.findById(id)
			.populate({
				path: 'messages',
				populate: [
					{
						path: 'userFrom',
						select: 'avatar',
					},
					{
						path: 'userTo',
						select: 'avatar',
					},
				],
			})
			.exec()
	}

	async createConversation(userId: Types.ObjectId, withUserId: Types.ObjectId) {
		let message = await this.MessageModel.findOne({
			userTo: userId,
			userFrom: withUserId,
		})

		if (!message) {
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
			participants: [userId, withUserId],
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
		conversation.lastMessage = messageId
		conversation.lastMessageAt = new Date()

		return conversation.save()
	}
}
