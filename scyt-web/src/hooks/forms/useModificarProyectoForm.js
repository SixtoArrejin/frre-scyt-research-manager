import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useToast } from '@chakra-ui/react';
import * as yup from 'yup';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';
import { getProyectoById, updateProyecto } from '../../utils/api/proyectosApi';
import { getAllTiposProyectos } from '../../utils/api/tiposProyectosApi';
import { getAllRegionales } from '../../utils/api/regionalesApi';
import { useFormHandler } from '../useFormHandler';

const tipoActividad = [
  'Desarrollo Experimental',
  'Investigación Aplicada',
  'Investigación Básica',
];

const estadoProyecto = [
  'EN TRÁMITE',
  'HOMOLOGADO',
  'REFORMULAR POR EVALUACIÓN EXTERNA',
  'REFORMULAR POR CONSEJO DE PROGRAMAS',
  'DENEGADO POR EVALUACIÓN EXTERNA',
  'DENEGADO POR CONSEJO DE PROGRAMAS',
  'CANCELADO',
];

// Schema de validación para modificar proyecto
const modificarProyectoSchema = yup.object({
  tipo: yup.string().oneOf(['pid', 'externo']).required('El tipo de proyecto es requerido'),
  codPid: yup.mixed().when('tipo', {
    is: val => val === 'pid',
    then: () => yup.string().required('El código PID es requerido'),
    otherwise: () => yup.string().nullable(),
  }),
  denominacion: yup.string().required('La denominación es requerida'),
  fechaInicio: yup.string().nullable().notRequired(),
  fechaFin: yup.string().nullable().notRequired(),
  programa: yup.string().required('El programa es requerido'),
  tipoProyecto: yup.mixed().when('tipo', {
    is: val => val === 'pid',
    then: () => yup.string().required('El tipo de proyecto es requerido'),
    otherwise: () => yup.string().nullable().notRequired(),
  }),
  trl: yup.string().nullable().notRequired(),
  descripcionBreve: yup.string().nullable().notRequired(),
  regional: yup.string().required('La regional es requerida'),
  convocatoria: yup.number()
    .typeError('La convocatoria debe ser un número')
    .required('La convocatoria es requerida')
    .positive('La convocatoria debe ser un número positivo')
    .integer('La convocatoria debe ser un número entero'),
  empresaInstitucion: yup.mixed().when('tipo', {
    is: val => val === 'externo',
    then: () => yup.string().required('La empresa/institución es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
  // Campos específicos de PID
  tipoActividad: yup.mixed().when('tipo', {
    is: val => val === 'pid',
    then: () => yup.string().required('El tipo de actividad es requerido'),
    otherwise: () => yup.string().nullable(),
  }),
  estado: yup.mixed().when('tipo', {
    is: val => val === 'pid',
    then: () => yup.string().required('El estado es requerido'),
    otherwise: () => yup.string().nullable(),
  }),
  disposicion: yup.mixed().when(['tipo', 'estado'], {
    is: (tipo, estado) => tipo === 'pid' && estado === 'HOMOLOGADO',
    then: () => yup.string().required('La disposición es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
  prorrogado: yup.mixed().when('tipo', {
    is: val => val === 'pid',
    then: () => yup.string().required('Debe indicar si tiene prórroga'),
    otherwise: () => yup.string().nullable(),
  }),
  completo: yup.mixed().when('tipo', {
    is: val => val === 'pid',
    then: () => yup.string().required('Debe indicar si está completo'),
    otherwise: () => yup.string().nullable(),
  }),
  nuevaFechaFin: yup.mixed().when(['tipo', 'prorrogado'], {
    is: (tipo, prorrogado) => tipo === 'pid' && prorrogado === 'true',
    then: () => yup.string().required('La nueva fecha fin es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
  nuevaDisposicion: yup.mixed().when(['tipo', 'estado', 'prorrogado'], {
    is: (tipo, estado, prorrogado) => tipo === 'pid' && estado === 'HOMOLOGADO' && prorrogado === 'true',
    then: () => yup.string().required('La nueva disposición es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
});

export const tipoProyectosInterinstitucionales = [
  'Inter-institucional (PID IN) con Incentivos',
  'Inter-institucional (PID IN) sin Incentivos',
  'PID Interfacultad',
  'PID Tecnología Educativa Multifacultad con Incentivos (PIDA)',
  'PID Tecnología Educativa Multifacultad sin Incentivos (PIDA)',
];

export const useModificarProyectoForm = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { idPid } = useParams();

  // Estados locales
  const [estado, setEstado] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [institucionesSeleccionadas, setInstitucionesSeleccionadas] = useState([]);
  const [selectedInstitucion, setSelectedInstitucion] = useState('');
  const [otraInstitucion, setOtraInstitucion] = useState('');
  const [selectedTipoProyecto, setSelectedTipoProyecto] = useState('');

  // Ref para controlar si ya se llenó el formulario
  const hasFilledForm = useRef(false);

  // Queries
  const {
    data: dataProyecto,
    isLoading: isLoadingProyecto,
  } = useQuery(['proyecto', idPid], () => getProyectoById(Number(idPid)));

  const {
    data: dataRegionales,
    isLoading: isLoadingRegionales,
  } = useQuery(['regionales'], () => getAllRegionales());

  const {
    data: dataTiposProyectos,
    isLoading: isLoadingTiposProyectos,
  } = useQuery(['tiposProyectos'], () => getAllTiposProyectos());

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useFormHandler({
    schema: modificarProyectoSchema,
    defaultValues: {
      codPid: '',
      tipo: 'pid',
      denominacion: '',
      descripcionBreve: '',
      trl: '',
      fechaInicio: '',
      fechaFin: '',
      programa: '',
      tipoProyecto: '',
      regional: '',
      convocatoria: 0,
      empresaInstitucion: '',
      tipoActividad: '',
      estado: '',
      disposicion: '',
      prorrogado: 'false',
      completo: 'false',
      nuevaFechaFin: '',
      nuevaDisposicion: '',
    },
  });

  // Determinar si es PID de forma reactiva según el tipo seleccionado
  const tipoForm = watch('tipo');
  const esPid = tipoForm === 'pid';

  const queryClient = useQueryClient();

  // Mutation
  const { mutate: updateProyectoMutation, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updateProyecto(Number(idPid), formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['proyecto', Number(idPid)]);
      queryClient.invalidateQueries(['proyecto', String(idPid)]);
      queryClient.refetchQueries(['proyecto', Number(idPid)]);
      queryClient.refetchQueries(['proyecto', String(idPid)]);
      queryClient.invalidateQueries('proyectos');
      toast({
        title: 'Modificar Proyecto',
        description: 'Se ha modificado el proyecto exitosamente',
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al modificar los datos del proyecto',
        description: 'Intente de nuevo.',
        status: 'error',
        isClosable: true,
      });
    },
  });

  // Efecto para resetear el flag cuando cambia el ID del proyecto
  useEffect(() => {
    hasFilledForm.current = false;
  }, [idPid]);

  // Efecto para llenar el formulario cuando se cargan los datos (solo una vez)
  useEffect(() => {
    if (dataProyecto?.proyecto && setValue && !hasFilledForm.current) {
      const proyecto = dataProyecto.proyecto;

      // Campos básicos
      setValue('codPid', proyecto.codPid || '');
      setValue('denominacion', proyecto.denominacion || '');
      setValue('descripcionBreve', proyecto.descripcionBreve || '');
      setValue('trl', proyecto.trl || '');
      setValue('programa', proyecto.programa || '');
      setValue('convocatoria', proyecto.convocatoria || 0);
      setValue('empresaInstitucion', proyecto.empresaInstitucion || '');

      // Campos de select que pueden tener problemas de inicialización
      setValue('tipoProyecto', proyecto.tipoProyecto || '');
      setValue('regional', proyecto.regional || '');
      setValue('tipoActividad', proyecto.tipoActividad || '');
      setValue('estado', proyecto.estado || '');

      // Campos de radio/boolean
      setValue('completo', proyecto.completo ? 'true' : 'false');
      setValue('prorrogado', proyecto.prorrogado ? 'true' : 'false');

      // Campo tipo calculado
      setValue('tipo', proyecto.codPid ? 'pid' : 'externo');

      // Campos condicionales
      setValue('disposicion', proyecto.disposicion || '');
      setValue('nuevaDisposicion', proyecto.nuevaDisposicion || '');

      // Fechas con formato
      if (proyecto.fechaInicio) {
        setValue('fechaInicio', formatoFechaISOaAAAAMMDD(proyecto.fechaInicio));
      }
      if (proyecto.fechaFin) {
        setValue('fechaFin', formatoFechaISOaAAAAMMDD(proyecto.fechaFin));
      }
      if (proyecto.nuevaFechaFin) {
        setValue('nuevaFechaFin', formatoFechaISOaAAAAMMDD(proyecto.nuevaFechaFin));
      }

      // Instituciones asociadas existentes
      if (proyecto.institucionesAsociadas) {
        setInstitucionesSeleccionadas(proyecto.institucionesAsociadas.map((i) => i.nombreInstitucion));
      }

      // Actualizar estado local para condicionales
      setEstado(proyecto.estado || '');
      setSelectedTipoProyecto(proyecto.tipoProyecto || '');

      // Marcar como llenado para evitar re-llenados
      hasFilledForm.current = true;
    }
  }, [dataProyecto, setValue]);

  // Manejo del cambio de tipo de proyecto
  const handleTipoProyectoChange = (e) => {
    const val = e.target.value;
    setValue('tipoProyecto', val, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    setSelectedTipoProyecto(val);
  };

  // Manejo de instituciones asociadas
  const agregarInstitucion = () => {
    let nombreInstitucion = '';
    if (selectedInstitucion === 'Otro') {
      if (!otraInstitucion || otraInstitucion.trim() === '') {
        return;
      }
      nombreInstitucion = otraInstitucion.trim();
    } else {
      if (!selectedInstitucion || selectedInstitucion === '') {
        return;
      }
      nombreInstitucion = selectedInstitucion;
    }

    const yaExiste = institucionesSeleccionadas.some(
      (inst) => inst.toLowerCase() === nombreInstitucion.toLowerCase(),
    );
    if (!yaExiste) {
      setInstitucionesSeleccionadas([...institucionesSeleccionadas, nombreInstitucion]);
      setSelectedInstitucion('');
      setOtraInstitucion('');
    }
  };

  const eliminarInstitucion = (itemEliminar) => {
    setInstitucionesSeleccionadas(institucionesSeleccionadas.filter((i) => i !== itemEliminar));
  };

  // Función de envío del formulario
  const onSubmit = (values) => {
    const modifiedValues = {
      ...values,
      // Convertir campos booleanos
      prorrogado: values.prorrogado === 'true',
      completo: values.completo === 'true',
      // Convertir campos numéricos
      convocatoria: parseInt(values.convocatoria, 10),
      // Instituciones asociadas
      instituciones: institucionesSeleccionadas,
    };

    if (values.tipo === 'externo') {
      modifiedValues.codPid = null;
      modifiedValues.tipoActividad = null;
      modifiedValues.estado = null;
      modifiedValues.disposicion = null;
      modifiedValues.prorrogado = false;
      modifiedValues.completo = false;
      modifiedValues.nuevaDisposicion = null;
      modifiedValues.nuevaFechaFin = null;
    } else if (values.tipo === 'pid') {
      modifiedValues.empresaInstitucion = null;
    }

    const proyectoData = {
      proyecto: modifiedValues,
    };

    console.log(proyectoData);
    updateProyectoMutation(proyectoData);
  };

  // Funciones de modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Función para cancelar
  const handleCancel = () => {
    reset();
    hasFilledForm.current = false;
    navigate(-1);
  };

  // Opciones para selects
  const regionalesOptions = (isLoadingRegionales ? ['Cargando...'] : dataRegionales?.regionales || [])
    .map((regional) => ({
      value: regional,
      label: regional,
    }));

  const tiposProyectoOptions = (isLoadingTiposProyectos ? ['Cargando...'] : dataTiposProyectos?.tiposProyectos || [])
    .map((tipo) => ({
      value: tipo,
      label: tipo,
    }));

  const tipoActividadOptions = tipoActividad.map((actividad) => ({
    value: actividad,
    label: actividad,
  }));

  const estadoProyectoOptions = estadoProyecto.map((estado) => ({
    value: estado,
    label: estado,
  }));

  return {
    // Datos del proyecto
    dataProyecto,
    esPid,

    // Estados
    estado,
    setEstado,
    isModalOpen,

    // Formulario
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    onSubmit,

    // Loading states
    isLoading: isLoadingProyecto,
    isLoadingMutation,

    // Opciones para selects
    regionalesOptions,
    tiposProyectoOptions,
    tipoActividadOptions,
    estadoProyectoOptions,
    dataRegionales,

    // Instituciones asociadas
    selectedTipoProyecto,
    handleTipoProyectoChange,
    institucionesSeleccionadas,
    selectedInstitucion,
    setSelectedInstitucion,
    otraInstitucion,
    setOtraInstitucion,
    agregarInstitucion,
    eliminarInstitucion,

    // Funciones de modal
    openModal,
    closeModal,

    // Funciones de navegación
    navigate,
    handleCancel,
  };
};
