import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { HeroesService } from './heroes.service';
import type { CreateHeroDto } from './dto/create-hero.dto';
import type { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('api/heroes')
export class HeroesController {
  constructor(private readonly heroesService: HeroesService) {}

  @Get('test')
  async test() {
    try {
      console.log('[HeroesController] Test endpoint called');
      const result = await this.heroesService.testConnection();
      console.log('[HeroesController] Test result:', result);
      return { status: 'ok', ...result };
    } catch (error: unknown) {
      console.error('[HeroesController] Test failed:', error);
      const message = error instanceof Error ? error.message : String(error);
      return { status: 'error', message };
    }
  }

  @Post()
  async create(@Body() dto: any) {
    try {
      console.log('[HeroesController] POST /api/heroes called');
      console.log('[HeroesController] Raw DTO:', dto);
      console.log('[HeroesController] DTO type:', typeof dto);
      
      // Simple validation manually
      if (!dto || !dto.nickname) {
        throw new Error('Nickname is required');
      }
      
      const result = await this.heroesService.create(dto);
      console.log('[HeroesController] Hero created successfully:', result.id);
      return result;
    } catch (error: unknown) {
      console.error('[HeroesController] Error creating hero:', error);
      throw error;
    }
  }  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('q') searchQuery?: string
  ) {
    try {
      console.log('[HeroesController] GET /api/heroes called');
      const result = await this.heroesService.findAll(
        Number(page) || 1,
        Number(pageSize) || 5,
        searchQuery
      );
      console.log('[HeroesController] Found', result.data.length, 'heroes');
      return result;
    } catch (error) {
      console.error('[HeroesController] Error fetching heroes:', error);
      throw error;
    }
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
