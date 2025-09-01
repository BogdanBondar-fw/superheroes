export const QUERY_KEYS = {
  heroesRoot: ['heroes'] as const,
  heroes: (page: number, searchQuery?: string) => ['heroes', page, searchQuery ?? ''] as const,
  hero: (id: string | null) => ['hero', id] as const,
};
