import { useMemo } from 'react';
import { getBackgroundImage, isRainy } from '@/lib/weatherUtils';

export function WeatherBackground({ weather }) {
  const condition = weather?.weather?.[0]?.main;
  const icon = weather?.weather?.[0]?.icon;
  const bgUrl = useMemo(() => getBackgroundImage(condition, icon), [condition, icon]);
  const showRain = isRainy(condition);

  return (
    <>
      <div
        className="weather-bg-overlay"
        style={{ backgroundImage: `url(${bgUrl})` }}
        data-testid="weather-background"
      />
      {showRain && <RainOverlay />}
    </>
  );
}

const RAIN_DROPS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  height: `${15 + Math.random() * 25}px`,
  duration: `${0.5 + Math.random() * 0.6}s`,
  delay: `${Math.random() * 2}s`,
}));

function RainOverlay() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" data-testid="rain-overlay">
      {RAIN_DROPS.map(d => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: d.left,
            height: d.height,
            animationDuration: d.duration,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}
