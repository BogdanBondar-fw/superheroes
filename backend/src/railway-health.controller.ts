import { Controller, Get } from '@nestjs/common';

@Controller()
export class RailwayHealthController {
  @Get('health')
  railwayHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('healthz')
  healthz() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  ready() {
    return { status: 'ready', timestamp: new Date().toISOString() };
  }
}
