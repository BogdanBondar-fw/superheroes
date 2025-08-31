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
    const isLikelyUrl = (u: string) => /^https?:\/\//i.test(u);
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
    const remove = (u: string) => onChange(value.filter(i => i !== u));

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
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
            placeholder="https://..."
            className="flex-1 px-3 py-2 rounded-md bg-white/10 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-white/60"
          />
          <button
            type="button"
            onClick={add}
            disabled={!canAdd()}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-40 text-white text-sm font-medium"
          >Add</button>
        </div>
        {url && !/^https?:\/\//i.test(url.trim()) && (
          <p className="text-xs text-red-400">URL должен начинаться с http(s)://</p>
        )}
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {value.map(u => (
              <div key={u} className="relative group">
                <img
                  src={u}
                  alt="hero"
                  className="w-full h-24 object-cover rounded-md border border-white/20"
                  onError={(event) => { event.currentTarget.style.opacity = '0.3'; event.currentTarget.title = 'Broken image'; }}
                />
                <button
                  type="button"
                  onClick={() => remove(u)}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  aria-label="Remove image"
                >✕</button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-white/50">Можно до {max}. Введённая но не добавленная ссылка будет автоматически добавлена при сохранении.</p>
      </div>
    );
  }
);

ImgUploader.displayName = 'ImgUploader';
