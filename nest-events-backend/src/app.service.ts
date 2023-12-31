import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('App_NAME')
    private readonly name: string,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
}
