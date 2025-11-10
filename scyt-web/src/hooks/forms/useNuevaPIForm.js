import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useToast } from '@chakra-ui/react';
import * as yup from 'yup';
import { createPropiedadIntelectualByProyectoId, getProyectoById } from '../../utils/api/proyectosApi';
import { useFormHandler } from '../useFormHandler';
import { getAllPersonas } from '../../utils/api/personasApi';

// Constantes
export const tiposPropiedadIntelectual = [
  'Derecho de Autor',
  'Modelo de Utilidad',
  'Modelo Industrial',
  'Patente',
  'Otros',
];

// Schema de validación para nueva PI
const nuevaPISchema = yup.object({
  tipoPI: yup.string().required('El tipo de PI es requerido'),
  numeroExpediente: yup.string().nullable(),
  fechaInicio: yup.string().nullable(),
  fechaCierre: yup.string().nullable(),
  descripcion: yup.string().nullable(),
});

export function useNuevaPIForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { idPid } = useParams();

  // Estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investigadoresAgregados, setInvestigadoresAgregados] = useState([]);
  const [investigadorSeleccionado, setInvestigadorSeleccionado] = useState(null);
  const [porcentajeParticipacion, setPorcentajeParticipacion] = useState('');
  const [selectedProyecto, setSelectedProyecto] = useState(null);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(false);

  const vinculandoDesdeProyecto = !!idPid;

  // Cargar investigadores
  const { data: investigadoresData } = useQuery('investigadores', getAllPersonas);
  const investigadores = investigadoresData?.personas || [];

  // Cargar proyecto si viene desde un proyecto
  const { data: proyectoData } = useQuery(
    ['proyecto', idPid],
    () => getProyectoById(idPid),
    {
      enabled: vinculandoDesdeProyecto,
    }
  );

  useEffect(() => {
    if (proyectoData?.proyecto) {
      setSelectedProyecto(proyectoData.proyecto);
      setProyectoSeleccionado(true);
    }
  }, [proyectoData]);

  // Configurar formulario
  const { register, handleSubmit, errors, reset } = useFormHandler({
    schema: nuevaPISchema,
    defaultValues: {
      tipoPI: '',
      numeroExpediente: '',
      fechaInicio: '',
      fechaCierre: '',
      descripcion: '',
    },
  });

  // Mutación para crear PI
  const { mutate, isLoading: isLoadingMutation } = useMutation(
    (data) => createPropiedadIntelectualByProyectoId(selectedProyecto.idProyecto, data),
    {
      onSuccess: () => {
        toast({
          title: 'Propiedad intelectual creada',
          description: 'La propiedad intelectual se ha creado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate(vinculandoDesdeProyecto ? `/proyectos/${idPid}` : '/proyectos');
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Ocurrió un error al crear la propiedad intelectual.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

  // Funciones del modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Funciones para manejar investigadores
  const agregarInvestigador = () => {
    if (!investigadorSeleccionado || !porcentajeParticipacion) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar un investigador y especificar un porcentaje.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const porcentaje = parseFloat(porcentajeParticipacion);
    if (isNaN(porcentaje) || porcentaje <= 0 || porcentaje > 100) {
      toast({
        title: 'Error',
        description: 'El porcentaje debe ser un número entre 0 y 100.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Verificar que no esté ya agregado
    if (investigadoresAgregados.find((inv) => inv.idPersona === investigadorSeleccionado.idPersona)) {
      toast({
        title: 'Error',
        description: 'Este investigador ya fue agregado.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setInvestigadoresAgregados([
      ...investigadoresAgregados,
      {
        ...investigadorSeleccionado,
        porcentajeParticipacion: porcentaje,
      },
    ]);

    setInvestigadorSeleccionado(null);
    setPorcentajeParticipacion('');
  };

  const eliminarInvestigador = (idPersona) => {
    setInvestigadoresAgregados(
      investigadoresAgregados.filter((inv) => inv.idPersona !== idPersona)
    );
  };

  // Función de submit
  const onSubmit = (data) => {
    const piData = {
      tipoPI: data.tipoPI,
      numeroExpediente: data.numeroExpediente || null,
      fechaInicio: data.fechaInicio || null,
      fechaCierre: data.fechaCierre || null,
      descripcion: data.descripcion || null,
      investigadores: investigadoresAgregados.map((inv) => ({
        idPersona: inv.idPersona,
        porcentajeParticipacion: inv.porcentajeParticipacion,
      })),
    };

    mutate(piData);
  };

  // Función de cancelar
  const handleCancel = () => {
    navigate(vinculandoDesdeProyecto ? `/proyectos/${idPid}` : '/proyectos');
  };

  // Función para seleccionar proyecto (cuando no viene desde un proyecto)
  const handleProyectoSelected = (proyecto) => {
    setSelectedProyecto(proyecto);
    setProyectoSeleccionado(true);
  };

  return {
    // Formulario
    register,
    handleSubmit,
    errors,
    onSubmit,
    reset,

    // Estados
    isModalOpen,
    investigadores,
    investigadoresAgregados,
    investigadorSeleccionado,
    setInvestigadorSeleccionado,
    porcentajeParticipacion,
    setPorcentajeParticipacion,

    // Proyecto
    selectedProyecto,
    proyectoSeleccionado,
    handleProyectoSelected,
    vinculandoDesdeProyecto,

    // Investigadores
    agregarInvestigador,
    eliminarInvestigador,

    // Loading
    isLoadingMutation,

    // Funciones de modal
    openModal,
    closeModal,

    // Navegación
    handleCancel,
  };
}
