import {
  Controller,
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  NotFoundException,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventIdDto } from './dto/event-id.dto';
import { EventCreateDto } from './dto/event-create.dto';
import { EventUpdateDto } from './dto/event-update.dto';
import { Event } from './entity/event.entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubtractSixMonthsPipe } from './pipe/subtract-six-months.pipe';
import { Attendee } from './entity/attendee.entity';
import { EventsService } from './service/events.service';
import { ListEvents, WhenEventFilter } from './dto/list.events';
import { Profile } from 'src/auth/entity/profile.entity';
import { User } from 'src/auth/entity/user.entity';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventsService: EventsService,
  ) {}

  private readonly logger = new Logger(EventsController.name);

  @Get()
  async findAll(@Query() filter: ListEvents) {
    console.log('Raw Query:', filter);
    const filterString = JSON.stringify(filter);
    this.logger.log(filterString); // Log the JSON string

    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          limit: 10,
          currentPage: filter.page ?? 1,
          total: true,
        },
      );

    return events;
  }

  @Get('/practice')
  async pracice() {
    return await this.repository.find({
      select: ['id', 'description', 'address'],
      where: [
        {
          id: MoreThan(2),
          when: MoreThan(new Date('03/03/2022')),
        },
        {
          description: Like('%01%'),
        },
      ],
      //Limit
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }

  @Get('/practice2')
  async pracice2() {
    // const event = await this.repository.findOne({
    //   where: { id: 1 },
    //   relations: ['attendees'],
    // });
    // if (!event) {
    //   throw new NotFoundException(`Event with ID 1 not found`);
    // }
    // return event;
    const event = await this.repository.findOne({
      where: { id: 1 },
    });

    const attendee = new Attendee();
    attendee.name = 'Jerry';
    attendee.event = event;

    await this.attendeeRepository.save(attendee);
    return event;
  }

  @Get('/practice3')
  async pracice3() {
    const user = new User();
    user.username = 'username';
    user.password = 'password';
    user.email = 'email';
    user.firstName = 'firstName';
    user.lastName = 'lastName';

    const profile = new Profile();
    profile.age = 123;
    user.profile = profile;

    await this.userRepository.save(user);
  }

  @Get(':id')
  async findOne(@Param() param: EventIdDto): Promise<Event> {
    // const event = await this.repository.findOne({
    //   where: { id: param.id },
    // });
    const event = await this.eventsService.getEvent(param.id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${param.id} not found`);
    }

    return event;
  }

  @Post()
  async create(
    @Body(SubtractSixMonthsPipe) input: EventCreateDto,
  ): Promise<Event> {
    return await this.repository.save({ ...input });
  }

  @Patch(':id')
  async update(@Param() param: EventIdDto, @Body() input: EventUpdateDto) {
    const event = await this.repository.findOne({
      where: { id: param.id },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${param.id} not found`);
    }

    const updateData: Partial<EventUpdateDto> = { ...input };
    await this.repository.update(param.id, updateData);
    return await this.repository.findOne({
      where: { id: param.id },
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param() param: EventIdDto) {
    const result = await this.eventsService.deleteEvent(param.id);
    if (result?.affected !== 1) {
      throw new NotFoundException();
    }
  }
}
