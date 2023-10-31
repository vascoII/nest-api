// dto/list.events.ts

import { Transform } from 'class-transformer';

export class ListEvents {
  @Transform((value) => Number(value))
  when?: WhenEventFilter = WhenEventFilter.All;
}

export enum WhenEventFilter {
  All = 1,
  Today,
  Tommorow,
  ThisWeek,
  NextWeek,
}
