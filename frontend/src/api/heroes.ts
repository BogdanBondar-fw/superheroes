import { fetchJSON } from './client';
import type { Superhero } from '../types/hero';
import type { PaginationResponse } from '../types/paginationResponse';
import { mapRawHeroToUI, buildBackendPayloadFromUI, type RawHero } from '../domain/superheroMapper';

type RawListResponse = {
  data: RawHero[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function mapHero(rawHero: RawHero): Superhero {
  return mapRawHeroToUI(rawHero);
}

export async function listHeroes(
  page = 1,
  searchQuery?: string
): Promise<PaginationResponse<Superhero>> {
  const params = new URLSearchParams({ page: String(page) });
  if (searchQuery && searchQuery.trim()) params.set('q', searchQuery.trim());
  const rawListResponse = await fetchJSON<RawListResponse>(`/heroes?${params.toString()}`);
  return {
    data: rawListResponse.data.map(mapHero),
    pagination: {
      currentPage: rawListResponse.page,
      totalPages: rawListResponse.totalPages,
      totalItems: rawListResponse.total,
      itemsPerPage: rawListResponse.pageSize,
    },
  };
}

export async function getHero(id: string): Promise<Superhero> {
  const rawHero = await fetchJSON<RawHero>(`/heroes/${id}`);
  return mapHero(rawHero);
}

export type CreateHeroDtoUI = {
  nickname: string;
  real_name?: string;
  origin_description?: string;
  superpowers?: string;
  catch_phrase?: string;
  images?: string[];
};

function toBackendPayload(dto: CreateHeroDtoUI) {
  return buildBackendPayloadFromUI(dto);
}

export async function createHero(dto: CreateHeroDtoUI): Promise<Superhero> {
  const createdRawHero = await fetchJSON<RawHero>(`/heroes`, {
    method: 'POST',
    body: JSON.stringify(toBackendPayload(dto)),
  });
  return mapHero(createdRawHero);
}

export type UpdateHeroDtoUI = Partial<CreateHeroDtoUI>;

export async function updateHero(id: string, dto: UpdateHeroDtoUI): Promise<Superhero> {
  const updatedRawHero = await fetchJSON<RawHero>(`/heroes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(toBackendPayload(dto as CreateHeroDtoUI)),
  });
  return mapHero(updatedRawHero);
}

export async function deleteHero(id: string): Promise<void> {
  await fetchJSON(`/heroes/${id}`, { method: 'DELETE' });
}
