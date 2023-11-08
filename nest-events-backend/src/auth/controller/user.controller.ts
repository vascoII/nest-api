import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create.user.dto';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/auth.service';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  async login(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Passowrd are not indentical']);
    }

    const existingUser = await this.userService.getUserByUsernameOrEmail(
      createUserDto.username,
      createUserDto.email,
    );
    console.log(existingUser);
    if (existingUser) {
      throw new BadRequestException([
        'User with same username or email already registered',
      ]);
    }

    const user = await this.userService.registerNewUser(createUserDto);
    return {
      user: user,
      token: this.authService.getTokenForUser(user),
    };
  }
}
