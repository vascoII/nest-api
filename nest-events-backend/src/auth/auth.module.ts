import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
// Import ConfigModule and ConfigService
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the config globally available
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_SECRET'), // Use ConfigService to access environment variables
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  providers: [LocalStrategy, AuthService, JwtStrategy, UserService],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
