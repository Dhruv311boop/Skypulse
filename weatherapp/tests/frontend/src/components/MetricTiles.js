import { useWeather } from '@/contexts/WeatherContext';
import { GlassCard } from './GlassCard';
import { convertTemp, tempUnit, getWindDirection } from '@/lib/weatherUtils';
import { Droplets, Wind, Gauge, Eye, CloudRain, Thermometer } from 'lucide-react';

function getWindSpeed(speed, unit) {
  return unit === 'imperial' ? Math.round(speed * 2.237) : Math.round(speed * 3.6);
}

function getWindUnit(unit) {
  return unit === 'imperial' ? 'mph' : 'km/h';
}

function buildTiles(w, unit) {
  const windSpeed = getWindSpeed(w.wind.speed, unit);
  const wUnit = getWindUnit(unit);
  const gustSpeed = w.wind.gust ? getWindSpeed(w.wind.gust, unit) : null;

  return [
    {
      label: 'Wind Speed',
      value: `${windSpeed}`,
      sub: `${wUnit} ${getWindDirection(w.wind.deg)}`,
      extra: gustSpeed ? `Gust: ${gustSpeed} ${wUnit}` : null,
      icon: Wind,
      color: 'text-teal-400',
    },
    {
      label: 'Humidity',
      value: `${w.main.humidity}%`,
      icon: Droplets,
      color: 'text-blue-400',
    },
    {
      label: 'Pressure',
      value: `${w.main.pressure}`,
      sub: 'hPa',
      icon: Gauge,
      color: 'text-violet-400',
    },
    {
      label: 'Visibility',
      value: `${(w.visibility / 1000).toFixed(1)}`,
      sub: 'km',
      icon: Eye,
      color: 'text-emerald-400',
    },
    {
      label: 'Feels Like',
      value: `${convertTemp(w.main.feels_like, unit)}`,
      sub: tempUnit(unit),
      icon: Thermometer,
      color: 'text-rose-400',
    },
    {
      label: 'Precip. Chance',
      value: `${w.clouds?.all || 0}%`,
      sub: 'cloud cover',
      icon: CloudRain,
      color: 'text-cyan-400',
    },
  ];
}

export function MetricTiles() {
  const { currentWeather: w, unit } = useWeather();
  if (!w) return null;

  const tiles = buildTiles(w, unit);

  return (
    <>
      {tiles.map((t, i) => (
        <MetricTile key={t.label} tile={t} index={i} />
      ))}
    </>
  );
}

function MetricTile({ tile, index }) {
  const IconComponent = tile.icon;
  return (
    <div className={`opacity-0 animate-fade-up stagger-${index + 5}`}>
      <GlassCard className="h-full" data-testid={`metric-${tile.label.toLowerCase()}`}>
        <div className="flex items-start justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/50">
            {tile.label}
          </span>
          <IconComponent className={`w-5 h-5 ${tile.color}`} strokeWidth={2.5} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-heading font-semibold text-slate-900 dark:text-white">
            {tile.value}
          </span>
          {tile.sub && (
            <span className="text-sm text-slate-400 dark:text-white/40">{tile.sub}</span>
          )}
        </div>
        {tile.extra && (
          <p className="text-[10px] text-slate-400 dark:text-white/35 mt-1">{tile.extra}</p>
        )}
      </GlassCard>
    </div>
  );
}
