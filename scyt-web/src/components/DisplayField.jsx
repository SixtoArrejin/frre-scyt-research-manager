import React from 'react';
import { Box, Text } from '@chakra-ui/react';

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
        color='gray.500'
        mb={2}
        {...labelProps}
      >
        {label}
      </Text>
      <Box
        px={3}
        py={2}
        border='1px'
        borderColor='gray.200'
        borderRadius='md'
        bg='gray.50'
        minH='36px'
        display='flex'
        alignItems='center'
        width='100%'
        {...boxProps}
      >
        <Text
          fontSize='md'
          color='gray.700'
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
