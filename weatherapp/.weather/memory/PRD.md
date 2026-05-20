# Weather Dashboard - PRD

## Original Problem Statement
Build a modern, responsive weather website with glassmorphism + neumorphism design, featuring current weather, forecasts, air quality, favorites, and dynamic weather backgrounds.

## Architecture
- **Backend**: FastAPI (Python) proxying OpenWeatherMap API, MongoDB for favorites
- **Frontend**: React with Tailwind CSS, Shadcn UI components
- **Database**: MongoDB (favorites collection)
- **External API**: OpenWeatherMap (current weather, 5-day forecast, air pollution, geocoding)

## User Personas
- General users checking weather for their location
- Travelers searching weather for multiple cities
- Users who want to save and quickly switch between favorite cities

## Core Requirements
- Current weather display with geolocation
- City search with autocomplete
- Temperature C/F toggle
- 5-day forecast with temperature range bars
- 24-hour (3-hour interval) hourly forecast
- Air quality index with pollutant breakdown
- Sunrise/sunset visualization with SVG arc
- Metric tiles: wind speed, humidity, pressure, visibility, feels like, cloud cover
- Save favorite cities to MongoDB
- Dark/light mode with system auto-detect
- Dynamic weather backgrounds (sunny, cloudy, rainy, night)
- Glassmorphism + neumorphism UI design
- Rain animation overlay for rainy weather

## What's Been Implemented (April 14, 2026)
- Full backend with 7 API endpoints (weather, forecast, AQI, geocode, favorites CRUD)
- Complete frontend dashboard with 12 components
- Glassmorphism glass cards with backdrop-blur
- Neumorphic buttons and toggles
- Dynamic backgrounds from Unsplash based on weather condition
- Manrope + Figtree typography
- Staggered entrance animations
- Loading skeletons
- Mobile-first responsive grid layout (1/3/4 columns)
- All tests passing (100% backend, 95% frontend)

## Prioritized Backlog
### P0 (Done)
- [x] Current weather, forecast, AQI, search, favorites, toggles, backgrounds

### P1
- [ ] Weather alerts/warnings from API
- [ ] Geolocation permission prompt UX improvement
- [ ] PWA support for offline access

### P2
- [ ] Weather maps (radar, satellite)
- [ ] Historical weather data
- [ ] Multi-language support
- [ ] Widget/embed mode

## Next Tasks
1. Consider adding weather alerts if using One Call API subscription
2. Add PWA manifest for mobile home screen installation
3. Weather notification system for favorite cities
