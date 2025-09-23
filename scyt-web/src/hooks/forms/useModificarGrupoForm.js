import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as yup from 'yup';
import { getGrupoById, updateGrupo } from '../../utils/api/gruposApi';
import { useFormHandler } from '../useFormHandler';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';

// Schema de validación para modificar grupo
const modificarGrupoSchema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  resolucion: yup
    .string()
    .required('La resolución es requerida')
    .matches(/^\d+\/\d+$/, 'El formato de la resolución debe ser \'###/###\''),
  fechaCreacion: yup.string().required('La fecha es requerida'),
  siglas: yup.string().required('Las siglas son requeridas'),
});

// Valores por defecto para el formulario
const defaultValues = {
  nombre: '',
  resolucion: '',
  fechaCreacion: '',
  siglas: '',
};

/**
 * Hook personalizado para manejo de modificación de grupo
 * @returns {Object} - Estado y funciones para manejo de modificación de grupo
 */
export const useModificarGrupoForm = () => {
  const navigate = useNavigate();
  const { idGrupoInvestigacion } = useParams();

  // Query para obtener los datos del grupo
  const { data: grupoData, isLoading: grupoLoading, error: grupoError } = useQuery(
    ['grupo', idGrupoInvestigacion],
    () => getGrupoById(idGrupoInvestigacion),
    {
      enabled: !!idGrupoInvestigacion,
    },
  );

  // Función para limpiar y formatear datos
  const formatData = (formData) => {
    return {
      ...formData,
    };
  };

  // Función de envío
  const submitGrupo = async(formData) => {
    const cleanedData = formatData(formData);
    return await updateGrupo(idGrupoInvestigacion, cleanedData);
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: modificarGrupoSchema,
    defaultValues,
    onSubmit: submitGrupo,
    onSuccess: () => navigate(-1),
    successTitle: 'Modificar grupo',
    successMessage: 'Se ha modificado el grupo exitosamente.',
  });

  // Resetear valores del formulario cuando se carga el grupo
  useEffect(() => {
    if (grupoData?.grupo) {
      form.reset({
        nombre: grupoData.grupo.nombre || '',
        resolucion: grupoData.grupo.resolucion || '',
        fechaCreacion: formatoFechaISOaAAAAMMDD(grupoData.grupo.fechaCreacion) || '',
        siglas: grupoData.grupo.siglas || '',
      });
    }
  }, [grupoData, form.reset]);

  // Función para cancelar
  const handleCancel = () => {
    form.resetForm();
    navigate(-1);
  };

  // Función para abrir modal (validando formulario)
  const handleOpenModal = () => {
    const isValid = form.trigger();
    if (isValid) {
      // La apertura del modal se maneja desde el componente
    }
  };

  return {
    ...form,
    grupoData,
    grupoLoading,
    grupoError,
    handleCancel,
    handleOpenModal,
    isLoading: grupoLoading,
    onSubmit: form.submitHandler,
  };
};
