// dto/create.user.dto.ts

import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';
import { User } from '../entity/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(5)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(8)
  retypedPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(5)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(5)
  lastName: string;

  /**
   * toUser
   */
  public toUser() {
    const user = new User();
    user.username = this.username;
    user.password = this.password;
    user.email = this.email;
    user.firstName = this.firstName;
    user.lastName = this.lastName;

    return user;
  }
}
