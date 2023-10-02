import { Request } from 'express';
import { ProfileService } from './profile.service';
import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ description: 'Get own profile based on current session', summary: 'Own profile' })
  @Get()
  me(@Req() req: Request) {
    return this.profileService.getProfile(req.session.userId);
  }
}
