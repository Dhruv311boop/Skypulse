import { useState, useRef, useEffect, useCallback } from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { searchCities } from '@/lib/weatherApi';
import { Search, MapPin, Loader2 } from 'lucide-react';

/** Custom hook: debounced city autocomplete */
function useSearchAutocomplete(onSelect) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const ref = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback((value) => {
    setQuery(value);
    clearTimeout(timerRef.current);
    if (value.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await searchCities(value);
        setResults(data);
        setOpen(data.length > 0);
      } catch (err) {
        console.warn('City search failed:', err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, []);

  const handleSelect = useCallback((city) => {
    onSelect(city.lat, city.lon, city.name);
    setQuery(`${city.name}, ${city.country}`);
    setOpen(false);
    setResults([]);
  }, [onSelect]);

  return { query, results, open, searching, ref, handleSearch, handleSelect };
}

export function SearchBar() {
  const { selectCity } = useWeather();
  const { query, results, open, searching, ref, handleSearch, handleSelect } = useSearchAutocomplete(selectCity);

  return (
    <div ref={ref} className="relative w-full sm:w-80" data-testid="search-bar">
      <SearchInput query={query} searching={searching} onSearch={handleSearch} />
      {open && results.length > 0 && (
        <SearchResults results={results} onSelect={handleSelect} />
      )}
    </div>
  );
}

function SearchInput({ query, searching, onSearch }) {
  return (
    <div className="glass-card flex items-center gap-2 px-4 py-2.5 neu-inset !rounded-full !p-0">
      <div className="flex items-center gap-2 px-4 py-2.5 w-full">
        {searching ? (
          <Loader2 className="w-4 h-4 text-slate-400 dark:text-white/40 animate-spin" strokeWidth={2.5} />
        ) : (
          <Search className="w-4 h-4 text-slate-400 dark:text-white/40" strokeWidth={2.5} />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search city..."
          className="bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 outline-none w-full font-body"
          data-testid="search-input"
        />
      </div>
    </div>
  );
}

function SearchResults({ results, onSelect }) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 glass-card !rounded-2xl overflow-hidden z-50 !p-0" data-testid="search-results">
      {results.map((city, i) => (
        <button
          key={`${city.lat}-${city.lon}-${i}`}
          onClick={() => onSelect(city)}
          className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
          data-testid={`search-result-${i}`}
        >
          <MapPin className="w-4 h-4 text-sky-500 flex-shrink-0" strokeWidth={2.5} />
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-white">{city.name}</p>
            <p className="text-xs text-slate-400 dark:text-white/40">
              {city.state ? `${city.state}, ` : ''}{city.country}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
