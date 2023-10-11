// pipes/subtract-six-months.pipe.ts

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { EventCreateDto } from '../dto/event-create.dto';

@Injectable()
export class SubtractSixMonthsPipe implements PipeTransform {
  transform(value: EventCreateDto, metadata: ArgumentMetadata): EventCreateDto {
    const date = new Date(value.when);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format for "when"');
    }

    date.setMonth(date.getMonth() - 6);
    value.when = date;

    return value;
  }
}
