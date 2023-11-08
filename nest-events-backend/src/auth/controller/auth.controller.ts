import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../service/auth.service';
import { CurrentUser } from '../decorator/current-user.decorator';
import { User } from '../entity/user.entity';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}
