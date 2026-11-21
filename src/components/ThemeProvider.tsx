import { useEffect } from 'react';
import { useAppStore } from '@/store';
import { useTranslation } from 'react-i18next';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { language } = useAppStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    const root = document.documentElement;
    // Strictly enforce the luminous Nordic & Eje Cafetero light theme (no dark or gloomy modes)
    root.classList.remove('theme-nordic', 'theme-warm', 'theme-dark', 'dark', 'high-contrast');
    root.classList.add('theme-nordic');
    root.style.colorScheme = 'light';
  }, []);

  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.lang = language || 'es';
  }, [language, i18n]);

  return <>{children}</>;
}
