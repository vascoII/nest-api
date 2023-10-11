import { IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class EventIdDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  id: number;
}
