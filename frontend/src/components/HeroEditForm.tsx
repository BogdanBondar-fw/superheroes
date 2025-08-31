import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { errorMessages } from '../types/errorMessages';
import type { SubmitHandler } from 'react-hook-form';
import type { CreateSuperheroRequest } from '../types/createHero';
import { useUpdateHero } from '../hooks/useHeroQueries';
import { useCreateHeroOptimistic } from '../hooks/useCreateHeroOptimistic';
import { ImgUploader, type ImgUploaderHandle } from './ImgUploader';
import { useRef } from 'react';

type Props = {
  setModalOpen: (open: boolean) => void;
  mode?: 'create' | 'edit';
  heroId?: string;
  initialValues?: CreateSuperheroRequest;
};

const schema = z.object({
  nickname: z.string().min(2, errorMessages.Nickname),
  real_name: z.string().min(2, errorMessages.RealName),
  origin_description: z.string().min(5, errorMessages.OriginDescription),
  superpowers: z.string().min(2, errorMessages.Superpowers),
  catch_phrase: z.string().min(2, errorMessages.CatchPhrase),
});

export const HeroEditForm: React.FC<Props> = ({ setModalOpen, mode = 'create', heroId, initialValues }) => {
  const createMutation = useCreateHeroOptimistic();
  const updateMutation = useUpdateHero(heroId || '');
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<CreateSuperheroRequest>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      nickname: '',
      real_name: '',
      origin_description: '',
      superpowers: '',
      catch_phrase: '',
      images: [],
    },
  });
  const images = (watch('images') as string[] | undefined) || [];
  const setImages = (imageUrls: string[]) => setValue('images', imageUrls as unknown as CreateSuperheroRequest['images'], { shouldDirty: true });
  const uploaderRef = useRef<ImgUploaderHandle | null>(null);

  const onSubmit: SubmitHandler<CreateSuperheroRequest> = async (data) => {
    if (uploaderRef.current) {
      const next = uploaderRef.current.flush();
      if (next !== data.images) {
        data.images = next as unknown as CreateSuperheroRequest['images'];
      }
    }
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync({
          nickname: data.nickname,
          real_name: data.real_name,
          origin_description: data.origin_description,
          superpowers: data.superpowers,
          catch_phrase: data.catch_phrase,
          images: data.images,
        });
      } else if (heroId) {
        await updateMutation.mutateAsync({
          nickname: data.nickname,
          real_name: data.real_name,
          origin_description: data.origin_description,
          superpowers: data.superpowers,
          catch_phrase: data.catch_phrase,
          images: data.images,
        });
      }
      setModalOpen(false);
      reset();
    } catch (err) {
      console.error('Hero save failed', err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-full max-w-xl mx-auto p-6 rounded-xl bg-white/6 border border-white/8 shadow-lg backdrop-blur-sm"
    >
      <div className="flex justify-between pb-2">
  <h2 className="text-xl font-semibold text-white">{mode === 'create' ? 'Add your Hero' : 'Edit hero'}</h2>
        <button type="button" onClick={() => setModalOpen(false)} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-lg font-semibold text-white">Nickname</label>
        <input
          placeholder="Superman"
          {...register('nickname', { required: errorMessages.Nickname })}
          className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/60"
        />
        <div className="min-h-[25px]">
          {errors.nickname && (
            <span className="text-red-400 text-xs">{errors.nickname.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-lg font-semibold text-white">Real name</label>
        <input
          placeholder="Clark Joseph Kent"
          {...register('real_name', { required: errorMessages.RealName })}
          className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/60"
        />
        <div className="min-h-[25px]">
          {errors.real_name && (
            <span className="text-red-400 text-xs">{errors.real_name.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-lg font-semibold text-white">Origin description</label>
        <input
          placeholder="The man who can do anything"
          {...register('origin_description', { required: errorMessages.OriginDescription })}
          className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/60"
        />
        <div className="min-h-[25px]">
          {errors.origin_description && (
            <span className="text-red-400 text-xs">{errors.origin_description.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-lg font-semibold text-white">Superpowers</label>
        <input
          placeholder="Flight, super strength, x-ray vision"
          {...register('superpowers', { required: errorMessages.Superpowers })}
          className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/60"
        />
        <div className="min-h-[25px]">
          {errors.superpowers && (
            <span className="text-red-400 text-xs">{errors.superpowers.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-lg font-semibold text-white">Catch phrase</label>
        <input
          placeholder="Up, up and away!"
          {...register('catch_phrase', { required: errorMessages.CatchPhrase })}
          className="px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/60"
        />
        <div className="min-h-[25px]">
          {errors.catch_phrase && (
            <span className="text-red-400 text-xs">{errors.catch_phrase.message}</span>
          )}
        </div>
      </div>

  <ImgUploader ref={uploaderRef} value={images} onChange={setImages} />
      <button
        type="submit"
        disabled={createMutation.isPending || updateMutation.isPending || (mode === 'edit' && !heroId)}
        className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-md tracking-widest text-lg transition shadow-md"
      >
        {mode === 'create'
          ? (createMutation.isPending ? 'Creating...' : 'Create hero')
          : (updateMutation.isPending ? 'Saving...' : (!heroId ? 'No hero id' : 'Save changes'))}
      </button>
      {createMutation.isError && (
        <p className="text-red-400 text-xs mt-2">Create failed: {(createMutation.error as Error)?.message}</p>
      )}
      {updateMutation.isError && (
        <p className="text-red-400 text-xs mt-2">Update failed: {(updateMutation.error as Error)?.message}</p>
      )}
    </form>
  );
};
