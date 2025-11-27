import { useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { THEME_PREFERENCE_KEY, THEME_VALUES } from '../config/themeConstants';

/**
 * Hook que inicializa el tema basándose en la preferencia guardada
 * en localStorage. Se ejecuta una vez al montar el componente.
 *
 * Si la preferencia es 'system', detecta la preferencia del sistema operativo.
 * Si es 'light' o 'dark', aplica ese tema directamente.
 */
export default function useThemeInitializer() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    const savedPreference = localStorage.getItem(THEME_PREFERENCE_KEY);

    if (savedPreference === THEME_VALUES.SYSTEM || !savedPreference) {
      // Detectar preferencia del sistema
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorMode(systemPrefersDark ? 'dark' : 'light');

      // Escuchar cambios en la preferencia del sistema
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const currentPreference = localStorage.getItem(THEME_PREFERENCE_KEY);
        if (currentPreference === THEME_VALUES.SYSTEM || !currentPreference) {
          setColorMode(e.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Aplicar la preferencia guardada (light o dark)
      setColorMode(savedPreference);
    }
  }, [setColorMode]);
}
