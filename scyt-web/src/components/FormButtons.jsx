import React from 'react';
import { Box, Button } from '@chakra-ui/react';

/**
 * Componente reutilizable para botones de formulario
 * @param {Object} props
 * @param {Function} props.onCancel - Función para cancelar
 * @param {Function} props.onSubmit - Función para enviar
 * @param {boolean} props.isLoading - Estado de carga
 * @param {boolean} props.isDisabled - Estado deshabilitado
 * @param {string} props.cancelText - Texto del botón cancelar
 * @param {string} props.submitText - Texto del botón enviar
 * @param {Object} props.containerProps - Props del contenedor
 */
const FormButtons = ({
  onCancel,
  onSubmit,
  isLoading = false,
  isDisabled = false,
  cancelText = 'Cancelar',
  submitText = 'Guardar',
  containerProps = {},
}) => {
  return (
    <Box
      display='flex'
      width='90%'
      alignItems='center'
      justifyContent='flex-end'
      {...containerProps}
    >
      <Button
        colorScheme='gray'
        variant='outline'
        onClick={onCancel}
        mr='3%'
      >
        {cancelText}
      </Button>
      <Button
        onClick={onSubmit}
        isLoading={isLoading}
        colorScheme='blue'
        variant='outline'
        isDisabled={isDisabled}
      >
        {submitText}
      </Button>
    </Box>
  );
};

export default FormButtons;
