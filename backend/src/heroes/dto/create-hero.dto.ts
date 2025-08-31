import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateHeroDto {
  @IsString()
  @IsNotEmpty()
  nickname!: string;

  @IsOptional()
  @IsString()
  realName?: string | null;

  @IsOptional()
  @IsString()
  originDescription?: string | null;

  @IsOptional()
  @IsString()
  superpowers?: string | null;

  @IsOptional()
  @IsString()
  catchPhrase?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
