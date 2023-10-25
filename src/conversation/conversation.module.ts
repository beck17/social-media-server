import { Module } from '@nestjs/common'
import { ConversationService } from './conversation.service'
import { ConversationController } from './conversation.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { ConversationModel } from './conversation.model'
import { MessageModel } from '../message/message.model'

@Module({
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: ConversationModel,
				schemaOptions: { collection: 'conversations' },
			},
		]),
		TypegooseModule.forFeature([
			{
				typegooseClass: MessageModel,
				schemaOptions: { collection: 'messages' },
			},
		]),
	],
	controllers: [ConversationController],
	providers: [ConversationService],
	exports: [ConversationService],
})
export class ConversationModule {}
