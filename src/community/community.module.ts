import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommunityModel } from './community.model';

@Module({
	controllers: [CommunityController],
	providers: [CommunityService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: CommunityModel,
				schemaOptions: { collection: 'community' },
			},
		]),
	],
})
export class CommunityModule {}
