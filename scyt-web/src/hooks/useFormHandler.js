import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorHandler } from './useErrorHandler';

/**
 * Hook personalizado para formularios con validación y manejo de errores
 * @param {Object} config - Configuración del formulario
 * @param {Object} config.schema - Schema de validación Yup
 * @param {Object} config.defaultValues - Valores por defecto del formulario
 * @param {string} config.mode - Modo de validación ('onChange', 'onBlur', 'onSubmit')
 * @param {Function} config.onSubmit - Función a ejecutar al enviar el formulario
 * @param {Function} config.onSuccess - Función a ejecutar en caso de éxito
 * @param {string} config.successTitle - Título del mensaje de éxito
 * @param {Function} config.getSuccessMessage - Función para generar mensaje de éxito
 * @returns {Object} - Propiedades y funciones del formulario
 */
export const useFormHandler = ({
  schema,
  defaultValues,
  mode = 'onBlur',
  onSubmit,
  onSuccess,
  successTitle = 'Operación exitosa',
  getSuccessMessage,
}) => {
  const errorHandler = useErrorHandler();

  const formMethods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode,
  });

  const { handleSubmit, reset, clearErrors, formState: { isSubmitting } } = formMethods;

  const submitHandler = async(data) => {
    try {
      errorHandler.clearError();
      clearErrors();

      const result = await onSubmit(data);

      // Mostrar mensaje de éxito
      const successMessage = getSuccessMessage ? getSuccessMessage(result) : 'Operación completada exitosamente';
      errorHandler.showSuccess(successTitle, successMessage);

      // Ejecutar callback de éxito si existe
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      errorHandler.handleError(error);
      throw error;
    }
  };

  const resetForm = () => {
    reset();
    clearErrors();
    errorHandler.clearError();
  };

  return {
    ...formMethods,
    error: errorHandler.error,
    isSubmitting,
    submitHandler: handleSubmit(submitHandler),
    onSubmitRaw: submitHandler, // Función sin envolver para casos especiales
    resetForm,
    clearError: errorHandler.clearError,
  };
};
