import { Module } from '@nestjs/common'
import { path } from 'app-root-path'
import { ServeStaticModule } from '@nestjs/serve-static'

import { MediaService } from './media.service'
import { MediaController } from './media.controller'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads',
		}),
	],
	controllers: [MediaController],
	providers: [MediaService],
})
export class MediaModule {}
