import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Event } from '../events/event.entity';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: process.env.DB_TYPE as 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    entities: [Event],
    synchronize: false,
  }),
);
