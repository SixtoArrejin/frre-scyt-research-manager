import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useFieldArray, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { getAllPersonas } from '../../utils/api/personasApi';
import { getAllRegionales } from '../../utils/api/regionalesApi';
import { getAllTiposProyectos } from '../../utils/api/tiposProyectosApi';
import { createProyecto } from '../../utils/api/proyectosApi';
import { useFormHandler } from '../useFormHandler';

// Schema de validación para el nuevo proyecto
const nuevoProyectoSchema = yup.object({
  codPid: yup.mixed().when('tipo', {
    is: val => val === 'pid',
    then: () => yup.string().required('El código PID es requerido'),
    otherwise: () => yup.string().nullable(),
  }),
  denominacion: yup.string().required('La denominación es requerida'),
  convocatoria: yup
    .number()
    .required('La convocatoria es requerida')
    .typeError('Ingrese un número válido')
    .test('is-valid-number', 'Ingrese un número válido', (value) => {
      return typeof value === 'number' && !isNaN(value);
    }),
  programa: yup.string().required('El programa es requerido'),
  tipoProyecto: yup.string().required('El tipo de proyecto es requerido'),
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
    then: () => yup.string().required('La disposición es requerida').matches(/^\d+\/\d+$/, 'El formato de la disposición debe ser \'###/###\''),
    otherwise: () => yup.string().nullable(),
  }),
  nuevaFechaFin: yup.mixed().when(['tipo', 'prorrogado'], {
    is: (tipo, prorrogado) => tipo === 'pid' && prorrogado === 'true',
    then: () => yup.string().required('La nueva fecha de finalización es requerida'),
    otherwise: () => yup.string().nullable(),
  }),
  nuevaDisposicion: yup.mixed().when(['tipo', 'prorrogado'], {
    is: (tipo, prorrogado) => tipo === 'pid' && prorrogado === 'true',
    then: () => yup.string().required('La nueva disposición es requerida').matches(/^\d+\/\d+$/, 'El formato de la disposición debe ser \'###/###\''),
    otherwise: () => yup.string().nullable(),
  }),
});

// Valores por defecto del formulario
const defaultValues = {
  tipoActividad: '',
  fechaInicio: undefined,
  fechaFin: undefined,
  denominacion: '',
  completo: false,
  regional: 'Facultad Regional Resistencia',
  convocatoria: undefined,
  estado: undefined,
  idDirector: undefined,
  idCodirector: undefined,
  tipoProyecto: '',
  prorrogado: 'false',
  nuevaFechaFin: undefined,
  nuevaDisposicion: undefined,
  codPid: '',
  programa: '',
  disposicion: undefined,
  tipo: 'pid',
  empresaInstitucion: '',
  regionales: [],
  investigadores: [],
  grupos: [],
};

// Constantes
export const tipoActividad = [
  'Desarrollo Experimental',
  'Investigación Aplicada',
  'Investigación Básica',
];

export const estadoProyecto = [
  'EN TRÁMITE',
  'HOMOLOGADO',
  'REFORMULAR POR EVALUACIÓN EXTERNA',
  'REFORMULAR POR CONSEJO DE PROGRAMAS',
  'DENEGADO POR EVALUACIÓN EXTERNA',
  'DENEGADO POR CONSEJO DE PROGRAMAS',
  'CANCELADO',
];

export const roles = [
  'Director',
  'CoDirector',
  'Investigador',
  'Becario',
  'Asesor Cientifico',
  'Técnico de Apoyo',
];

export const tipoProyectosConRegionales = [
  'Integrador Asociado (PID IA) con Incentivo',
  'Integrador Asociado (PID IA) sin Incentivo',
  'Inter-institucional (PID IN) con Incentivos',
  'Inter-institucional (PID IN) sin Incentivos',
  'PID Tecnología Educativa Multifacultad con Incentivos (PIDA)',
  'PID Tecnología Educativa Multifacultad sin Incentivos (PIDA)',
  'Tutorado con Incentivo',
  'Tutorado sin Incentivo',
];

/**
 * Hook personalizado para manejo de nuevo proyecto
 * @returns {Object} - Estado y funciones para manejo de nuevo proyecto
 */
