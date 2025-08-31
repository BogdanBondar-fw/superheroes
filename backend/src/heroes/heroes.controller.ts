import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import type { CreateHeroDto } from './dto/create-hero.dto';
import type { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Post()
  create(@Body() dto: CreateHeroDto) {
    return this.heroesService.create(dto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('q') searchQuery?: string
  ) {
    return this.heroesService.findAll(Number(page) || 1, Number(pageSize) || 5, searchQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.heroesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHeroDto) {
    return this.heroesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.heroesService.remove(id);
  }
}
