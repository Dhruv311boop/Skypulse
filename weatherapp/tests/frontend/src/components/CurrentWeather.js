import { useWeather } from '@/contexts/WeatherContext';
import { GlassCard } from './GlassCard';
import { convertTemp, tempUnit, getWeatherIcon, getFullDate } from '@/lib/weatherUtils';
import { MapPin, Heart } from 'lucide-react';

export function CurrentWeather() {
  const { currentWeather: w, unit, addFavorite, favorites, locationOverride } = useWeather();
  if (!w) return null;

  const displayName = locationOverride || w.name;
  const Icon = getWeatherIcon(w.weather[0].main, w.weather[0].icon);
  const isFav = favorites.some(f => f.city_name === displayName);

  return (
    <GlassCard className="h-full flex flex-col justify-between" data-testid="current-weather-card">
      <div>
        <LocationHeader w={w} displayName={displayName} isFav={isFav} onFavorite={() => {
          if (!isFav) addFavorite({ city_name: displayName, lat: w.coord.lat, lon: w.coord.lon, country: w.sys.country || '' });
        }} />
        <TemperatureDisplay w={w} unit={unit} Icon={Icon} />
      </div>
      <QuickStats w={w} unit={unit} />
    </GlassCard>
  );
}

function LocationHeader({ w, displayName, isFav, onFavorite }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-sky-500" strokeWidth={2.5} />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-700 dark:text-white/80">
            {displayName}, {w.sys.country}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/60">{getFullDate(w.dt)}</p>
      </div>
      <button
        onClick={onFavorite}
        className="neu-button p-2.5 bg-white/50 dark:bg-white/10"
        data-testid="favorite-button"
        aria-label="Add to favorites"
      >
        <Heart
          className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-white/40'}`}
          strokeWidth={2.5}
        />
      </button>
    </div>
  );
}

function TemperatureDisplay({ w, unit, Icon }) {
  return (
    <div className="flex items-center gap-6 my-6 md:my-8">
      <div className="animate-float">
        <Icon className="w-20 h-20 md:w-28 md:h-28 text-sky-500 dark:text-sky-400" strokeWidth={1.5} />
      </div>
      <div>
        <div className="temp-display text-6xl md:text-8xl text-slate-900 dark:text-white" data-testid="temperature-display">
          {convertTemp(w.main.temp, unit)}<span className="text-3xl md:text-4xl align-top ml-1 text-slate-400 dark:text-white/50">{tempUnit(unit)}</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-white/60 mt-1">
          H: {convertTemp(w.main.temp_max, unit)}{tempUnit(unit)} &middot; L: {convertTemp(w.main.temp_min, unit)}{tempUnit(unit)}
        </p>
        <p className="text-lg capitalize text-slate-700 dark:text-white/80 mt-1">{w.weather[0].description}</p>
      </div>
    </div>
  );
}

function QuickStats({ w, unit }) {
  const windSpeed = unit === 'imperial' ? Math.round(w.wind.speed * 2.237) : Math.round(w.wind.speed * 3.6);
  const windUnit = unit === 'imperial' ? 'mph' : 'km/h';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <MiniStat label="Feels Like" value={`${convertTemp(w.main.feels_like, unit)}${tempUnit(unit)}`} />
      <MiniStat label="Humidity" value={`${w.main.humidity}%`} />
      <MiniStat label="Wind" value={`${windSpeed} ${windUnit}`} />
      <MiniStat label="Clouds" value={`${w.clouds.all}%`} />
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="neu-inset rounded-2xl p-3 text-center bg-white/20 dark:bg-white/8" data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 dark:text-white/60">{label}</span>
      <p className="text-sm font-semibold text-slate-800 dark:text-white mt-1">{value}</p>
    </div>
  );
}
