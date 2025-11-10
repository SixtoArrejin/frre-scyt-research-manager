import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { createDesembolsoByIdVinculacion } from '../../utils/api/vinculacionesApi';
import { useFormHandler } from '../useFormHandler';

// Schema de validación para nuevo desembolso
const nuevoDesembolsoSchema = yup.object({
  fechaDesembolso: yup
    .date()
    .typeError('La fecha debe ser válida')
    .required('La fecha es requerida'),
  plazoEtapa: yup
    .number()
    .typeError('El plazo debe ser un número')
    .required('El plazo es requerido')
    .positive('El plazo debe ser positivo')
    .integer('El plazo debe ser un entero'),
  montoDesembolsado: yup
    .number()
    .typeError('El monto debe ser un número')
    .required('El monto es requerido')
    .positive('El monto debe ser positivo'),
});

// Valores por defecto
const defaultValues = {
  fechaDesembolso: new Date().toISOString().split('T')[0],
  plazoEtapa: null,
  montoDesembolsado: null,
};

/**
 * Hook personalizado para manejo de nuevo desembolso
 * @returns {Object} - Estado y funciones para manejo de nuevo desembolso
 */
export const useNuevoDesembolsoForm = () => {
  const navigate = useNavigate();
  const { idVinculacion } = useParams();

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función de formateo de datos antes de enviar
  const formatData = (formData) => {
    return {
      ...formData,
      idConFinanciamiento: parseInt(idVinculacion),
    };
  };

  // Función de envío
  const submitDesembolso = async(formData) => {
    const cleanedData = formatData(formData);
    console.log('Datos a enviar:', cleanedData);
    return await createDesembolsoByIdVinculacion(cleanedData);
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: nuevoDesembolsoSchema,
    defaultValues,
    onSubmit: submitDesembolso,
    onSuccess: () => navigate(-1),
    successTitle: 'Crear desembolso',
    successMessage: 'Se ha creado el desembolso exitosamente',
  });

  // Funciones de modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Función para cancelar
  const handleCancel = () => {
    form.resetForm();
    navigate(-1);
  };

  return {
    ...form,
    // Modal
    isModalOpen,
    openModal,
    closeModal,

    // Navegación
    handleCancel,
    navigate,

    // Sobrescribir onSubmit para usar el submitHandler del form
    onSubmit: form.submitHandler,
  };
};