export const useNuevoProyectoForm = () => {
  const navigate = useNavigate();

  // Estados locales
  const [investigadores, setInvestigadores] = useState([]);
  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] = useState([]);
  const [regionalesSeleccionados, setRegionalesSeleccionados] = useState([]);
  const [investigadoresDelGrupo, setInvestigadoresDelGrupo] = useState([]);
  const [selectedTipoProyecto, setSelectedTipoProyecto] = useState('');
  const [estado, setEstado] = useState('');

  // Estados para selects
  const [selectedOptions, setSelectedOptions] = useState();
  const [selectedOptionsGrupos, setSelectedOptionsGrupos] = useState();
  const [selectedOptionsRegionales, setSelectedOptionsRegionales] = useState();
  const [rolSelected, setRolSelected] = useState();
  const [fechaSelected, setFechaSelected] = useState();

  // Queries para obtener datos
  const { data: dataGrupos } = useQuery('grupos', () => getAllGrupos());
  const { data: dataRegionales } = useQuery(['regionales'], () => getAllRegionales());
  const { data: dataTiposProyectos, isLoading: isLoadingGetTiposProyectos } = useQuery(
    ['tiposProyectos'],
    () => getAllTiposProyectos(),
  );
  const { data: dataInvestigadores } = useQuery(['investigadoresNewPID'], () => getAllPersonas());

  // Configuración del formulario
  const form = useFormHandler({
    schema: nuevoProyectoSchema,
    defaultValues,
    onSubmit: async(formData) => {
      // Convierte el valor de 'prorroga' a booleano antes de enviar
      const modifiedValues = {
        ...formData,
        prorrogado: formData.prorrogado === 'true',
      };
      return await createProyecto(modifiedValues);
    },
    onSuccess: () => navigate(-1),
    successTitle: 'Nuevo Proyecto',
    successMessage: 'Se ha creado el nuevo proyecto exitosamente',
  });

  // Field arrays para manejo de listas
  const { fields: investigadoresFields, append: appendInvestigador, remove: removeInvestigador } = useFieldArray({
    control: form.control,
    name: 'investigadores',
  });

  const { append: appendGrupo, remove: removeGrupo } = useFieldArray({
    control: form.control,
    name: 'grupos',
  });

  const { append: appendRegional, remove: removeRegional } = useFieldArray({
    control: form.control,
    name: 'regionales',
  });

  // Watch para campos condicionales
  const tipoProyecto = useWatch({ control: form.control, name: 'tipo' });
  const prorrogado = useWatch({ control: form.control, name: 'prorrogado' });

  // Efectos
  useEffect(() => {
    setInvestigadores(dataInvestigadores?.personas);
  }, [dataInvestigadores]);

  // Limpiar errores de campos ocultos cuando cambia el tipo de proyecto
  useEffect(() => {
    if (tipoProyecto === 'externo') {
      // Limpiar errores de campos específicos de PID
      form.clearErrors(['codPid', 'tipoActividad', 'estado', 'disposicion', 'nuevaFechaFin', 'nuevaDisposicion']);
      // Resetear valores de campos PID para evitar validaciones
      form.setValue('codPid', '');
      form.setValue('tipoActividad', '');
      form.setValue('estado', '');
      form.setValue('disposicion', '');
      form.setValue('nuevaFechaFin', '');
      form.setValue('nuevaDisposicion', '');
      form.setValue('prorrogado', 'false');
      // Limpiar estado local
      setEstado('');
    } else if (tipoProyecto === 'pid') {
      // Limpiar errores de campos específicos de Externo
      form.clearErrors(['empresaInstitucion']);
      // Resetear valores de campos externos
      form.setValue('empresaInstitucion', '');
    }
  }, [tipoProyecto, form.clearErrors, form.setValue]);

  // Datos procesados
  const grupos = dataGrupos?.grupos;
  const sortedInvestigadores = investigadoresDelGrupo?.sort((a, b) => {
    const apellidoA = a.apellido.toLowerCase();
    const apellidoB = b.apellido.toLowerCase();
    return apellidoA.localeCompare(apellidoB);
  });

  // Funciones de manejo
  const handleTipoProyectoChange = (e) => {
    const value = e.target.value;
    setSelectedTipoProyecto(value);
  };

  const agregarInvestigador = () => {
    if (!selectedOptions || !rolSelected || !fechaSelected) return;

    const objetoBuscado = sortedInvestigadores.find(
      (item) => item.idPersona == selectedOptions,
    );

    const objetoAgregar = {
      idPersona: objetoBuscado.idPersona,
      rol: rolSelected,
      persona: objetoBuscado,
      fechaInicio: fechaSelected,
    };

    // Verificar si el objeto ya está agregado
    const objetoYaAgregado = investigadoresSeleccionados.find(
      (item) => item.idPersona == selectedOptions,
    );

    if (!objetoYaAgregado) {
      appendInvestigador(objetoAgregar);
      setInvestigadoresSeleccionados([
        ...investigadoresSeleccionados,
        objetoBuscado,
      ]);
    }
  };

  const agregarGrupo = () => {
    if (!selectedOptionsGrupos) return;

    const objetoBuscado = grupos.find(
      (item) => item.idGrupoInvestigacion == selectedOptionsGrupos,
    );

    const objetoAgregar = {
      idGrupoInvestigacion: objetoBuscado.idGrupoInvestigacion,
    };

    // Verificar si el objeto ya está agregado
    const objetoYaAgregado = gruposSeleccionados.find(
      (item) => item.idGrupoInvestigacion == selectedOptionsGrupos,
    );

    if (!objetoYaAgregado) {
      appendGrupo(objetoAgregar);
      setGruposSeleccionados([...gruposSeleccionados, objetoBuscado]);

      // Actualizar investigadores del grupo
      const investigadoresGrupo = investigadores.filter(
        (investigador) =>
          investigador.idGrupoInvestigacion === objetoBuscado.idGrupoInvestigacion,
      );
      setInvestigadoresDelGrupo([
        ...investigadoresDelGrupo,
        ...investigadoresGrupo,
      ]);
    }
  };

  const agregarRegional = () => {
    if (!selectedOptionsRegionales) return;

    // Verificar si el objeto ya está agregado
    const objetoYaAgregado = regionalesSeleccionados.find(
      (item) => item == selectedOptionsRegionales,
    );

    if (!objetoYaAgregado) {
      appendRegional(selectedOptionsRegionales);
      setRegionalesSeleccionados([
        ...regionalesSeleccionados,
        selectedOptionsRegionales,
      ]);
    }
  };

  const eliminarInvestigador = (idAEliminar, index) => {
    const nuevosInvestigadores = investigadoresSeleccionados.filter(
      (item) => item.idPersona !== idAEliminar,
    );
    removeInvestigador(index);
    setInvestigadoresSeleccionados(nuevosInvestigadores);
  };

  const eliminarGrupo = (idAEliminar, index) => {
    const nuevosGrupos = gruposSeleccionados.filter(
      (item) => item.idGrupoInvestigacion !== idAEliminar,
    );

    const investigadoresRestantes = investigadoresDelGrupo.filter(
      (investigador) => investigador.idGrupoInvestigacion !== idAEliminar,
    );

    removeGrupo(index);
    setInvestigadoresDelGrupo(investigadoresRestantes);
    setGruposSeleccionados(nuevosGrupos);
  };

  const eliminarRegional = (itemEliminar, index) => {
    const nuevasRegionales = regionalesSeleccionados.filter(
      (item) => item !== itemEliminar,
    );
    removeRegional(index);
    setRegionalesSeleccionados(nuevasRegionales);
  };

  const handleCancel = () => {
    form.resetForm();
    navigate(-1);
  };

  return {
    // Form state
    ...form,
    trigger: form.trigger,

    // Data
    grupos,
    dataRegionales,
    dataTiposProyectos,
    isLoadingGetTiposProyectos,
    investigadoresFields,
    sortedInvestigadores,
    gruposSeleccionados,
    regionalesSeleccionados,

    // Watched values
    tipoProyecto,
    prorrogado,
    selectedTipoProyecto,
    estado,

    // Selection states
    selectedOptions,
    setSelectedOptions,
    selectedOptionsGrupos,
    setSelectedOptionsGrupos,
    selectedOptionsRegionales,
    setSelectedOptionsRegionales,
    rolSelected,
    setRolSelected,
    fechaSelected,
    setFechaSelected,

    // Handlers
    handleCancel,
    handleTipoProyectoChange,
    setEstado,
    agregarInvestigador,
    agregarGrupo,
    agregarRegional,
    eliminarInvestigador,
    eliminarGrupo,
    eliminarRegional,
  };
};
