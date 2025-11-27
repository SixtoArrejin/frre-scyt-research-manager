import { extendTheme } from '@chakra-ui/react';

/**
 * Configuración de tema para la aplicación SCyT
 *
 * CÓMO FUNCIONA EL SISTEMA DE TEMAS:
 * ==================================
 *
 * 1. Chakra UI utiliza `useColorMode()` y `useColorModeValue()` para manejar los temas.
 *
 * 2. Los modos disponibles son:
 *    - 'system': Detecta automáticamente el tema del sistema operativo
 *    - 'light': Tema claro (colores actuales de la app)
 *    - 'dark': Tema oscuro (inspirado en GitHub)
 *
 * 3. Para usar colores que cambien según el tema en un componente:
 *
 *    import { useColorModeValue } from '@chakra-ui/react';
 *
 *    const bgColor = useColorModeValue('white', 'gray.800'); // light, dark
 *    const textColor = useColorModeValue('gray.800', 'gray.100');
 *
 * 4. Para cambiar el modo de color programáticamente:
 *
 *    import { useColorMode } from '@chakra-ui/react';
 *
 *    const { colorMode, setColorMode, toggleColorMode } = useColorMode();
 *    setColorMode('dark'); // Cambiar a modo oscuro
 *    setColorMode('light'); // Cambiar a modo claro
 *    toggleColorMode(); // Alternar entre modos
 *
 * CÓMO PERSONALIZAR COLORES:
 * ==========================
 *
 * Para modificar los colores del tema, edita los objetos `lightColors` y `darkColors`.
 * Los colores semánticos (`semanticTokens`) mapean nombres lógicos a colores específicos
 * para cada modo.
 *
 * Ejemplo: Para cambiar el color de fondo principal en modo oscuro:
 *   - Busca 'bg.canvas' en semanticTokens.colors
 *   - Modifica el valor '_dark' al color deseado
 *
 * PALETA DE COLORES (basada en GitHub):
 * =====================================
 *
 * Modo Claro:
 *   - Fondo principal: white
 *   - Fondo secundario: gray.100
 *   - Texto principal: gray.800
 *   - Texto secundario: gray.600
 *   - Bordes: gray.200
 *
 * Modo Oscuro (GitHub-inspired):
 *   - Fondo principal: #0d1117 (casi negro con tinte azul)
 *   - Fondo secundario: #161b22 (gris oscuro con tinte azul)
 *   - Fondo de tarjetas: #21262d (gris medio)
 *   - Texto principal: #e6edf3 (blanco suave)
 *   - Texto secundario: #8b949e (gris claro)
 *   - Bordes: #30363d (gris oscuro)
 */

// Colores personalizados para la aplicación
const colors = {
  // Colores de marca
  brand: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff',
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
  },
  // Colores de GitHub para modo oscuro
  github: {
    canvas: '#0d1117',
    canvasSubtle: '#161b22',
    canvasInset: '#010409',
    border: '#30363d',
    borderMuted: '#21262d',
    text: '#e6edf3',
    textMuted: '#8b949e',
    textSubtle: '#6e7681',
    accent: '#58a6ff',
    success: '#3fb950',
    warning: '#d29922',
    danger: '#f85149',
  },
};

// Tokens semánticos que cambian según el modo de color
const semanticTokens = {
  colors: {
    // Colores de fondo
    'bg.canvas': {
      default: 'white',
      _dark: 'github.canvas',
    },
    'bg.surface': {
      default: 'white',
      _dark: 'github.canvasSubtle',
    },
    'bg.subtle': {
      default: 'gray.100',
      _dark: 'github.canvasSubtle',
    },
    'bg.muted': {
      default: 'gray.50',
      _dark: 'github.borderMuted',
    },
    'bg.hover': {
      default: 'gray.100',
      _dark: 'github.borderMuted',
    },
    // Colores de texto
    'text.primary': {
      default: 'gray.800',
      _dark: 'github.text',
    },
    'text.secondary': {
      default: 'gray.600',
      _dark: 'github.textMuted',
    },
    'text.muted': {
      default: 'gray.500',
      _dark: 'github.textSubtle',
    },
    // Colores de borde
    'border.default': {
      default: 'gray.200',
      _dark: 'github.border',
    },
    'border.muted': {
      default: 'gray.100',
      _dark: 'github.borderMuted',
    },
    // Colores de acento
    'accent.default': {
      default: 'blue.500',
      _dark: 'github.accent',
    },
    'accent.hover': {
      default: 'blue.600',
      _dark: 'blue.400',
    },
  },
};

// Estilos globales que se aplican a toda la aplicación
const styles = {
  global: (props) => ({
    body: {
      bg: props.colorMode === 'dark' ? 'github.canvas' : 'gray.100',
      color: props.colorMode === 'dark' ? 'github.text' : 'gray.800',
    },
  }),
};

