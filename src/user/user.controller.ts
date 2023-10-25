import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
} from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Types } from 'mongoose'
import { UserDto } from './user.dto'

@Controller('user')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('_id') userId: Types.ObjectId) {
		return this.UserService.getProfile(userId)
	}

	@Get('profile/:id')
	@Auth()
	async getProfileById(@Param('id') userId: string) {
		return this.UserService.getProfile(new Types.ObjectId(userId))
	}

	@Post(':friendId')
	@Auth()
	@HttpCode(200)
	async addToFriend(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Param('friendId') friendIs: Types.ObjectId,
	) {
		return this.UserService.addToFriend(userId, friendIs)
	}

	@Put(':friendId')
	@Auth()
	@HttpCode(200)
	async removeFromFriend(
		@CurrentUser('_id') userId: Types.ObjectId,
		@Param('friendId') friendId: Types.ObjectId,
	) {
		return this.UserService.removeFromFriend(userId, friendId)
	}

	@Put()
	@Auth()
	async updateProfile(
		@CurrentUser('_id') id: Types.ObjectId,
		@Body() dto: UserDto,
	) {
		return this.UserService.updateProfile(id, dto)
	}

	@Get('friend/:friendId')
	@Auth()
	async isFriend(
		@CurrentUser('_id') id: Types.ObjectId,
		@Param('friendId') friendId: Types.ObjectId,
	) {
		return this.UserService.isFriend(id, friendId)
	}

	@Get('search/:search')
	@Auth()
	async searchProfile(@Param('search') search: string) {
		return this.UserService.searchProfile(search)
	}
}
