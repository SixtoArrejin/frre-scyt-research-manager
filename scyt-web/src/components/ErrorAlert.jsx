import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box } from '@chakra-ui/react';

/**
 * Componente reutilizable para mostrar errores
 * @param {Object} props
 * @param {Object} props.error - Objeto de error con title y message
 * @param {string} props.status - Estado del alert ('error', 'warning', 'info', 'success')
 * @param {Object} props.containerProps - Props adicionales para el contenedor Box
 */
const ErrorAlert = ({ error, status = 'error', containerProps = {} }) => {
  if (!error) return null;

  return (
    <Box width='100%' mb={4} {...containerProps}>
      <Alert status={status}>
        <AlertIcon />
        <Box flex='1'>
          <AlertTitle mr={2}>{error.title}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Box>
      </Alert>
    </Box>
  );
};

export default ErrorAlert;
