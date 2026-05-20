import { useWeather } from '@/contexts/WeatherContext';
import { X } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function FavoriteCities() {
  const { favorites, selectCity, removeFavorite } = useWeather();

  if (!favorites.length) return null;

  return (
    <div className="mb-4 opacity-0 animate-fade-up" data-testid="favorite-cities">
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {favorites.map((fav) => (
            <button
              key={fav.id}
              onClick={() => selectCity(fav.lat, fav.lon, fav.city_name)}
              className="glass-card flex items-center gap-2 !rounded-full !p-0 px-4 py-2 text-sm font-medium text-slate-700 dark:text-white/80 hover:bg-white/30 dark:hover:bg-white/15 transition-all flex-shrink-0 group"
              data-testid={`favorite-${fav.city_name}`}
            >
              <span>{fav.city_name}</span>
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); removeFavorite(fav.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`remove-favorite-${fav.city_name}`}
              >
                <X className="w-3.5 h-3.5 text-slate-400 dark:text-white/40" strokeWidth={3} />
              </span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
