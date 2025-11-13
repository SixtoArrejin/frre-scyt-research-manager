import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useToast } from '@chakra-ui/react';
import * as yup from 'yup';
import { updatePropiedadIntelectual, getPropiedadIntelectualById } from '../../utils/api/propiedadIntelectualApi';
import { useFormHandler } from '../useFormHandler';
import { getAllPersonas } from '../../utils/api/personasApi';

// Schema de validación para modificar PI
const modificarPISchema = yup.object({
  tipoPI: yup.string().required('El tipo de PI es requerido'),
  numeroExpediente: yup.string().nullable(),
  fechaInicio: yup.string().nullable(),
  fechaCierre: yup.string().nullable(),
  descripcion: yup.string().nullable(),
});

export function useModificarPIForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { idPI } = useParams();

  // Estados
  const [investigadoresAgregados, setInvestigadoresAgregados] = useState([]);
  const [investigadorSeleccionado, setInvestigadorSeleccionado] = useState(null);
  const [porcentajeParticipacion, setPorcentajeParticipacion] = useState('');

  // Cargar investigadores
  const { data: investigadoresData } = useQuery('investigadores', getAllPersonas);
  const investigadores = investigadoresData?.personas || [];

  // Cargar PI actual
  const { data: piData, isLoading: isLoadingPI } = useQuery(
    ['propiedadIntelectual', idPI],
    () => getPropiedadIntelectualById(idPI),
    {
      enabled: !!idPI,
    }
  );

  // Configurar formulario
  const { register, handleSubmit, errors, reset, setValue } = useFormHandler({
    schema: modificarPISchema,
    defaultValues: {
      tipoPI: '',
      numeroExpediente: '',
      fechaInicio: '',
      fechaCierre: '',
      descripcion: '',
    },
  });

  // Cargar datos cuando llega la PI
  useEffect(() => {
    if (piData?.propiedadIntelectual) {
      const pi = piData.propiedadIntelectual;
      
      // Formatear fechas para el input date
      const formatDateForInput = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      setValue('tipoPI', pi.tipoPI || '');
      setValue('numeroExpediente', pi.numeroExpediente || '');
      setValue('fechaInicio', formatDateForInput(pi.fechaInicio));
      setValue('fechaCierre', formatDateForInput(pi.fechaCierre));
      setValue('descripcion', pi.descripcion || '');

      // Cargar investigadores
      if (pi.investigadores && pi.investigadores.length > 0) {
        const investigadoresFormateados = pi.investigadores.map((inv) => ({
          idPersona: inv.personas.idPersona,
          nombre: inv.personas.nombre,
          apellido: inv.personas.apellido,
          porcentajeParticipacion: inv.porcentajeParticipacion,
        }));
        setInvestigadoresAgregados(investigadoresFormateados);
      }
    }
  }, [piData, setValue]);

  // Mutación para actualizar PI
  const { mutate, isLoading: isLoadingMutation } = useMutation(
    (data) => updatePropiedadIntelectual(idPI, data),
    {
      onSuccess: () => {
        toast({
          title: 'Propiedad intelectual actualizada',
          description: 'La propiedad intelectual se ha actualizado exitosamente.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate(`/propiedadIntelectual/${idPI}`);
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Ocurrió un error al actualizar la propiedad intelectual.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    }
  );

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
    navigate(`/propiedadIntelectual/${idPI}`);
  };

  return {
    // Formulario
    register,
    handleSubmit,
    errors,
    onSubmit,
    reset,
    setValue,

    // Estados
    investigadores,
    investigadoresAgregados,
    investigadorSeleccionado,
    setInvestigadorSeleccionado,
    porcentajeParticipacion,
    setPorcentajeParticipacion,

    // PI actual
    piData,
    isLoadingPI,

    // Investigadores
    agregarInvestigador,
    eliminarInvestigador,

    // Loading
    isLoadingMutation,

    // Navegación
    handleCancel,
  };
}
