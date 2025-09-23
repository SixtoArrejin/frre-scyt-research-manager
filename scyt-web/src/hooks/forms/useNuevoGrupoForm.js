import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { createGrupo } from '../../utils/api/gruposApi';
import { useFormHandler } from '../useFormHandler';

// Schema de validación para nuevo grupo
const nuevoGrupoSchema = yup.object({
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
 * Hook personalizado para manejo de nuevo grupo
 * @returns {Object} - Estado y funciones para manejo de nuevo grupo
 */
export const useNuevoGrupoForm = () => {
  const navigate = useNavigate();

  // Función para limpiar y formatear datos
  const formatData = (formData) => {
    return {
      ...formData,
    };
  };

  // Función de envío
  const submitGrupo = async(formData) => {
    const cleanedData = formatData(formData);
    return await createGrupo(cleanedData);
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: nuevoGrupoSchema,
    defaultValues,
    onSubmit: submitGrupo,
    onSuccess: () => navigate(-1),
    successTitle: 'Crear grupo',
    successMessage: 'Se ha creado exitosamente.',
  });

  // Función para cancelar
  const handleCancel = () => {
    form.resetForm();
    navigate(-1);
  };

  return {
    ...form,
    handleCancel,
  };
};
