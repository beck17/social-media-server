import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { getMongoConfig } from './config/mogno.config'
import { AuthModule } from './auth/auth.module'
import { PostModule } from './post/post.module';
import { PostCommentsModule } from './post-comments/post-comments.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		AuthModule,
		PostModule,
		PostCommentsModule,
		PostLikesModule,
		MessageModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
