import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as yup from 'yup';
import { getVinculacionById, updateVinculacion } from '../../utils/api/vinculacionesApi';
import { getProyectoById } from '../../utils/api/proyectosApi';
import { useFormHandler } from '../useFormHandler';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';

// Schema de validación para modificar vinculación
const modificarVinculacionSchema = yup.object({
  empresaInstitucion: yup.string().required('La empresa/institución es requerida'),
  idResponsable: yup
    .number()
    .typeError('Debe seleccionar un responsable')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),

  // Campos de vinculación CON financiamiento
  conFinanciamiento: yup.object({
    titulo: yup.string().nullable(),
    nombreBeneficiario: yup.string().nullable(),
    monto: yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
    cantidadDesembolsos: yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
    fechaPresentacion: yup.string().nullable(),
    fechaAdjudicacion: yup.string().nullable(),
    plazoEjecucion: yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
    estado: yup.string().nullable(),
    motivoEstado: yup.string().nullable(),
  }),

  // Campos de vinculación SIN financiamiento
  sinFinanciamiento: yup.object({
    fechaInicio: yup.string().nullable(),
    fechaCierre: yup.string().nullable(),
    descripcion: yup.string().nullable(),
  }),
});

// Valores por defecto
const defaultValues = {
  empresaInstitucion: '',
  idResponsable: '',
  conFinanciamiento: {
    titulo: '',
    nombreBeneficiario: '',
    monto: '',
    cantidadDesembolsos: '',
    fechaPresentacion: '',
    fechaAdjudicacion: '',
    plazoEjecucion: '',
    estado: '',
    motivoEstado: '',
  },
  sinFinanciamiento: {
    fechaInicio: '',
    fechaCierre: '',
    descripcion: '',
  },
};

/**
 * Hook personalizado para manejo de modificación de vinculación
 * @returns {Object} - Estado y funciones para manejo de modificación de vinculación
 */
export const useModificarVinculacionForm = () => {
  const navigate = useNavigate();
  const { idVinculacion } = useParams();

  // Estados locales
  const [financiamiento, setFinanciamiento] = useState(false);
  const [investigadoresOptions, setInvestigadoresOptions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Query para obtener datos de la vinculación
  const { data, isLoading: vinculacionLoading } = useQuery(
    ['vinculacion-mod', idVinculacion],
    () => getVinculacionById(idVinculacion),
    {
      enabled: !!idVinculacion,
    },
  );

  // Query para obtener proyecto y sus investigadores
  const { data: dataProyecto } = useQuery(
    ['proyecto-investigadores', data?.vinculacion?.idProyecto],
    () => getProyectoById(data?.vinculacion?.idProyecto),
    { enabled: !!data?.vinculacion?.idProyecto },
  );

  // Función de formateo de datos antes de enviar
  const formatData = (formData) => {
    return {
      ...formData,
      idResponsable:
        formData.idResponsable && formData.idResponsable !== ''
          ? Number(formData.idResponsable)
          : null,
    };
  };

  // Función de envío
  const submitVinculacion = async(formData) => {
    const cleanedData = formatData(formData);
    console.log('Datos a actualizar:', cleanedData);
    return await updateVinculacion(idVinculacion, cleanedData);
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: modificarVinculacionSchema,
    defaultValues,
    onSubmit: submitVinculacion,
    onSuccess: () => navigate(-1),
    successTitle: 'Modificar vinculación',
    successMessage: 'Se ha modificado la vinculación exitosamente',
  });

  // Determinar si tiene financiamiento
  useEffect(() => {
    if (!data || !data.vinculacion || data.vinculacion.vinculacionesconfinanciamiento == null) {
      setFinanciamiento(false);
    } else {
      setFinanciamiento(true);
    }
  }, [data]);

  // Generar opciones de investigadores del proyecto
  useEffect(() => {
    if (dataProyecto?.proyecto?.participa) {
      const options = dataProyecto.proyecto.participa.map((participacion) => ({
        value: participacion.personas.idPersona,
        label: `${participacion.personas.apellido}, ${participacion.personas.nombre}`,
      }));
      setInvestigadoresOptions(options);
    }
  }, [dataProyecto]);

  // Resetear valores del formulario cuando se carga la vinculación
  useEffect(() => {
    if (data?.vinculacion && form.reset) {
      form.reset({
        empresaInstitucion: data.vinculacion.empresaInstitucion || '',
        idResponsable: data.vinculacion.idResponsable || '',
        conFinanciamiento: {
          titulo: data.vinculacion.vinculacionesconfinanciamiento?.titulo || '',
          nombreBeneficiario: data.vinculacion.vinculacionesconfinanciamiento?.nombreBeneficiario || '',
          monto: data.vinculacion.vinculacionesconfinanciamiento?.monto || '',
          cantidadDesembolsos: data.vinculacion.vinculacionesconfinanciamiento?.cantidadDesembolsos || '',
          fechaPresentacion: formatoFechaISOaAAAAMMDD(data.vinculacion.vinculacionesconfinanciamiento?.fechaPresentacion) || '',
          fechaAdjudicacion: formatoFechaISOaAAAAMMDD(data.vinculacion.vinculacionesconfinanciamiento?.fechaAdjudicacion) || '',
          plazoEjecucion: data.vinculacion.vinculacionesconfinanciamiento?.plazoEjecucion || '',
          estado: data.vinculacion.vinculacionesconfinanciamiento?.estado || '',
          motivoEstado: data.vinculacion.vinculacionesconfinanciamiento?.motivoEstado || '',
        },
        sinFinanciamiento: {
          fechaInicio: formatoFechaISOaAAAAMMDD(data.vinculacion.vinculacionessinfinanciamiento?.fechaInicio) || '',
          fechaCierre: formatoFechaISOaAAAAMMDD(data.vinculacion.vinculacionessinfinanciamiento?.fechaCierre) || '',
          descripcion: data.vinculacion.vinculacionessinfinanciamiento?.descripcion || '',
        },
      });
    }
  }, [data, form.reset]);

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
    // Datos
    vinculacionData: data,
    financiamiento,
    investigadoresOptions,

    // Estados de carga
    isLoading: vinculacionLoading,

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
