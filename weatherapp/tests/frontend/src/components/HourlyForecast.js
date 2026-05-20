import { useWeather } from '@/contexts/WeatherContext';
import { GlassCard } from './GlassCard';
import { convertTemp, tempUnit, getWeatherIcon, getHourLabel } from '@/lib/weatherUtils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function HourlyForecast() {
  const { forecast, currentWeather, unit } = useWeather();
  if (!forecast?.list) return null;

  const hours = forecast.list.slice(0, 8);
  const tz = currentWeather?.timezone || 0;

  return (
    <GlassCard className="p-4" data-testid="hourly-forecast">
      <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-4">
        Hourly Forecast
      </h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {hours.map((h, i) => {
            const Icon = getWeatherIcon(h.weather[0].main, h.weather[0].icon);
            return (
              <div
                key={h.dt}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[80px] transition-all duration-200
                  ${i === 0 ? 'bg-sky-500/20 dark:bg-sky-400/15' : 'hover:bg-white/20 dark:hover:bg-white/5'}`}
                data-testid={`hourly-item-${i}`}
              >
                <span className="text-xs font-medium text-slate-500 dark:text-white/60">
                  {i === 0 ? 'Now' : getHourLabel(h.dt, tz)}
                </span>
                <Icon className="w-7 h-7 text-sky-500 dark:text-sky-400" strokeWidth={2} />
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  {convertTemp(h.main.temp, unit)}°
                </span>
                <span className="text-[10px] text-slate-400 dark:text-white/40">
                  {Math.round(h.pop * 100)}%
                </span>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </GlassCard>
  );
}
