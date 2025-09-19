import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { getPersonaById, updatePersona } from '../../utils/api/personasApi';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { useFormHandler } from '../useFormHandler';
import { useErrorHandler } from '../useErrorHandler';

// Schema de validación para modificar investigadores (más flexible)
const modificarInvestigadorSchema = yup.object({
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
    .required('Indique a que grupo pertenece')
    .test('idNaN', 'Indique a que grupo pertenece', (val) => !isNaN(val)),
  activo: yup.boolean().required('El estado es requerido'),
});

// Valores por defecto para el formulario de modificación
const defaultValues = {
  nombre: '',
  apellido: '',
  dni: '',
  idGrupoInvestigacion: '',
  activo: false,
};

/**
 * Hook personalizado para modificar investigadores
 * @returns {Object} - Estado y funciones para modificar investigadores
 */
export const useModificarInvestigadorForm = () => {
  const navigate = useNavigate();
  const errorHandler = useErrorHandler();
  const { idPersona } = useParams();
  const hasFilledForm = useRef(false);
  const queryClient = useQueryClient();

  // Query para obtener datos del investigador
  const {
    data: investigador,
    isLoading: investigadorLoading,
    error: investigadorError,
  } = useQuery(
    ['persona', idPersona],
    () => getPersonaById(idPersona),
    {
      enabled: !!idPersona,
      onError: (error) => {
        errorHandler.handleError(error, {
          skipToast: false,
          duration: 5000,
        });
      },
      retry: 2,
      retryDelay: 1000,
    },
  );

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

  // Función para formatear datos antes del envío
  const formatData = (formData) => {
    return {
      ...formData,
      nombre: formData.nombre?.trim(),
      apellido: formData.apellido?.trim(),
      dni: parseInt(formData.dni, 10),
      idGrupoInvestigacion: parseInt(formData.idGrupoInvestigacion, 10),
      activo: formData.activo, // Ya es boolean, no necesita conversión
    };
  };

  // Función de envío
  const submitModificarInvestigador = async(formData) => {
    const cleanedData = formatData(formData);
    const result = await updatePersona(idPersona, cleanedData);

    // Invalidar cache para que se actualicen los datos en otras páginas
    queryClient.invalidateQueries(['persona', idPersona]);
    queryClient.invalidateQueries(['personas']); // Por si hay una lista de investigadores

    return result;
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: modificarInvestigadorSchema,
    defaultValues,
    mode: 'onBlur',
    onSubmit: submitModificarInvestigador,
    onSuccess: () => navigate(-1),
    successTitle: 'Investigador modificado exitosamente',
    getSuccessMessage: () =>
      'Se han actualizado los datos del investigador correctamente',
  });

  // Efecto para resetear el flag cuando cambia el ID del investigador
  useEffect(() => {
    hasFilledForm.current = false;
  }, [idPersona]);

  // Efecto para llenar el formulario cuando se cargan los datos (solo una vez)
  useEffect(() => {
    if (investigador?.persona && form.setValue && !hasFilledForm.current) {
      form.setValue('activo', investigador.persona.activo); // Ya es boolean
      form.setValue('nombre', investigador.persona.nombre);
      form.setValue('apellido', investigador.persona.apellido);
      form.setValue('dni', investigador.persona.dni);
      form.setValue('idGrupoInvestigacion', investigador.persona.idGrupoInvestigacion);
      hasFilledForm.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [investigador?.persona]);

  // Función para cancelar
  const handleCancel = () => {
    form.resetForm();
    hasFilledForm.current = false; // Reset del flag al cancelar
    navigate(-1);
  };

  // Preparar opciones de grupos
  const gruposOptions = gruposData?.grupos?.map((grupo) => ({
    value: parseInt(grupo.idGrupoInvestigacion),
    label: grupo.siglas,
  })) || [];

  // Opciones para el estado activo/inactivo
  const estadoOptions = [
    { value: 'true', label: 'Activo' },
    { value: 'false', label: 'Inactivo' },
  ];

  return {
    ...form,
    investigador,
    investigadorLoading,
    investigadorError,
    gruposOptions,
    gruposLoading,
    gruposError,
    estadoOptions,
    handleCancel,
    isLoading: investigadorLoading || gruposLoading,
  };
};
