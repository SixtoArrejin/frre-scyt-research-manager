import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { createPersona } from '../../utils/api/personasApi';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { useFormHandler } from '../useFormHandler';
import { useErrorHandler } from '../useErrorHandler';

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
    .mixed()
    .required('El DNI es requerido')
    .test('NaN', 'El DNI es requerido', (val) => !isNaN(val))
    .test('lenDNI', 'El DNI debe tener 8 dígitos', (val) => val.toString().length == 8),
  idGrupoInvestigacion: yup
    .mixed()
    .required('Debe seleccionar un grupo de investigación')
    .test('is-valid-group', 'Debe seleccionar un grupo válido', (value) => {
      if (!value || value === '') return false;
      const numValue = parseInt(value, 10);
      return !isNaN(numValue) && numValue > 0;
    }),
  fechaIngresoGrupo: yup
    .date()
    .required('La fecha de ingreso al grupo es requerida')
    .max(new Date(), 'La fecha de ingreso no puede ser futura')
    .typeError('Debe ingresar una fecha válida'),
  esBecario: yup.boolean(),
  legajo: yup
    .string()
    .required('El legajo es requerido')
    .trim(),
  tienePosgrado: yup.boolean().when('esBecario', {
    is: false,
    then: (schema) => schema.required('Debe indicar si tiene posgrado'),
    otherwise: (schema) => schema.notRequired(),
  }),
  nivelPosgrado: yup.string().when(['esBecario', 'tienePosgrado'], {
    is: (esBecario, tienePosgrado) => !esBecario && tienePosgrado,
    then: (schema) => schema.required('Debe seleccionar el nivel de posgrado'),
    otherwise: (schema) => schema.notRequired(),
  }),
  otroPosgrado: yup.string().when(['esBecario', 'tienePosgrado', 'nivelPosgrado'], {
    is: (esBecario, tienePosgrado, nivelPosgrado) => !esBecario && tienePosgrado && nivelPosgrado === 'otro',
    then: (schema) => schema.required('Debe especificar el tipo de posgrado').trim(),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Valores por defecto para el formulario
const defaultValues = {
  nombre: '',
  apellido: '',
  dni: '',
  idGrupoInvestigacion: '',
  fechaIngresoGrupo: '',
  activo: true,
  esBecario: false,
  legajo: '',
  tienePosgrado: false,
  nivelPosgrado: '',
  otroPosgrado: '',
};

/**
 * Hook personalizado para manejo de investigadores
 * @returns {Object} - Estado y funciones para manejo de investigadores
 */
export const useNuevoInvestigadorForm = () => {
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
    const baseData = {
      ...formData,
      nombre: formData.nombre?.trim(),
      apellido: formData.apellido?.trim(),
      dni: formData.dni && formData.dni !== '' ? parseInt(formData.dni, 10) : null,
      idGrupoInvestigacion:
        formData.idGrupoInvestigacion && formData.idGrupoInvestigacion !== ''
          ? parseInt(formData.idGrupoInvestigacion, 10)
          : null,
      fechaIngresoGrupo: formData.fechaIngresoGrupo ? new Date(formData.fechaIngresoGrupo).toISOString() : null,
      esBecario: formData.esBecario || false,
      legajo: formData.legajo?.trim() || null,
    };

    // Solo incluir campos de posgrado si NO es becario
    if (!formData.esBecario) {
      baseData.tienePosgrado = formData.tienePosgrado || false;
      if (formData.tienePosgrado) {
        baseData.nivelPosgrado = formData.nivelPosgrado || null;
        baseData.otroPosgrado = formData.nivelPosgrado === 'otro' ? formData.otroPosgrado?.trim() || null : null;
      } else {
        baseData.nivelPosgrado = null;
        baseData.otroPosgrado = null;
      }
    } else {
      // Si es becario, asegurar que estos campos sean null
      baseData.tienePosgrado = false;
      baseData.nivelPosgrado = null;
      baseData.otroPosgrado = null;
    }

    return baseData;
  };

  // Validar datos antes de enviar
  const validateData = (cleanedData) => {
    if (
      !cleanedData.nombre ||
      !cleanedData.apellido ||
      !cleanedData.dni ||
      !cleanedData.idGrupoInvestigacion ||
      !cleanedData.fechaIngresoGrupo
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
