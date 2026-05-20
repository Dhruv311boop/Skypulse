import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const THEME_CONFIG = {
  light: { Icon: Sun, label: 'Light' },
  dark: { Icon: Moon, label: 'Dark' },
  system: { Icon: Monitor, label: 'System' },
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { Icon, label } = THEME_CONFIG[theme] || THEME_CONFIG.system;

  return (
    <button
      onClick={toggleTheme}
      className="neu-button flex items-center gap-2 px-4 py-2.5 bg-white/40 dark:bg-black/30 text-sm font-medium text-slate-700 dark:text-white/80"
      data-testid="theme-toggle"
      aria-label={`Theme: ${label}`}
      title={`Theme: ${label}`}
    >
      <Icon className="w-4 h-4" strokeWidth={2.5} />
      <span className="hidden sm:inline text-xs">{label}</span>
    </button>
  );
}
