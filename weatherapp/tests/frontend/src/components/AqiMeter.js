import { useWeather } from '@/contexts/WeatherContext';
import { GlassCard } from './GlassCard';
import { getAqiInfo } from '@/lib/weatherUtils';

export function AqiMeter() {
  const { airQuality } = useWeather();
  if (!airQuality?.list?.[0]) return null;

  const aqi = airQuality.list[0].main.aqi;
  const info = getAqiInfo(aqi);
  const pct = ((aqi - 1) / 4) * 100;
  const pm25 = airQuality.list[0].components?.pm2_5;

  return (
    <GlassCard className="h-full" data-testid="aqi-meter">
      <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-3">
        Air Quality
      </h3>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-heading font-semibold text-slate-900 dark:text-white">{aqi}</span>
        <span className="text-sm font-medium" style={{ color: info.color }}>{info.label}</span>
      </div>
      {/* Gradient bar */}
      <div className="relative h-2.5 rounded-full overflow-hidden bg-white/20 dark:bg-white/10">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444, #7c3aed)',
          }}
        />
        {/* Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-md transition-all duration-500"
          style={{ left: `${pct}%`, borderColor: info.color, transform: `translateX(-50%) translateY(-50%)` }}
          data-testid="aqi-marker"
        />
      </div>
      {pm25 !== undefined && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3">
          <PollutantRow label="PM2.5" value={pm25} />
          <PollutantRow label="PM10" value={airQuality.list[0].components?.pm10} />
          <PollutantRow label="O3" value={airQuality.list[0].components?.o3} />
          <PollutantRow label="NO2" value={airQuality.list[0].components?.no2} />
        </div>
      )}
    </GlassCard>
  );
}

function PollutantRow({ label, value }) {
  if (value === undefined) return null;
  return (
    <div className="flex justify-between text-[10px]">
      <span className="text-slate-500 dark:text-white/40">{label}</span>
      <span className="text-slate-700 dark:text-white/70 font-medium">{value?.toFixed(1)}</span>
    </div>
  );
}
