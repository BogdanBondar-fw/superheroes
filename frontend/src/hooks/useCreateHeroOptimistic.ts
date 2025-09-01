import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHero, type CreateHeroDtoUI } from '../api/heroes';
import type { Superhero } from '../types/hero';
import { QUERY_KEYS } from '../utils/queryKeys';
import type { PaginationResponse } from '../types/paginationResponse';

export function useCreateHeroOptimistic(onCreated?: (hero: Superhero) => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateHeroDtoUI) => createHero(dto),
    onMutate: async (dto) => {
      const pageKey = QUERY_KEYS.heroes(1);
      await queryClient.cancelQueries({ queryKey: pageKey });
      const previous = queryClient.getQueryData(pageKey);
      const tempId = `temp-${Date.now()}`;
      const optimisticHero: Superhero = {
        id: tempId,
        nickname: dto.nickname,
        real_name: dto.real_name || '',
        origin_description: dto.origin_description || '',
        superpowers: dto.superpowers || '',
        catch_phrase: dto.catch_phrase || '',
        images: dto.images || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      queryClient.setQueryData(pageKey, (old: PaginationResponse<Superhero> | undefined) => {
        if (!old) {
          return {
            data: [optimisticHero],
            pagination: { currentPage: 1, totalPages: 1, totalItems: 1, itemsPerPage: 5 },
          } as PaginationResponse<Superhero>;
        }
        return {
          ...old,
          data: [optimisticHero, ...old.data],
          pagination: {
            ...old.pagination,
            totalItems: old.pagination.totalItems + 1,
          },
        } as PaginationResponse<Superhero>;
      });
      return { previous, tempId, pageKey };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.pageKey, context.previous);
      }
    },
    onSuccess: (createdHero, _variables, context) => {
      if (context?.pageKey) {
        queryClient.setQueryData(
          context.pageKey,
          (old: PaginationResponse<Superhero> | undefined) => {
            if (!old) return old;
            return {
              ...old,
              data: old.data.map((hero: Superhero) => (hero.id === context.tempId ? createdHero : hero)),
            } as PaginationResponse<Superhero>;
          }
        );
      }
      if (onCreated) onCreated(createdHero);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.heroes(1) });
    },
  });
}
