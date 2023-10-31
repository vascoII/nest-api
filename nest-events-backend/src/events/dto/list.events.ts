// dto/list.events.ts

export enum WhenEventFilter {
  All = 1,
  Today,
  Tommorow,
  ThisWeek,
  NextWeek,
}

export class ListEvents {
  when?: WhenEventFilter = WhenEventFilter.All;
  page?: number;
}
