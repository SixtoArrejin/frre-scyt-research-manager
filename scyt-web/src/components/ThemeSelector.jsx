import { useColorMode } from '@chakra-ui/react';
import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Text,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { THEME_PREFERENCE_KEY, THEME_VALUES } from '../config/themeConstants';

/**
 * Componente selector de tema que permite elegir entre:
 * - Sistema: Usa la preferencia del sistema operativo
 * - Claro: Tema claro
 * - Oscuro: Tema oscuro
 *
 * La preferencia se guarda en localStorage y persiste entre sesiones.
 */
export default function ThemeSelector() {
  const { colorMode, setColorMode } = useColorMode();

  // Obtener la preferencia guardada (system, light, dark)
  const savedPreference = localStorage.getItem(THEME_PREFERENCE_KEY) || THEME_VALUES.SYSTEM;

  // Colores para el componente
  const borderColor = useColorModeValue('gray.200', 'github.border');
  const labelBg = useColorModeValue('gray.50', 'github.borderMuted');
  const iconColor = useColorModeValue('gray.600', 'github.textMuted');
  const selectedBg = useColorModeValue('blue.50', 'rgba(88, 166, 255, 0.15)');
  const selectedBorderColor = useColorModeValue('blue.500', 'github.accent');
  const descriptionColor = useColorModeValue('gray.500', 'github.textMuted');

  // Manejar el cambio de tema
  const handleThemeChange = (value) => {
    localStorage.setItem(THEME_PREFERENCE_KEY, value);

    if (value === THEME_VALUES.SYSTEM) {
      // Detectar preferencia del sistema
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorMode(systemPrefersDark ? 'dark' : 'light');
    } else {
      setColorMode(value);
    }
  };

  // Opciones de tema
  const themeOptions = [
    {
      value: THEME_VALUES.SYSTEM,
      label: 'Sistema',
      description: 'Sincronizar con el sistema',
      icon: FiMonitor,
    },
    {
      value: THEME_VALUES.LIGHT,
      label: 'Claro',
      description: 'Tema claro',
      icon: FiSun,
    },
    {
      value: THEME_VALUES.DARK,
      label: 'Oscuro',
      description: 'Tema oscuro',
      icon: FiMoon,
    },
  ];

  return (
    <FormControl>
      <FormLabel fontWeight="bold" mb={3}>
        Apariencia
      </FormLabel>
      <RadioGroup
        value={savedPreference}
        onChange={handleThemeChange}
      >
        <HStack
          spacing={4}
          flexWrap="wrap"
          justify={{ base: 'center', md: 'flex-start' }}
        >
          {themeOptions.map((option) => (
            <Box
              key={option.value}
              as="label"
              cursor="pointer"
              borderWidth="2px"
              borderRadius="lg"
              borderColor={savedPreference === option.value ? selectedBorderColor : borderColor}
              bg={savedPreference === option.value ? selectedBg : 'transparent'}
              px={4}
              py={3}
              minW="120px"
              transition="all 0.2s"
              _hover={{
                borderColor: selectedBorderColor,
              }}
            >
              <Radio value={option.value} display="none" />
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  bg={labelBg}
                  borderRadius="md"
                  p={2}
                  mb={2}
                >
                  <Icon
                    as={option.icon}
                    boxSize={5}
                    color={savedPreference === option.value ? selectedBorderColor : iconColor}
                  />
                </Box>
                <Text
                  fontWeight="medium"
                  fontSize="sm"
                  textAlign="center"
                >
                  {option.label}
                </Text>
                <Text
                  fontSize="xs"
                  color={descriptionColor}
                  textAlign="center"
                >
                  {option.description}
                </Text>
              </Box>
            </Box>
          ))}
        </HStack>
      </RadioGroup>
      <Text fontSize="xs" color={descriptionColor} mt={3}>
        Tema actual: {colorMode === 'dark' ? 'Oscuro' : 'Claro'}
      </Text>
    </FormControl>
  );
}
