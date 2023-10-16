import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanService {
  constructor(
    @Inject('App_NAME')
    private readonly name: string,
    @Inject('MESSAGE')
    private readonly message: string,
  ) {}
  getHello(): string {
    return `こんにちは、世界 from ${this.name}, ${this.message}`;
  }
}
