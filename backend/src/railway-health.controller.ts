import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class RailwayHealthController {
  @Get('health')
  railwayHealth(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'superheroes-backend',
    });
  }

  @Get('healthz')
  healthz(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  }

  @Get('ready')
  ready(@Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  }

  @Get()
  root(@Res() res: Response) {
    return res.status(HttpStatus.OK).send('Hello World!');
  }
}
