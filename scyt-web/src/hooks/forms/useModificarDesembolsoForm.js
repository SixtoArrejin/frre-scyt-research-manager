import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { getDesembolsoById, putDesembolsoById } from '../../utils/api/vinculacionesApi';
import { useFormHandler } from '../useFormHandler';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';

// Constantes
export const estadosDesembolso = ['Rendido', 'En ejecución', 'En ejecución - Fuera de plazo'];

// Schema de validación para modificar desembolso
const modificarDesembolsoSchema = yup.object({
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
  fechaAprobado: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  fechaDeRendicionReal: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  montoRendido: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value))
    .positive('El monto rendido debe ser positivo'),
  estado: yup.string().nullable(),
  motivoEstado: yup.string().nullable(),
});

// Valores por defecto
const defaultValues = {
  fechaDesembolso: '',
  plazoEtapa: null,
  montoDesembolsado: null,
  fechaAprobado: '',
  fechaDeRendicionReal: '',
  montoRendido: null,
  estado: '',
  motivoEstado: '',
};

/**
 * Hook personalizado para manejo de modificación de desembolso
 * @returns {Object} - Estado y funciones para manejo de modificación de desembolso
 */
export const useModificarDesembolsoForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { idDesembolso } = useParams();

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Query para obtener datos del desembolso
  const { data: dataDesembolso, isLoading: desembolsoLoading } = useQuery(
    ['desembolso', idDesembolso],
    () => getDesembolsoById(idDesembolso),
    {
      enabled: !!idDesembolso,
    },
  );

  // Función de envío
  const submitDesembolso = async(formData) => {
    const result = await putDesembolsoById(parseInt(idDesembolso), formData);
    // Invalidar query para refrescar datos
    queryClient.invalidateQueries(['desembolso', idDesembolso]);
    return result;
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: modificarDesembolsoSchema,
    defaultValues,
    onSubmit: submitDesembolso,
    onSuccess: () => navigate(-1),
    successTitle: 'Desembolso modificado',
    successMessage: 'Se ha modificado el desembolso exitosamente',
  });

  // Resetear valores del formulario cuando se carga el desembolso
  useEffect(() => {
    if (dataDesembolso?.desembolso && form.reset) {
      form.reset({
        fechaDesembolso: formatoFechaISOaAAAAMMDD(dataDesembolso.desembolso.fechaDesembolso) || '',
        plazoEtapa: dataDesembolso.desembolso.plazoEtapa || null,
        montoDesembolsado: dataDesembolso.desembolso.montoDesembolsado || null,
        fechaAprobado: formatoFechaISOaAAAAMMDD(dataDesembolso.desembolso.fechaAprobado) || '',
        fechaDeRendicionReal: formatoFechaISOaAAAAMMDD(dataDesembolso.desembolso.fechaDeRendicionReal) || '',
        montoRendido: dataDesembolso.desembolso.montoRendido || null,
        estado: dataDesembolso.desembolso.estado || '',
        motivoEstado: dataDesembolso.desembolso.motivoEstado || '',
      });
    }
  }, [dataDesembolso, form.reset]);

  // Funciones de modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Función para cancelar
  const handleCancel = () => {
    form.resetForm();
    navigate(-1);
  };

  // Opciones para el select de estado
  const estadosOptions = estadosDesembolso.map((estado) => ({
    value: estado,
    label: estado,
  }));

  return {
    ...form,
    // Datos
    desembolsoData: dataDesembolso,

    // Estados de carga
    isLoading: desembolsoLoading,

    // Modal
    isModalOpen,
    openModal,
    closeModal,

    // Opciones
    estadosOptions,

    // Navegación
    handleCancel,
    navigate,

    // Sobrescribir onSubmit para usar el submitHandler del form
    onSubmit: form.submitHandler,
  };
};
