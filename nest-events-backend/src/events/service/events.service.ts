import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { Event } from '../entity/event.entity';
import { AttendeeAnswerEnum } from '../entity/attendee.entity';
import { ListEvents, WhenEventFilter } from '../dto/list.events';
import {
  PaginateOptions,
  defaultPaginateOptions,
  paginate,
} from '../../pagination/paginator';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  /**
   * getEventsWithAttendeeCountQuery
   */
  private getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  /**
   * getEvent
   * id: number : Event
   */
  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    );

    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  private async getEventsWithAttendeeCountFiltered(
    filter?: ListEvents,
  ): Promise<SelectQueryBuilder<Event> | undefined> {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return await query;
    }

    if (filter.when) {
      if (filter.when === WhenEventFilter.Today) {
        query = query.andWhere(
          'e.when <= CURDATE() and e.when >= CURDATE() + INTERVAL 1 DAY',
        );
      } else if (filter.when === WhenEventFilter.Tommorow) {
        query = query.andWhere(
          'e.when <= CURDATE() + INTERVAL 1 DAY and e.when >= CURDATE() + INTERVAL 2 DAY',
        );
      } else if (filter.when === WhenEventFilter.ThisWeek) {
        query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
      } else if (filter.when === WhenEventFilter.NextWeek) {
        query = query.andWhere(
          'YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1',
        );
      }
    }

    this.logger.debug(query.getSql());

    return await query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter?: ListEvents,
    paginateOptions?: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      { ...defaultPaginateOptions, ...paginateOptions }, // This merges the defaults with any provided values,
    );
  }

  /**
   * deleteEvent
   * id: number
   */
  public async deleteEvent(id: number): Promise<DeleteResult> {
    return await this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('e.id = :id', { id })
      .execute();
  }
}
