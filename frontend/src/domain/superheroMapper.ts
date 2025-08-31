import type { Superhero } from '../types/hero';
export type RawImage = { id: string; url: string };
export type RawHero = {
  id: string;
  nickname: string;
  realName?: string | null;
  originDescription?: string | null;
  superpowers?: string | null;
  catchPhrase?: string | null;
  images: RawImage[];
  createdAt: string;
  updatedAt: string;
};

export function mapRawHeroToUI(rawHero: RawHero): Superhero {
  return {
    id: rawHero.id,
    nickname: rawHero.nickname,
    real_name: rawHero.realName || '',
    origin_description: rawHero.originDescription || '',
    superpowers: rawHero.superpowers || '',
    catch_phrase: rawHero.catchPhrase || '',
    images: rawHero.images?.map(imageObject => imageObject.url) || [],
    created_at: rawHero.createdAt,
    updated_at: rawHero.updatedAt,
  };
}

export function buildBackendPayloadFromUI(dto: {
  nickname: string;
  real_name?: string;
  origin_description?: string;
  superpowers?: string;
  catch_phrase?: string;
  images?: string[];
}) {
  return {
    nickname: dto.nickname,
    realName: dto.real_name,
    originDescription: dto.origin_description,
    superpowers: dto.superpowers,
    catchPhrase: dto.catch_phrase,
    images: dto.images,
  };
}
