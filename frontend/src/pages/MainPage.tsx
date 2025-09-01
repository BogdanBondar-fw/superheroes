import { Modal } from '../components/Modal';
import { HeroEditForm } from '../components/HeroEditForm';
import { HeroCard } from '../components/HeroCard';
import { HeroDetail } from '../components/HeroDetail.tsx';
import type { Superhero } from '../types/hero';
import { useHeroesPageController } from '../hooks/useHeroesPageController';
import ReactPaginate from 'react-paginate';

export const MainPage = () => {
  const {
    page,
    search,
    isCreateModalOpen,
    heroForEdit,
    selectedHeroId,
    heroesQuery,
    selectedHeroQuery,
    openCreateModal,
    closeCreateModal,
    openDetails,
    closeDetails,
    startEditHero,
    requestDeleteHero,
    createHeroMutation,
    setSearch,
    setPage,
  } = useHeroesPageController();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white animate-in slide-in-from-left duration-700">
            Superhero DB
          </h1>
          <div className="flex items-center gap-3 animate-in slide-in-from-right duration-700">
            <input
              aria-label="search heroes"
              placeholder="Search heroes..."
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              className="hidden sm:inline-block px-3 py-2 rounded-md bg-white/10 placeholder:text-white/60 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-md shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              Add hero
            </button>
          </div>
        </header>

        <main>
          {heroesQuery.isLoading && <div className="text-white/60">Loading heroes...</div>}
          {heroesQuery.isError &&
            (() => {
              const message = (heroesQuery.error as Error)?.message || '';
              const isOffline = message.startsWith('NETWORK_ERROR');
              return (
                <div className="text-red-400 text-sm flex flex-col gap-1">
                  <span>
                    {isOffline ? 'API offline (backend недоступен).' : 'Failed to load heroes.'}
                  </span>
                  <span className="text-white/50 text-xs break-all">{message}</span>
                  <button
                    onClick={() => heroesQuery.refetch()}
                    className="underline self-start cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              );
            })()}
          {!heroesQuery.isLoading && heroesQuery.data && heroesQuery.data.data.length === 0 ? (
            <div className="rounded-xl bg-white/6 border border-white/8 p-6 flex items-center justify-between gap-4 shadow-lg backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-lg font-semibold text-white">No heroes yet</h2>
                <p className="text-sm text-white/70">
                  Create a hero to get started — they'll appear here as cards.
                </p>
              </div>
              <div>
                <span className="inline-block bg-green-400 text-black px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                  Empty
                </span>
              </div>
            </div>
          ) : (
            <section
              className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500"
              aria-label="heroes-list"
            >
              {heroesQuery.data?.data.map((hero: Superhero, index: number) => (
                <div
                  key={hero.id}
                  className="animate-in slide-in-from-bottom-4 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <HeroCard
                    id={hero.id}
                    nickname={hero.nickname}
                    image={hero.images[0] || '/placeholder.png'}
                    onDetails={openDetails}
                  />
                </div>
              ))}
            </section>
          )}
          {heroesQuery.data && heroesQuery.data.pagination.totalPages > 1 && (
            <div className="mt-8 animate-in fade-in duration-500">
              <ReactPaginate
                forcePage={page - 1}
                pageCount={heroesQuery.data.pagination.totalPages}
                onPageChange={(sel: { selected: number }) => setPage(sel.selected + 1)}
                previousLabel="‹"
                nextLabel="›"
                breakLabel="…"
                containerClassName="flex items-center justify-center gap-2 flex-wrap"
                pageClassName="group"
                pageLinkClassName="px-3 py-1.5 rounded-md bg-white/10 text-white/80 text-sm hover:bg-white/15 hover:text-white transition cursor-pointer"
                activeLinkClassName="!bg-indigo-600 !text-white shadow cursor-pointer"
                previousLinkClassName="px-3 py-1.5 rounded-md bg-white/10 text-white/80 text-sm hover:bg-white/15 disabled:opacity-40 cursor-pointer"
                nextLinkClassName="px-3 py-1.5 rounded-md bg-white/10 text-white/80 text-sm hover:bg-white/15 disabled:opacity-40 cursor-pointer"
                breakLinkClassName="px-3 py-1.5 rounded-md bg-transparent text-white/40 text-sm cursor-pointer"
                disabledClassName="opacity-40 pointer-events-none"
              />
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <HeroEditForm
          setModalOpen={closeCreateModal}
          mode={heroForEdit ? 'edit' : 'create'}
          heroId={heroForEdit?.id}
          initialValues={
            heroForEdit
              ? {
                  nickname: heroForEdit.nickname,
                  real_name: heroForEdit.real_name,
                  origin_description: heroForEdit.origin_description,
                  superpowers: heroForEdit.superpowers,
                  catch_phrase: heroForEdit.catch_phrase,
                  images: heroForEdit.images,
                }
              : undefined
          }
        />
        {createHeroMutation.isError && (
          <p className="text-red-400 text-xs mt-2">
            Create failed: {(createHeroMutation.error as Error)?.message}
          </p>
        )}
      </Modal>

      <Modal isOpen={!!selectedHeroId} onClose={closeDetails}>
        {selectedHeroQuery.isLoading && <div className="p-6 text-white/70">Loading hero...</div>}
        {selectedHeroQuery.isError && <div className="p-6 text-red-400">Failed to load hero.</div>}
        {selectedHeroQuery.data && (
          <HeroDetail
            hero={selectedHeroQuery.data}
            onClose={closeDetails}
            onEdit={startEditHero}
            onDelete={requestDeleteHero}
          />
        )}
      </Modal>
    </div>
  );
};
