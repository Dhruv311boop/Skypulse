import { useWeather } from '@/contexts/WeatherContext';
import { GlassCard } from './GlassCard';
import { formatTime } from '@/lib/weatherUtils';
import { Sunrise, Sunset } from 'lucide-react';

/** Separate calculation logic from rendering */
function useSunPosition(w) {
  if (!w) return { rise: 0, set: 0, progress: 0 };
  
  const now = w.dt;
  const rise = w.sys.sunrise;
  const set = w.sys.sunset;
  const dayLength = set - rise;
  const elapsed = Math.max(0, Math.min(now - rise, dayLength));
  const progress = dayLength > 0 ? elapsed / dayLength : 0;
  return { rise, set, progress };
}

const ARC_CX = 120;
const ARC_CY = 90;
const ARC_R = 70;
const ARC_PATH = `M ${ARC_CX - ARC_R} ${ARC_CY} A ${ARC_R} ${ARC_R} 0 0 1 ${ARC_CX + ARC_R} ${ARC_CY}`;

function SunArc({ progress }) {
  const currentAngle = Math.PI - progress * Math.PI;
  const sunX = ARC_CX + ARC_R * Math.cos(currentAngle);
  const sunY = ARC_CY - ARC_R * Math.sin(currentAngle);

  return (
    <svg viewBox="0 0 240 110" className="w-full">
      <path d={ARC_PATH} fill="none" stroke="currentColor" className="text-slate-300/30 dark:text-white/10" strokeWidth="2" strokeDasharray="4 4" />
      <path d={ARC_PATH} fill="none" stroke="url(#sunGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${progress * Math.PI * ARC_R} ${Math.PI * ARC_R}`} />
      {progress > 0 && progress < 1 && (
        <>
          <circle cx={sunX} cy={sunY} r="12" fill="rgba(251,191,36,0.2)" />
          <circle cx={sunX} cy={sunY} r="6" fill="#fbbf24" />
        </>
      )}
      <line x1={ARC_CX - ARC_R - 10} y1={ARC_CY} x2={ARC_CX + ARC_R + 10} y2={ARC_CY} stroke="currentColor" className="text-slate-300/20 dark:text-white/10" strokeWidth="1" />
      <defs>
        <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TimeLabels({ rise, set, timezone }) {
  return (
    <div className="flex justify-between mt-1">
      <div className="flex items-center gap-1.5">
        <Sunrise className="w-4 h-4 text-amber-500" strokeWidth={2.5} />
        <span className="text-xs font-medium text-slate-700 dark:text-white/70">{formatTime(rise, timezone)}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Sunset className="w-4 h-4 text-orange-500" strokeWidth={2.5} />
        <span className="text-xs font-medium text-slate-700 dark:text-white/70">{formatTime(set, timezone)}</span>
      </div>
    </div>
  );
}

export function SunriseSunset() {
  const { currentWeather: w } = useWeather();
  // Call hook at the top level, before any conditional
  const { rise, set, progress } = useSunPosition(w);

  if (!w) return null;

  return (
    <GlassCard className="h-full" data-testid="sunrise-sunset">
      <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 mb-2">
        Sunrise & Sunset
      </h3>
      <SunArc progress={progress} />
      <TimeLabels rise={rise} set={set} timezone={w.timezone} />
    </GlassCard>
  );
}
