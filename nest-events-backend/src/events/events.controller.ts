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
} from '@nestjs/common';
import { EventIdDto } from './dto/event-id.dto';
import { EventCreateDto } from './dto/event-create.dto';
import { EventUpdateDto } from './dto/event-update.dto';
import { Event } from './event-entity';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubtractSixMonthsPipe } from './pipe/subtract-six-months.pipe';

@Controller('/events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  @Get()
  async findall() {
    return await this.repository.find();
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

  @Get(':id')
  async findOne(@Param() param: EventIdDto): Promise<Event> {
    const event = await this.repository.findOne({
      where: { id: param.id },
    });
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
    const updateData: Partial<EventUpdateDto> = { ...input };
    await this.repository.update(param.id, updateData);
    return await this.repository.findOne({
      where: { id: param.id },
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param() param: EventIdDto) {
    const event = await this.repository.findOne({
      where: { id: param.id },
    });
    await this.repository.remove(event);
  }
}
