import { useState } from 'react';
import { useToast } from '@chakra-ui/react';

/**
 * Hook personalizado para manejo centralizado de errores
 * @param {Object} options - Configuración del hook
 * @param {string} options.defaultErrorTitle - Título por defecto para errores
 * @param {string} options.defaultErrorMessage - Mensaje por defecto para errores
 * @returns {Object} - Estado y funciones para manejo de errores
 */
export const useErrorHandler = ({
  defaultErrorTitle = 'Error',
  defaultErrorMessage = 'Ha ocurrido un error inesperado. Intente nuevamente.',
} = {}) => {
  const [error, setError] = useState(null);
  const toast = useToast();

  // Mapeo de códigos de error HTTP a mensajes específicos
  const errorMessages = {
    400: {
      title: 'Datos inválidos',
      getMessage: (errorData) => {
        if (errorData?.message?.includes('DNI')) {
          return 'El DNI ingresado ya existe o no es válido.';
        }
        if (errorData?.message?.includes('grupo')) {
          return 'El grupo de investigación seleccionado no es válido.';
        }
        return errorData?.message || 'Los datos ingresados no son válidos.';
      },
    },
    409: {
      title: 'Conflicto de datos',
      getMessage: () => 'Ya existe un registro con los mismos datos.',
    },
    500: {
      title: 'Error del servidor',
      getMessage: () => 'Error interno del servidor. Contacte al administrador.',
    },
    503: {
      title: 'Servicio no disponible',
      getMessage: () => 'El servicio no está disponible temporalmente. Intente más tarde.',
    },
  };

  const handleError = (error, options = {}) => {
    console.error('Error capturado:', error);

    let errorMessage = defaultErrorMessage;
    let errorTitle = defaultErrorTitle;

    // Manejo específico de errores según el tipo de respuesta
    if (error?.response?.data) {
      const { status, data: errorData } = error.response;
      const errorConfig = errorMessages[status];

      if (errorConfig) {
        errorTitle = errorConfig.title;
        errorMessage = errorConfig.getMessage(errorData);
      } else {
        errorMessage = errorData?.message || errorMessage;
      }
    } else if (error?.message) {
      if (error.message.includes('Network')) {
        errorTitle = 'Error de conexión';
        errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      } else if (error.message === 'Todos los campos son requeridos') {
        errorTitle = 'Campos requeridos';
        errorMessage = 'Complete todos los campos obligatorios.';
      } else {
        errorMessage = error.message;
      }
    }

    const errorInfo = { title: errorTitle, message: errorMessage };
    setError(errorInfo);

    // Mostrar toast si no se especifica lo contrario
    if (!options.skipToast) {
      toast({
        title: errorTitle,
        description: errorMessage,
        status: 'error',
        duration: options.duration || 6000,
        isClosable: true,
      });
    }

    return errorInfo;
  };

  const clearError = () => {
    setError(null);
  };

  const showSuccess = (title, description, duration = 4000) => {
    toast({
      title,
      description,
      status: 'success',
      duration,
      isClosable: true,
    });
  };

  return {
    error,
    handleError,
    clearError,
    showSuccess,
  };
};
