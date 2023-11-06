import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from '../events/entity/event.entity';
import { registerAs } from '@nestjs/config';
import { Attendee } from 'src/events/entity/attendee.entity';
import { Subject } from 'rxjs';
import { Teacher } from 'src/school/teacher.entity';
import { User } from 'src/auth/entity/user.entity';
import { Profile } from 'src/auth/entity/profile.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: process.env.DB_TYPE as 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, Subject, Teacher, User, Profile],
    //synchronize: false,
    synchronize: true, // WARNING NEVER TO DO IN REAL PROD
  }),
);