// Configuración de componentes
const components = {
  // Configuración del Input con estilo floating
  Input: {
    variants: {
      floating: {
        field: {
          '&::placeholder': {
            color: 'gray',
          },
        },
      },
    },
    baseStyle: (props) => ({
      field: {
        bg: props.colorMode === 'dark' ? 'github.canvasSubtle' : 'white',
        borderColor: props.colorMode === 'dark' ? 'github.border' : 'gray.200',
        _hover: {
          borderColor: props.colorMode === 'dark' ? 'github.textMuted' : 'gray.300',
        },
        _focus: {
          borderColor: props.colorMode === 'dark' ? 'github.accent' : 'blue.500',
          boxShadow: props.colorMode === 'dark'
            ? '0 0 0 1px var(--chakra-colors-github-accent)'
            : '0 0 0 1px var(--chakra-colors-blue-500)',
        },
      },
    }),
  },
  // Configuración del Textarea
  Textarea: {
    baseStyle: (props) => ({
      bg: props.colorMode === 'dark' ? 'github.canvasSubtle' : 'white',
      borderColor: props.colorMode === 'dark' ? 'github.border' : 'gray.200',
      _hover: {
        borderColor: props.colorMode === 'dark' ? 'github.textMuted' : 'gray.300',
      },
      _focus: {
        borderColor: props.colorMode === 'dark' ? 'github.accent' : 'blue.500',
        boxShadow: props.colorMode === 'dark'
          ? '0 0 0 1px var(--chakra-colors-github-accent)'
          : '0 0 0 1px var(--chakra-colors-blue-500)',
      },
    }),
  },
  // Configuración del Form (para labels floating)
  Form: {
    variants: {
      floating: {
        container: {
          _focusWithin: {
            label: {
              transform: 'scale(0.85) translateY(-24px)',
              fontWeight: 'normal',
            },
          },
          'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
            {
              transform: 'scale(0.85) translateY(-24px)',
              fontWeight: 'normal',
            },
          label: {
            top: 0,
            left: 0,
            zIndex: 2,
            position: 'absolute',
            pointerEvents: 'none',
            mx: 3,
            px: 1,
            my: 2,
            transformOrigin: 'left top',
            fontWeight: 'normal',
            color: 'gray',
          },
        },
      },
    },
  },
  // Configuración del Card
  Card: {
    baseStyle: (props) => ({
      container: {
        bg: props.colorMode === 'dark' ? 'github.canvasSubtle' : 'white',
        borderColor: props.colorMode === 'dark' ? 'github.border' : 'gray.200',
      },
    }),
  },
  // Configuración del Modal
  Modal: {
    baseStyle: (props) => ({
      dialog: {
        bg: props.colorMode === 'dark' ? 'github.canvasSubtle' : 'white',
      },
    }),
  },
  // Configuración del Menu
  Menu: {
    baseStyle: (props) => ({
      list: {
        bg: props.colorMode === 'dark' ? 'github.canvasSubtle' : 'white',
        borderColor: props.colorMode === 'dark' ? 'github.border' : 'gray.200',
      },
      item: {
        bg: props.colorMode === 'dark' ? 'github.canvasSubtle' : 'white',
        _hover: {
          bg: props.colorMode === 'dark' ? 'github.borderMuted' : 'gray.100',
        },
        _focus: {
          bg: props.colorMode === 'dark' ? 'github.borderMuted' : 'gray.100',
        },
      },
    }),
  },
  // Configuración del Table
  Table: {
    variants: {
      striped: (props) => ({
        tbody: {
          tr: {
            '&:nth-of-type(odd)': {
              bg: props.colorMode === 'dark' ? 'github.borderMuted' : undefined,
            },
          },
        },
      }),
    },
  },
  // Configuración del Tabs
  Tabs: {
    variants: {
      'soft-rounded': (props) => ({
        tab: {
          _selected: {
            bg: props.colorMode === 'dark' ? 'github.accent' : 'blue.500',
            color: props.colorMode === 'dark' ? 'white' : 'white',
          },
        },
      }),
    },
  },
  // Configuración del Button
  Button: {
    baseStyle: (props) => ({
      _hover: {
        _disabled: {
          bg: props.colorMode === 'dark' ? 'github.borderMuted' : undefined,
        },
      },
    }),
  },
  // Configuración del Select
  Select: {
    baseStyle: (props) => ({
      field: {
        bg: props.colorMode === 'dark' ? 'github.canvasSubtle' : 'white',
        borderColor: props.colorMode === 'dark' ? 'github.border' : 'gray.200',
      },
    }),
  },
  // Configuración del Checkbox
  Checkbox: {
    baseStyle: (props) => ({
      control: {
        borderColor: props.colorMode === 'dark' ? 'github.border' : 'gray.200',
        _checked: {
          bg: props.colorMode === 'dark' ? 'github.accent' : 'blue.500',
          borderColor: props.colorMode === 'dark' ? 'github.accent' : 'blue.500',
        },
      },
    }),
  },
};

// Configuración del modo de color
const config = {
  initialColorMode: 'system', // Por defecto usa la preferencia del sistema
  useSystemColorMode: true, // Escucha cambios en la preferencia del sistema
};

// Creamos y exportamos el tema extendido
const theme = extendTheme({
  config,
  colors,
  semanticTokens,
  styles,
  components,
});

export default theme;
