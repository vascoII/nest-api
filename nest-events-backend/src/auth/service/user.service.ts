import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create.user.dto';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  private getUserBaseQuery() {
    return this.userRepository.createQueryBuilder('u').orderBy('u.id', 'DESC');
  }

  /**
   * getUserByUsernameOrEmail
   * username: string : User
   * email: string : User
   */
  public async getUserByUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User> {
    const query = this.getUserBaseQuery()
      .andWhere('u.username = :username', {
        username,
      })
      .orWhere('u.email = :email', {
        email,
      });

    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  /**
   * registerNewUser
   * usernamme: string : User
   * email: string : User
   */
  public async registerNewUser(
    createUserDto: CreateUserDto,
  ): Promise<User | undefined> {
    const user = createUserDto.toUser();
    user.password = await this.authService.hashPassword(user.password);
    this.userRepository.save(user);

    return user;
  }
}
