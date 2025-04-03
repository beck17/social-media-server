import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function start() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	app.enableCors({
		origin: [
			'https://social-media-client-yaiw.onrender.com',
			'https://netly-mu.vercel.app',
			'http://localhost:3000'
		],
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: 'Content-Type, Authorization',
		credentials: true,
		preflightContinue: false,
		optionsSuccessStatus: 204
	});

	app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

	app.setGlobalPrefix('api');

	const port = process.env.PORT || 5000;

	await app.listen(port, () => {
		console.log(`Server started on port ${port}`);
		console.log(`Static files served from ${join(__dirname, '..', 'uploads')}`);
	});
}

start();