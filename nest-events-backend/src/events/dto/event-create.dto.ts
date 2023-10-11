// dto/event-create.dto.ts

import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class EventCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  when: Date;

  @IsNotEmpty()
  @IsString()
  address: string;
}
