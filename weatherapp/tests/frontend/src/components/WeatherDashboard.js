import { useWeather } from '@/contexts/WeatherContext';
import { SearchBar } from './SearchBar';
import { FavoriteCities } from './FavoriteCities';
import { CurrentWeather } from './CurrentWeather';
import { HourlyForecast } from './HourlyForecast';
import { WeeklyForecast } from './WeeklyForecast';
import { MetricTiles } from './MetricTiles';
import { AqiMeter } from './AqiMeter';
import { SunriseSunset } from './SunriseSunset';
import { WeatherBackground } from './WeatherBackground';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ThemeToggle } from './ThemeToggle';
import { TempToggle } from './TempToggle';
import { CloudOff, KeyRound } from 'lucide-react';

export default function WeatherDashboard() {
  const { currentWeather } = useWeather();

  return (
    <div className="relative min-h-screen" data-testid="weather-dashboard">
      <WeatherBackground weather={currentWeather} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
        <DashboardHeader />
        <FavoriteCities />
        <DashboardContent />
        <TeamFooter />
      </div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6" data-testid="dashboard-header">
      <div className="flex items-center gap-4">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white" data-testid="app-title">
          SKY<span className="text-sky-500">PULSE</span>
        </h1>
        <SearchBar />
      </div>
      <div className="flex items-center gap-3">
        <TempToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}

function DashboardContent() {
  const { loading, error, apiKeyMissing } = useWeather();

  if (apiKeyMissing) return <ApiKeyNotice />;
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorNotice message={error} />;
  return <WeatherGrid />;
}

function WeatherGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
      <div className="md:col-span-2 md:row-span-2 opacity-0 animate-fade-up stagger-1">
        <CurrentWeather />
      </div>
      <div className="md:row-span-2 opacity-0 animate-fade-up stagger-2">
        <WeeklyForecast />
      </div>
      <div className="opacity-0 animate-fade-up stagger-3">
        <AqiMeter />
      </div>
      <div className="opacity-0 animate-fade-up stagger-4">
        <SunriseSunset />
      </div>
      <div className="md:col-span-3 lg:col-span-4 opacity-0 animate-fade-up stagger-5">
        <HourlyForecast />
      </div>
      <MetricTiles />
    </div>
  );
}

function ApiKeyNotice() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass-card p-8 max-w-md text-center space-y-4" data-testid="api-key-notice">
        <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center mx-auto">
          <KeyRound className="w-8 h-8 text-sky-500" strokeWidth={2.5} />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
          API Key Required
        </h2>
        <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed">
          Add your OpenWeatherMap API key to get started. Sign up for free at{' '}
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 underline"
          >
            openweathermap.org
          </a>
        </p>
        <code className="block text-xs bg-black/10 dark:bg-white/10 rounded-xl p-3 text-left font-mono">
          # Add to backend/.env<br />
          OPENWEATHER_API_KEY=your_key_here
        </code>
      </div>
    </div>
  );
}

function ErrorNotice({ message }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="glass-card p-8 max-w-md text-center space-y-4" data-testid="error-notice">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
          <CloudOff className="w-8 h-8 text-red-400" strokeWidth={2.5} />
        </div>
        <h2 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="text-slate-600 dark:text-white/70 text-sm">{message}</p>
      </div>
    </div>
  );
}

const TEAM = ['Dhruv Chaudhary / Full Stack Developer'];

function TeamFooter() {
  return (
    <footer className="mt-10 pb-4 text-center" data-testid="team-footer">
      <div className="glass-card inline-flex items-center gap-3 !rounded-full px-6 py-2.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-white/50">Built by</span>
        <div className="flex items-center gap-2">
          {TEAM.map((name, i) => (
            <span key={name} className="text-xs font-medium text-slate-700 dark:text-white/80">
              {name}{i < TEAM.length - 1 && <span className="text-slate-400 dark:text-white/30 ml-2">&middot;</span>}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
