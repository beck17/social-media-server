import { IsString, MinLength } from 'class-validator'

export class LoginDto {
	@IsString()
	phoneNumber: string

	@MinLength(6, {
		message: 'Пароль должен быть минимум 6 символов',
	})
	@IsString()
	password: string
}
