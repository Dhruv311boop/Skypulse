import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle,
  CloudFog, Wind, Snowflake, CloudSun, Moon, CloudMoon
} from 'lucide-react';

const ICON_MAP = {
  'Clear': Sun,
  'Clouds': Cloud,
  'Rain': CloudRain,
  'Drizzle': CloudDrizzle,
  'Thunderstorm': CloudLightning,
  'Snow': CloudSnow,
  'Mist': CloudFog,
  'Smoke': CloudFog,
  'Haze': CloudFog,
  'Dust': Wind,
  'Fog': CloudFog,
  'Sand': Wind,
  'Ash': CloudFog,
  'Squall': Wind,
  'Tornado': Wind,
};

export const getWeatherIcon = (main, iconCode) => {
  const isNight = iconCode?.endsWith('n');
  if (main === 'Clear' && isNight) return Moon;
  if (main === 'Clouds' && isNight) return CloudMoon;
  if (main === 'Clouds' && iconCode === '02d') return CloudSun;
  return ICON_MAP[main] || Cloud;
};

const BG_IMAGES = {
  sunny: 'https://images.unsplash.com/photo-1757169083847-bc8ce4868d05?w=1920&q=80&auto=format',
  cloudy: 'https://images.unsplash.com/photo-1761958150550-556b82335e0a?w=1920&q=80&auto=format',
  rainy: 'https://images.unsplash.com/photo-1511634829096-045a111727eb?w=1920&q=80&auto=format',
  night: 'https://images.unsplash.com/photo-1641895958846-19dab3471449?w=1920&q=80&auto=format',
};

export const getBackgroundImage = (weatherMain, iconCode) => {
  const isNight = iconCode?.endsWith('n');
  if (isNight) return BG_IMAGES.night;
  const map = {
    'Clear': BG_IMAGES.sunny,
    'Clouds': BG_IMAGES.cloudy,
    'Rain': BG_IMAGES.rainy,
    'Drizzle': BG_IMAGES.rainy,
    'Thunderstorm': BG_IMAGES.rainy,
    'Snow': BG_IMAGES.cloudy,
  };
  return map[weatherMain] || BG_IMAGES.sunny;
};

export const isRainy = (main) => ['Rain', 'Drizzle', 'Thunderstorm'].includes(main);

export const convertTemp = (tempC, unit) => {
  if (unit === 'imperial') return Math.round(tempC * 9 / 5 + 32);
  return Math.round(tempC);
};

export const tempUnit = (unit) => unit === 'imperial' ? '°F' : '°C';

export const formatTime = (timestamp, timezoneOffset) => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const h = date.getUTCHours();
  const m = date.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
};

export const getHourLabel = (timestamp, timezoneOffset) => {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  const h = date.getUTCHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12} ${ampm}`;
};

export const getDayName = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp * 1000);
  const isToday = now.toDateString() === date.toDateString();
  if (isToday) return 'Today';
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getFullDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
};

export const getAqiInfo = (aqi) => {
  const levels = [
    { label: 'Good', color: '#22c55e', bg: 'bg-green-500' },
    { label: 'Fair', color: '#eab308', bg: 'bg-yellow-500' },
    { label: 'Moderate', color: '#f97316', bg: 'bg-orange-500' },
    { label: 'Poor', color: '#ef4444', bg: 'bg-red-500' },
    { label: 'Very Poor', color: '#7c3aed', bg: 'bg-violet-600' },
  ];
  return levels[aqi - 1] || levels[0];
};

export const getWindDirection = (deg) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
};

export const groupForecastByDay = (list) => {
  if (!list?.length) return [];
  const days = {};
  list.forEach(item => {
    const dateKey = new Date(item.dt * 1000).toDateString();
    if (!days[dateKey]) days[dateKey] = { items: [], dt: item.dt };
    days[dateKey].items.push(item);
  });

  return Object.values(days).slice(0, 7).map(day => {
    const temps = day.items.map(i => i.main.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const conditions = day.items.map(i => i.weather[0].main);
    const freq = {};
    conditions.forEach(c => freq[c] = (freq[c] || 0) + 1);
    const mainCondition = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    const iconItem = day.items.find(i => i.weather[0].main === mainCondition);

    return {
      dt: day.dt,
      temp_max: maxTemp,
      temp_min: minTemp,
      weather: [{ main: mainCondition, icon: iconItem?.weather[0]?.icon || '01d' }],
    };
  });
};
