import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { EventsController } from './events.controller';
import { Attendee } from './entity/attendee.entity';
import { EventsService } from './service/events.service';
import { User } from '../auth/entity/user.entity';
import { Profile } from '../auth/entity/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee, User, Profile])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
