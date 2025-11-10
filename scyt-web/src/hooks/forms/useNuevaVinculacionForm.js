import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useToast } from '@chakra-ui/react';
import { useFieldArray, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { createVinculacion, getProyectoById } from '../../utils/api/proyectosApi';
import { useFormHandler } from '../useFormHandler';

// Constantes
export const tiposConvenio = ['Marco', 'Especifico', 'Colaboración', 'Otro...'];

// Schema de validación para nueva vinculación
const nuevaVinculacionSchema = yup.object({
  empresaInstitucion: yup.string().required('La empresa/institución es requerida'),
  idResponsable: yup
    .number()
    .typeError('Debe seleccionar un responsable')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  financiamiento: yup.string().required('Debe seleccionar el tipo de financiamiento'),

  // Campos condicionales para vinculación CON financiamiento
  titulo: yup.mixed().when('financiamiento', {
    is: val => val === 'true',
    then: () => yup.string().required('El título es requerido'),
    otherwise: () => yup.string().nullable(),
  }),
  beneficiario: yup.mixed().when('financiamiento', {
    is: val => val === 'true',
    then: () => yup.string().required('El nombre del beneficiario es requerido'),
    otherwise: () => yup.string().nullable(),
  }),
  monto: yup.mixed().when('financiamiento', {
    is: val => val === 'true',
    then: () => yup
      .number()
      .typeError('El monto debe ser un número')
      .required('El monto es requerido')
      .positive('El monto debe ser positivo')
      .transform((value, originalValue) => (originalValue === '' ? undefined : value)),
    otherwise: () => yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
  }),
  desembolsos: yup.mixed().when('financiamiento', {
    is: val => val === 'true',
    then: () => yup
      .number()
      .typeError('La cantidad de desembolsos debe ser un número')
      .required('La cantidad de desembolsos es requerida')
      .positive('La cantidad de desembolsos debe ser positiva')
      .integer('La cantidad de desembolsos debe ser un entero')
      .transform((value, originalValue) => (originalValue === '' ? undefined : value)),
    otherwise: () => yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
  }),
  presentacion: yup.mixed().when('financiamiento', {
    is: val => val === 'true',
    then: () => yup.string().required('La fecha de presentación es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
  adjudicacion: yup.mixed().when('financiamiento', {
    is: val => val === 'true',
    then: () => yup.string().nullable(),
    otherwise: () => yup.string().nullable(),
  }),
  plazoEjecucion: yup.mixed().when('financiamiento', {
    is: val => val === 'true',
    then: () => yup
      .number()
      .typeError('El plazo de ejecución debe ser un número')
      .required('El plazo de ejecución es requerido')
      .positive('El plazo de ejecución debe ser positivo')
      .integer('El plazo de ejecución debe ser un entero')
      .transform((value, originalValue) => (originalValue === '' ? undefined : value)),
    otherwise: () => yup
      .number()
      .nullable()
      .transform((value, originalValue) => (originalValue === '' ? null : value)),
  }),

  // Campos condicionales para vinculación SIN financiamiento
  fechaInicio: yup.mixed().when('financiamiento', {
    is: val => val === 'false',
    then: () => yup.string().required('La fecha de inicio es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
  fechaCierre: yup.mixed().when('financiamiento', {
    is: val => val === 'false',
    then: () => yup.string().required('La fecha de cierre es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
  descripcion: yup.mixed().when('financiamiento', {
    is: val => val === 'false',
    then: () => yup.string().required('La descripción es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
});

// Valores por defecto
const defaultValues = {
  empresaInstitucion: '',
  idResponsable: '',
  financiamiento: 'false',
  convenios: [],
  // Con financiamiento
  titulo: '',
  beneficiario: '',
  monto: '',
  desembolsos: '',
  presentacion: '',
  adjudicacion: '',
  plazoEjecucion: '',
  // Sin financiamiento
  fechaInicio: '',
  fechaCierre: '',
  descripcion: '',
};

/**
 * Hook personalizado para manejo de nueva vinculación
 * @returns {Object} - Estado y funciones para manejo de nueva vinculación
 */
export const useNuevaVinculacionForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { idPid } = useParams();

  // Estados locales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investigadoresOptions, setInvestigadoresOptions] = useState([]);
  const [selectedConvenio, setSelectedConvenio] = useState('Marco');
  const [nroConvenio, setNroConvenio] = useState('');

  // Configuración del formulario
  const form = useFormHandler({
    schema: nuevaVinculacionSchema,
    defaultValues,
  });

  const { register, handleSubmit, formState: { errors }, control } = form;

  // FieldArray para convenios
  const {
    fields: convenios,
    append: appendConvenio,
    remove: removeConvenio,
  } = useFieldArray({
    control,
    name: 'convenios',
  });

  // Watch para campos condicionales
  const tipoFinanciamiento = useWatch({ control, name: 'financiamiento' });

  // Query para obtener proyecto y sus investigadores
  const { data: dataProyecto } = useQuery(
    ['proyecto-investigadores', idPid],
    () => getProyectoById(idPid),
    { enabled: !!idPid },
  );

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

  // Limpiar errores de campos ocultos cuando cambia el tipo de financiamiento
  useEffect(() => {
    if (tipoFinanciamiento === 'false') {
      // Limpiar errores de campos CON financiamiento
      form.clearErrors([
        'titulo',
        'beneficiario',
        'monto',
        'desembolsos',
        'presentacion',
        'adjudicacion',
        'plazoEjecucion',
      ]);
      // Resetear valores de campos con financiamiento
      // Campos de texto a string vacío
      form.setValue('titulo', '', { shouldValidate: false });
      form.setValue('beneficiario', '', { shouldValidate: false });
      form.setValue('presentacion', '', { shouldValidate: false });
      form.setValue('adjudicacion', '', { shouldValidate: false });
      // Campos numéricos a undefined para evitar NaN
      form.setValue('monto', undefined, { shouldValidate: false });
      form.setValue('desembolsos', undefined, { shouldValidate: false });
      form.setValue('plazoEjecucion', undefined, { shouldValidate: false });
    } else if (tipoFinanciamiento === 'true') {
      // Limpiar errores de campos SIN financiamiento
      form.clearErrors(['fechaInicio', 'fechaCierre', 'descripcion']);
      // Resetear valores de campos sin financiamiento
      form.setValue('fechaInicio', '', { shouldValidate: false });
      form.setValue('fechaCierre', '', { shouldValidate: false });
      form.setValue('descripcion', '', { shouldValidate: false });
    }
  }, [tipoFinanciamiento, form]);

  // Mutation para crear vinculación
  const { mutate: createVinculacionMutation, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => createVinculacion(idPid, formData),
    onSuccess: () => {
      toast({
        title: 'Nueva Vinculación',
        description: 'Se ha creado la nueva vinculación exitosamente',
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: (error) => {
      const errorMessage = error?.message;
      toast({
        title: 'Error al crear la vinculación',
        description: `${errorMessage || 'Intente nuevamente'}`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  // Funciones para manejar convenios
  const agregarConvenio = () => {
    // Validar que ambos campos estén completos
    if (!selectedConvenio || selectedConvenio.trim() === '') {
      toast({
        title: 'Tipo de convenio requerido',
        description: 'Debe seleccionar un tipo de convenio',
        status: 'warning',
        isClosable: true,
      });
      return;
    }

    if (!nroConvenio || nroConvenio.trim() === '') {
      toast({
        title: 'Número de convenio requerido',
        description: 'Debe ingresar el número de convenio',
        status: 'warning',
        isClosable: true,
      });
      return;
    }

    // Verificar si ya existe un convenio con el mismo tipo y número
    const convenioExistente = convenios.find(
      (convenio) =>
        convenio.tipoConvenio === selectedConvenio &&
        convenio.nroConvenio === nroConvenio,
    );

    if (convenioExistente) {
      toast({
        title: 'Este convenio ya fue agregado',
        status: 'info',
        isClosable: true,
      });
    } else {
      // Agregar el nuevo convenio al array
      appendConvenio({ tipoConvenio: selectedConvenio, nroConvenio: nroConvenio });
      // Limpiar los campos después de agregar
      setSelectedConvenio('Marco');
      setNroConvenio('');
      toast({
        title: 'Convenio agregado',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const eliminarConvenio = (index) => {
    removeConvenio(index);
  };

  // Función de envío del formulario
  const onSubmit = (values) => {
    const modifiedValues = {
      ...values,
      financiamiento: values.financiamiento === 'true',
      idResponsable:
        values.idResponsable && values.idResponsable !== ''
          ? Number(values.idResponsable)
          : null,
    };
    console.log('Datos a enviar:', modifiedValues);
    createVinculacionMutation(modifiedValues);
  };

  // Funciones de modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Función para cancelar
  const handleCancel = () => {
    navigate(-1);
  };

  return {
    // Formulario
    register,
    handleSubmit,
    errors,
    control,
    onSubmit,

    // Estados
    isModalOpen,
    investigadoresOptions,
    selectedConvenio,
    setSelectedConvenio,
    nroConvenio,
    setNroConvenio,

    // Convenios
    convenios,
    agregarConvenio,
    eliminarConvenio,

    // Watched values
    tipoFinanciamiento,

    // Loading
    isLoadingMutation,

    // Funciones de modal
    openModal,
    closeModal,

    // Navegación
    handleCancel,
  };
};
