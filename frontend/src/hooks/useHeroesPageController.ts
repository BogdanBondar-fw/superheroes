import { useState, useCallback } from 'react';
import { useHeroes, useHero, useDeleteHero } from './useHeroQueries';
import { useCreateHeroOptimistic } from './useCreateHeroOptimistic';
import type { Superhero } from '../types/hero';

export function useHeroesPageController() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [heroForEdit, setHeroForEdit] = useState<Superhero | null>(null);
  const [search, setSearch] = useState('');

  const heroesQuery = useHeroes(page, search || undefined);
  const selectedHeroQuery = useHero(selectedHeroId);
  const deleteHeroMutation = useDeleteHero();
  const createHeroMutation = useCreateHeroOptimistic(() => {
    setPage(1);
  });

  const openCreateModal = useCallback(() => {
    setHeroForEdit(null);
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const openDetails = useCallback((id: string) => setSelectedHeroId(id), []);
  const closeDetails = useCallback(() => setSelectedHeroId(null), []);

  const startEditHero = useCallback((hero: Superhero) => {
    setHeroForEdit(hero);
    setSelectedHeroId(null);
    setIsCreateModalOpen(true);
  }, []);

  const requestDeleteHero = useCallback(
    (hero: Superhero) => {
      if (confirm(`Delete hero "${hero.nickname}"?`)) {
        deleteHeroMutation.mutate(hero.id, { onSuccess: () => setSelectedHeroId(null) });
      }
    },
    [deleteHeroMutation]
  );

  const goToPreviousPage = useCallback(() => setPage((current) => Math.max(1, current - 1)), []);
  const goToNextPage = useCallback(() => setPage((current) => current + 1), []);

  return {
    page,
    search,
    isCreateModalOpen,
    selectedHeroId,
    heroForEdit,
    heroesQuery,
    selectedHeroQuery,
    deleteHeroMutation,
    createHeroMutation,
    openCreateModal,
    closeCreateModal,
    openDetails,
    closeDetails,
    startEditHero,
    requestDeleteHero,
    goToPreviousPage,
    goToNextPage,
    setPage,
    setSearch,
  };
}
