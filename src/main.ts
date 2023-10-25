import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function start() {
	const app = await NestFactory.create(AppModule, { cors: true })
	app.setGlobalPrefix('api')

	await app.listen(5000, () => {
		console.log('SERVER START')
	})
}

start()
