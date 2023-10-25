import { IsOptional, IsString } from 'class-validator'

export class PostDto {
	@IsString()
	text: string

	@IsString()
	@IsOptional()
	image?: string
}
