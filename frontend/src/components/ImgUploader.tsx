import { useState, forwardRef, useImperativeHandle, useCallback } from 'react';

export type ImgUploaderHandle = { flush: () => string[] };

type ImgUploaderProps = {
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
};

export const ImgUploader = forwardRef<ImgUploaderHandle, ImgUploaderProps>(
  ({ value, onChange, max = 6 }, ref) => {
    const [url, setUrl] = useState('');
    const isLikelyUrl = (urlString: string) => /^https?:\/\//i.test(urlString);
    const canAdd = useCallback(() => {
      const trimmed = url.trim();
      return !!trimmed && !value.includes(trimmed) && value.length < max && isLikelyUrl(trimmed);
    }, [url, value, max]);
    const add = () => {
      if (!canAdd()) return;
      const trimmed = url.trim();
      onChange([...value, trimmed]);
      setUrl('');
    };
    const remove = (urlToRemove: string) => onChange(value.filter((item) => item !== urlToRemove));

    useImperativeHandle(
      ref,
      () => ({
        flush: () => {
          if (canAdd()) {
            const trimmed = url.trim();
            const next = [...value, trimmed];
            onChange(next);
            setUrl('');
            return next;
          }
          return value;
        },
      }),
      [url, value, onChange, canAdd]
    );

    return (
      <div className="flex flex-col gap-3">
        <label className="text-lg font-semibold text-white">Images (URLs)</label>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                add();
              }
            }}
            placeholder="https://..."
            className="flex-1 px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/60"
          />
          <button
            type="button"
            onClick={add}
            disabled={!canAdd()}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-40 text-white text-sm font-medium cursor-pointer transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Add
          </button>
        </div>
        {url && !/^https?:\/\//i.test(url.trim()) && (
          <p className="text-xs text-red-400">The URL must begin with http(s)://</p>
        )}
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-3 animate-in fade-in duration-300">
            {value.map((imageUrl, index) => (
              <div
                key={imageUrl}
                className="relative group animate-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img
                  src={imageUrl}
                  alt="hero"
                  className="w-full h-24 object-cover rounded-md border border-white/20"
                  onError={(event) => {
                    event.currentTarget.style.opacity = '0.3';
                    event.currentTarget.title = 'Broken image';
                  }}
                />
                <button
                  type="button"
                  onClick={() => remove(imageUrl)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer transform hover:scale-110 active:scale-95"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-white/50">
          Up to {max}. A link that has been entered but not added will be automatically added when
          saving.
        </p>
      </div>
    );
  }
);

ImgUploader.displayName = 'ImgUploader';
