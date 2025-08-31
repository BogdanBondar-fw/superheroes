import { Controller, Get } from '@nestjs/common';

@Controller()
export class RailwayHealthController {
  @Get('health')
  railwayHealth() {
    return { status: 'ok' };
  }

  @Get('healthz')
  healthz() {
    return 'OK';
  }

  @Get('ready')
  ready() {
    return 'READY';
  }

  @Get()
  root() {
    return 'Hello World!';
  }
}
