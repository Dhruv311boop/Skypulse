import axios from 'axios';

const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const AIR_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const FAVORITES_KEY = 'skypulse:favorites';

const WEATHER_CODE_MAP = {
  0: ['Clear', 'clear sky', '01'],
  1: ['Clear', 'mainly clear', '01'],
  2: ['Clouds', 'partly cloudy', '02'],
  3: ['Clouds', 'overcast', '04'],
  45: ['Fog', 'fog', '50'],
  48: ['Fog', 'depositing rime fog', '50'],
  51: ['Drizzle', 'light drizzle', '09'],
  53: ['Drizzle', 'moderate drizzle', '09'],
  55: ['Drizzle', 'dense drizzle', '09'],
  61: ['Rain', 'slight rain', '10'],
  63: ['Rain', 'moderate rain', '10'],
  65: ['Rain', 'heavy rain', '10'],
  71: ['Snow', 'slight snow', '13'],
  73: ['Snow', 'moderate snow', '13'],
  75: ['Snow', 'heavy snow', '13'],
  80: ['Rain', 'slight rain showers', '09'],
  81: ['Rain', 'moderate rain showers', '09'],
  82: ['Rain', 'violent rain showers', '09'],
  95: ['Thunderstorm', 'thunderstorm', '11'],
  96: ['Thunderstorm', 'thunderstorm with hail', '11'],
  99: ['Thunderstorm', 'severe thunderstorm with hail', '11'],
};

const asUnix = (value) => Math.floor(new Date(value).getTime() / 1000);

function weatherFromCode(code, isDay = 1) {
  const [main, description, icon] = WEATHER_CODE_MAP[code] || WEATHER_CODE_MAP[0];
  return [{ main, description, icon: `${icon}${isDay ? 'd' : 'n'}` }];
}

function getStoredFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function mapAqiToOpenWeatherScale(value = 0) {
  if (value <= 20) return 1;
  if (value <= 40) return 2;
  if (value <= 60) return 3;
  if (value <= 80) return 4;
  return 5;
}

async function fetchForecast(lat, lon) {
  const { data } = await axios.get(WEATHER_API, {
    params: {
      latitude: lat,
      longitude: lon,
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation_probability',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'wind_speed_10m',
        'wind_direction_10m',
        'visibility',
      ].join(','),
      daily: ['temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset'].join(','),
      timezone: 'auto',
      wind_speed_unit: 'ms',
    },
  });
  return data;
}

export const getCurrentWeather = async (lat, lon) => {
  const data = await fetchForecast(lat, lon);
  const current = data.current;
  const today = data.daily;

  return {
    name: 'Current Location',
    dt: asUnix(current.time),
    timezone: data.utc_offset_seconds || 0,
    coord: { lat: Number(lat), lon: Number(lon) },
    sys: {
      country: data.timezone_abbreviation || '',
      sunrise: asUnix(today.sunrise[0]),
      sunset: asUnix(today.sunset[0]),
    },
    weather: weatherFromCode(current.weather_code, current.is_day),
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      temp_min: today.temperature_2m_min[0],
      temp_max: today.temperature_2m_max[0],
      humidity: current.relative_humidity_2m,
      pressure: Math.round(current.pressure_msl),
    },
    wind: {
      speed: current.wind_speed_10m,
      deg: current.wind_direction_10m,
      gust: current.wind_gusts_10m,
    },
    clouds: { all: current.cloud_cover },
    visibility: data.hourly?.visibility?.[0] || 10000,
  };
};

export const getForecast = async (lat, lon) => {
  const data = await fetchForecast(lat, lon);

  return {
    list: data.hourly.time.slice(0, 40).map((time, index) => ({
      dt: asUnix(time),
      main: {
        temp: data.hourly.temperature_2m[index],
        feels_like: data.hourly.apparent_temperature[index],
        humidity: data.hourly.relative_humidity_2m[index],
        pressure: Math.round(data.hourly.pressure_msl[index]),
      },
      weather: weatherFromCode(data.hourly.weather_code[index]),
      wind: {
        speed: data.hourly.wind_speed_10m[index],
        deg: data.hourly.wind_direction_10m[index],
      },
      clouds: { all: data.hourly.cloud_cover[index] },
      visibility: data.hourly.visibility[index],
      pop: (data.hourly.precipitation_probability[index] || 0) / 100,
    })),
  };
};

export const getAirQuality = async (lat, lon) => {
  const { data } = await axios.get(AIR_API, {
    params: {
      latitude: lat,
      longitude: lon,
      current: ['european_aqi', 'pm10', 'pm2_5', 'nitrogen_dioxide', 'ozone'].join(','),
      timezone: 'auto',
    },
  });

  return {
    list: [{
      main: { aqi: mapAqiToOpenWeatherScale(data.current.european_aqi) },
      components: {
        pm2_5: data.current.pm2_5,
        pm10: data.current.pm10,
        no2: data.current.nitrogen_dioxide,
        o3: data.current.ozone,
      },
    }],
  };
};

export const searchCities = async (query) => {
  const { data } = await axios.get(GEO_API, {
    params: { name: query, count: 6, language: 'en', format: 'json' },
  });

  return (data.results || []).map((city) => ({
    name: city.name,
    lat: city.latitude,
    lon: city.longitude,
    country: city.country_code || city.country || '',
    state: city.admin1 || '',
  }));
};

export const getFavorites = async () => getStoredFavorites();

export const addFavorite = async (cityData) => {
  const favorite = {
    id: `${cityData.city_name}-${cityData.lat}-${cityData.lon}`,
    ...cityData,
  };
  const favorites = getStoredFavorites();
  if (!favorites.find((item) => item.id === favorite.id)) {
    saveFavorites([...favorites, favorite]);
  }
  return favorite;
};

export const removeFavorite = async (id) => {
  saveFavorites(getStoredFavorites().filter((item) => item.id !== id));
};
