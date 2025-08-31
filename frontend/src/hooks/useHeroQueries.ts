import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listHeroes,
  getHero,
  createHero,
  updateHero,
  deleteHero,
  type CreateHeroDtoUI,
  type UpdateHeroDtoUI,
} from '../api/heroes';
import { QUERY_KEYS } from '../utils/queryKeys';

export function useHeroes(page: number, searchQuery: string | undefined) {
  return useQuery({
    queryKey: QUERY_KEYS.heroes(page, searchQuery),
    queryFn: () => listHeroes(page, searchQuery),
    staleTime: 30_000,
  });
}

export function useHero(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.hero(id),
    queryFn: () => (id ? getHero(id) : Promise.reject('no id')),
    enabled: !!id,
  });
}

export function useCreateHero() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateHeroDtoUI) => createHero(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.heroesRoot });
    },
  });
}

export function useUpdateHero(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateHeroDtoUI) => updateHero(id, dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.heroesRoot });
    },
  });
}

export function useDeleteHero() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteHero(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.heroesRoot });
    },
  });
}
