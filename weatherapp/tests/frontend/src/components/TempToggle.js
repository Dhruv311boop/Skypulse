import { useWeather } from '@/contexts/WeatherContext';

export function TempToggle() {
  const { unit, toggleUnit } = useWeather();
  const isMetric = unit === 'metric';

  return (
    <div
      className="segment-control neu-button bg-white/40 dark:bg-black/30 relative"
      data-testid="temp-toggle"
    >
      {/* Sliding pill */}
      <div
        className="segment-pill bg-sky-500 dark:bg-sky-400 w-1/2"
        style={{ transform: isMetric ? 'translateX(0)' : 'translateX(100%)' }}
      />
      <button
        onClick={() => unit !== 'metric' && toggleUnit()}
        className={`relative z-10 px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors duration-300
          ${isMetric ? 'text-white' : 'text-slate-500 dark:text-white/50'}`}
        data-testid="temp-celsius"
      >
        C
      </button>
      <button
        onClick={() => unit !== 'imperial' && toggleUnit()}
        className={`relative z-10 px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors duration-300
          ${!isMetric ? 'text-white' : 'text-slate-500 dark:text-white/50'}`}
        data-testid="temp-fahrenheit"
      >
        F
      </button>
    </div>
  );
}
