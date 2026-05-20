import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const getCurrentWeather = async (lat, lon, city) => {
  const params = city ? { city } : { lat, lon };
  const { data } = await axios.get(`${API}/weather/current`, { params });
  return data;
};

export const getForecast = async (lat, lon) => {
  const { data } = await axios.get(`${API}/weather/forecast`, { params: { lat, lon } });
  return data;
};

export const getAirQuality = async (lat, lon) => {
  const { data } = await axios.get(`${API}/weather/air-quality`, { params: { lat, lon } });
  return data;
};

export const searchCities = async (query) => {
  const { data } = await axios.get(`${API}/weather/geocode`, { params: { q: query } });
  return data;
};

export const getFavorites = async () => {
  const { data } = await axios.get(`${API}/favorites`);
  return data;
};

export const addFavorite = async (cityData) => {
  const { data } = await axios.post(`${API}/favorites`, cityData);
  return data;
};

export const removeFavorite = async (id) => {
  await axios.delete(`${API}/favorites/${id}`);
};
