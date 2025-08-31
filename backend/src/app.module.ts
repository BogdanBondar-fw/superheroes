import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroesModule } from './heroes/heroes.module';
import { HealthController } from './health.controller';
import { RailwayHealthController } from './railway-health.controller';

@Module({
  imports: [HeroesModule],
  controllers: [AppController, HealthController, RailwayHealthController],
  providers: [AppService],
})
export class AppModule {}
