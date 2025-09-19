import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { createPersona } from '../utils/api/personasApi';
import { getAllGrupos } from '../utils/api/gruposApi';
import { useFormHandler } from './useFormHandler';
import { useErrorHandler } from './useErrorHandler';

// Schema de validación para investigadores
const investigadorSchema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .trim(),
  apellido: yup
    .string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido solo puede contener letras y espacios')
    .trim(),
  dni: yup
    .string()
    .required('El DNI es requerido')
    .matches(/^\d+$/, 'El DNI solo puede contener números')
    .test('dni-length', 'El DNI debe tener exactamente entre 7 y 8 dígitos', (value) => {
      if (!value) return false;
      const cleanValue = value.toString().replace(/\D/g, '');
      return cleanValue.length >= 7 && cleanValue.length <= 8;
    })
    .test('dni-range', 'El DNI debe ser un número válido', (value) => {
      if (!value) return false;
      const numericValue = parseInt(value, 10);
      return numericValue >= 1000000 && numericValue <= 99999999;
    }),
  idGrupoInvestigacion: yup
    .mixed()
    .required('Debe seleccionar un grupo de investigación')
    .test('is-valid-group', 'Debe seleccionar un grupo válido', (value) => {
      if (!value || value === '') return false;
      const numValue = parseInt(value, 10);
      return !isNaN(numValue) && numValue > 0;
    }),
});

// Valores por defecto para el formulario
const defaultValues = {
  nombre: '',
  apellido: '',
  dni: '',
  idGrupoInvestigacion: '',
  activo: true,
};

/**
 * Hook personalizado para manejo de investigadores
 * @returns {Object} - Estado y funciones para manejo de investigadores
 */
export const useInvestigadorForm = () => {
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();

  // Query para obtener grupos
  const {
    data: gruposData,
    isLoading: gruposLoading,
    error: gruposError,
  } = useQuery('grupos', getAllGrupos, {
    onError: (error) => {
      errorHandler.handleError(error, {
        skipToast: false,
        duration: 5000,
      });
    },
    retry: 2,
    retryDelay: 1000,
  });

  // Función para limpiar y formatear datos
  const formatData = (formData) => {
    return {
      ...formData,
      nombre: formData.nombre?.trim(),
      apellido: formData.apellido?.trim(),
      dni: formData.dni && formData.dni !== '' ? parseInt(formData.dni, 10) : null,
      idGrupoInvestigacion:
        formData.idGrupoInvestigacion && formData.idGrupoInvestigacion !== ''
          ? parseInt(formData.idGrupoInvestigacion, 10)
          : null,
    };
  };

  // Validar datos antes de enviar
  const validateData = (cleanedData) => {
    if (
      !cleanedData.nombre ||
      !cleanedData.apellido ||
      !cleanedData.dni ||
      !cleanedData.idGrupoInvestigacion
    ) {
      throw new Error('Todos los campos son requeridos');
    }
  };

  // Función de envío
  const submitInvestigador = async(formData) => {
    const cleanedData = formatData(formData);
    validateData(cleanedData);
    return await createPersona(cleanedData);
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: investigadorSchema,
    defaultValues,
    onSubmit: submitInvestigador,
    onSuccess: () => navigate(-1),
    successTitle: 'Investigador creado exitosamente',
    getSuccessMessage: (data) =>
      `Se ha creado el investigador ${data?.nombre || ''} ${data?.apellido || ''} correctamente`,
  });

  // Función para cancelar
  const handleCancel = () => {
    form.resetForm();
    navigate(-1);
  };

  // Preparar opciones de grupos
  const gruposOptions = gruposData?.grupos?.map((grupo) => ({
    value: grupo.idGrupoInvestigacion,
    label: grupo.siglas,
  })) || [];

  return {
    ...form,
    gruposOptions,
    gruposLoading,
    gruposError,
    handleCancel,
  };
};
