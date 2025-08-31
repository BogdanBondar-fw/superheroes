type HeroCardProps = {
  id: string;
  nickname: string;
  image: string;
  onDetails: (id: string) => void;
};

const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="none"><rect width="160" height="160" rx="16" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23aaa" font-family="sans-serif" font-size="14">No Image</text></svg>';

export const HeroCard = ({ id, nickname, image, onDetails }: HeroCardProps) => {
  const resolved = image && image.trim().length > 0 ? image : FALLBACK_IMG;
  return (
    <div className="rounded-xl bg-white/6 border border-white/8 p-4 flex gap-4 shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:shadow-xl">
      <img
        src={resolved}
        alt={`${nickname} thumbnail`}
        referrerPolicy="no-referrer"
        decoding="async"
        data-img-url={resolved}
        title={resolved === FALLBACK_IMG ? 'No image' : resolved}
        onError={(event) => {
          if (event.currentTarget.src !== FALLBACK_IMG) {
            console.warn('[HeroCard] image failed to load, swapping to fallback:', resolved);
            event.currentTarget.src = FALLBACK_IMG;
          }
        }}
        className="w-20 h-20 object-cover rounded-lg border border-white/20 bg-white/10 flex-shrink-0"
      />
      <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h2 className="text-base font-semibold text-white line-clamp-1 flex-1 min-w-0">
            {nickname}
          </h2>
        </div>
        <button
          onClick={() => onDetails(id)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-1 px-3 rounded-md text-xs tracking-wide transition-all duration-200 shadow-md whitespace-nowrap cursor-pointer transform hover:scale-105 active:scale-95"
        >
          Details
        </button>
      </div>
    </div>
  );
};
