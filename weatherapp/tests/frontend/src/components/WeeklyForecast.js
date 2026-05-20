import { useWeather } from '@/contexts/WeatherContext';
import { GlassCard } from './GlassCard';
import { convertTemp, tempUnit, getWeatherIcon, getDayName, groupForecastByDay } from '@/lib/weatherUtils';

export function WeeklyForecast() {
  const { forecast, unit } = useWeather();
  if (!forecast?.list) return null;

  const days = groupForecastByDay(forecast.list);

  return (
    <GlassCard className="h-full" data-testid="weekly-forecast">
      <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-4">
        5-Day Forecast
      </h3>
      <div className="space-y-1">
        {days.map((day, i) => {
          const Icon = getWeatherIcon(day.weather[0].main, day.weather[0].icon);
          return (
            <div
              key={day.dt}
              className={`flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-200
                hover:bg-white/20 dark:hover:bg-white/5
                ${i < days.length - 1 ? 'border-b border-white/10 dark:border-white/5' : ''}`}
              data-testid={`daily-item-${i}`}
            >
              <span className="text-sm font-medium text-slate-700 dark:text-white/80 w-12">
                {getDayName(day.dt)}
              </span>
              <Icon className="w-6 h-6 text-sky-500 dark:text-sky-400 mx-2" strokeWidth={2} />
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm font-semibold text-slate-800 dark:text-white w-12 text-right">
                  {convertTemp(day.temp_max, unit)}°
                </span>
                <div className="w-16 h-1.5 rounded-full bg-white/15 dark:bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400" style={{width: `${Math.max(20, ((day.temp_max - day.temp_min) / 20) * 100)}%`}} />
                </div>
                <span className="text-xs text-slate-400 dark:text-white/40 w-12 text-right">
                  {convertTemp(day.temp_min, unit)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
