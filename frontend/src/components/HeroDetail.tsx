import React from 'react';
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225" fill="none"><rect width="400" height="225" rx="16" fill="%23222"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23aaa" font-family="sans-serif" font-size="20">No Image</text></svg>';
import type { Superhero } from '../types/hero';

type HeroDetailProps = {
  hero: Superhero;
  onClose: () => void;
  onEdit?: (hero: Superhero) => void;
  onDelete?: (hero: Superhero) => void;
};

export const HeroDetail: React.FC<HeroDetailProps> = ({ hero, onClose, onEdit, onDelete }) => {
  return (
    <div className="w-[min(92vw,900px)] max-h-[85vh] overflow-y-auto rounded-2xl bg-white/6 border border-white/10 p-6 shadow-2xl backdrop-blur-md relative">
      <button
        aria-label="Close details"
        onClick={onClose}
        className="absolute top-3 right-3 text-white/70 hover:text-white transition-all duration-200 cursor-pointer transform hover:scale-110 active:scale-95"
      >
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

      <header className="mb-4 flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">{hero.nickname}</h2>
        <p className="text-white/70 text-sm">
          Real name: <span className="text-white/90">{hero.real_name || 'Unknown'}</span>
        </p>
      </header>

      {hero.images?.length > 0 && (
        <section className="mb-6">
          <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-white/10 flex items-center justify-center mb-3">
            <img
              src={hero.images[0] || FALLBACK_IMG}
              alt={hero.nickname}
              onError={(event) => {
                if (event.currentTarget.src !== FALLBACK_IMG)
                  event.currentTarget.src = FALLBACK_IMG;
              }}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {hero.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {hero.images.slice(1).map((imageUrl, index) => (
                <img
                  key={imageUrl + index}
                  src={imageUrl || FALLBACK_IMG}
                  alt={`${hero.nickname} thumbnail ${index + 2}`}
                  onError={(event) => {
                    if (event.currentTarget.src !== FALLBACK_IMG)
                      event.currentTarget.src = FALLBACK_IMG;
                  }}
                  className="h-20 w-full object-cover rounded-md border border-white/10 bg-white/10"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="space-y-4 text-sm leading-relaxed">
        {hero.origin_description && (
          <div>
            <h3 className="font-semibold text-white/90 mb-1 text-sm uppercase tracking-wide">
              Origin
            </h3>
            <p className="text-white/70 whitespace-pre-line">{hero.origin_description}</p>
          </div>
        )}
        {hero.superpowers && (
          <div>
            <h3 className="font-semibold text-white/90 mb-1 text-sm uppercase tracking-wide">
              Superpowers
            </h3>
            <p className="text-white/70 whitespace-pre-line">{hero.superpowers}</p>
          </div>
        )}
        {hero.catch_phrase && (
          <div>
            <h3 className="font-semibold text-white/90 mb-1 text-sm uppercase tracking-wide">
              Catch phrase
            </h3>
            <blockquote className="text-white italic border-l-4 border-blue-500 pl-3">
              {hero.catch_phrase}
            </blockquote>
          </div>
        )}
        <div className="flex gap-3 pt-2 flex-wrap">
          {onEdit && (
            <button
              onClick={() => onEdit(hero)}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(hero)}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white text-sm font-semibold shadow-md transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-white/90 text-sm font-medium border border-white/15 transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95"
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
};

export default HeroDetail;
