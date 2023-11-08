import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({ usernameField: 'username' }); // Assurez-vous que votre stratégie sait que 'username' est le champ à utiliser
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      this.logger.debug(`User ${username} does not exist`);
      throw new UnauthorizedException();
    }

    // Vous devriez utiliser bcrypt pour vérifier le mot de passe ici
    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for ${username}`);
      throw new UnauthorizedException();
    }

    // Passport attend que vous retourniez l'utilisateur ici
    return user;
  }
}
