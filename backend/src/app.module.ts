import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HeroesModule } from './heroes/heroes.module';
import { HealthController } from './health.controller';

@Module({
  imports: [HeroesModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
