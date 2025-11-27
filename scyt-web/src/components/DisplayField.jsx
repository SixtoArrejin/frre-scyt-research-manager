import { Box, Text, useColorModeValue } from '@chakra-ui/react';

/**
 * Componente para mostrar campos de solo lectura con label y contenido
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string|React.ReactNode} props.value - Valor a mostrar
 * @param {Object} props.width - Ancho del componente (responsive)
 * @param {string} props.mb - Margin bottom
 * @param {Object} props.containerProps - Props adicionales para el Box contenedor
 * @param {Object} props.labelProps - Props adicionales para el Text del label
 * @param {Object} props.valueProps - Props adicionales para el Text del valor
 * @param {Object} props.boxProps - Props adicionales para el Box del contenido
 */
const DisplayField = ({
  label,
  value,
  width = { base: '100%', md: 'auto' },
  mb = '5vh',
  containerProps = {},
  labelProps = {},
  valueProps = {},
  boxProps = {},
}) => {
  // Colores para modo claro/oscuro
  const labelColor = useColorModeValue('gray.500', 'github.textMuted');
  const borderColor = useColorModeValue('gray.200', 'github.border');
  const bgColor = useColorModeValue('gray.50', 'github.borderMuted');
  const textColor = useColorModeValue('gray.700', 'github.text');

  return (
    <Box
      display='flex'
      flexDirection='column'
      width={width}
      mb={mb}
      {...containerProps}
    >
      <Text
        fontSize='sm'
        fontWeight='medium'
        color={labelColor}
        mb={2}
        {...labelProps}
      >
        {label}
      </Text>
      <Box
        px={3}
        py={1}
        border='1px'
        borderColor={borderColor}
        borderRadius='md'
        bg={bgColor}
        minH='36px'
        display='flex'
        alignItems='center'
        width='100%'
        {...boxProps}
      >
        <Text
          fontSize='md'
          color={textColor}
          textAlign='left'
          {...valueProps}
        >
          {value || ''}
        </Text>
      </Box>
    </Box>
  );
};

export default DisplayField;
