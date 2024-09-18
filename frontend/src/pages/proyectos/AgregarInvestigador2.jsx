import React, { useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueries, useQueryClient } from 'react-query';
import { getAllPersonas, getPersonasByGroup } from '../../utils/api/personasApi';
import { addInvestigador, delInvestigador } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import { getProyectoById } from '../../utils/api/proyectosApi';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';
import { getAllGrupos } from '../../utils/api/gruposApi';

const roles = ['Director', 'CoDirector', 'Investigador', 'Becario', 'Asesor Cientifico', 'Técnico de Apoyo'];

export default function AgregarInvestigador2() {
  /* Usestate para el modal */
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toast = useToast();
  const navigate = useNavigate();

  const { idPid } = useParams();

  const { data: dataProyecto, isLoading } = useQuery(['dataProyecto', idPid], () => getProyectoById(Number(idPid)));
  // Verificar si los datos del proyecto ya están cargados
  const gruposInvestigacion = dataProyecto?.proyecto?.tiene ?? [];
  // Solo ejecutamos useQueries si hay grupos cargados
  const investigadoresQueries = useQueries(
    gruposInvestigacion.map((grupo) => ({
      queryKey: ['personasGrupo', grupo.idGrupoInvestigacion],
      queryFn: () => getPersonasByGroup(grupo.idGrupoInvestigacion),
      enabled: !!grupo.idGrupoInvestigacion, // Habilitar solo cuando el idGrupoInvestigacion esté disponible
    }))
  );
  const investigadoresGrupos = investigadoresQueries.flatMap((query) => query?.data?.personasGrupo ?? []);
  // Revisamos si alguno de los queries de investigadores está cargando
  const isLoadingInvestigadores = investigadoresQueries.some((query) => query.isLoading);

  const { mutate: mutateInvestigador, isLoading: isLoadingInvestigador } = useMutation({
    mutationFn: () => addInvestigador(Number(idPid), { idInvestigador: selectedOptions, rol: rolSelectedOptions }),
    onSuccess: () => {
      toast({
        title: 'Agregar investigador',
        description: `Se ha agregado el investigador exitosamente`,
        status: 'success',
        isClosable: true,
      });
      queryClient.refetchQueries(['dataProyecto', idPid]);
      // navigate(`/investigadores/5`);
      // navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al agregar al investigador',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  const { mutate: mutateDelInvestigador, isLoading: isLoadingDelInvestigador } = useMutation({
    mutationFn: (idInvestigador) => delInvestigador(Number(idPid), Number(idInvestigador)),
    onSuccess: () => {
      toast({
        title: 'Eliminar investigador',
        description: `Se ha eliminado el investigador exitosamente`,
        status: 'success',
        isClosable: true,
      });
      queryClient.refetchQueries(['dataProyecto', idPid]);
      // navigate(`/investigadores/5`);
      // navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al eliminar al investigador',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  //Aca se agrega lo de la tabla de investigadores
  const [selectedOptions, setSelectedOptions] = useState();
  const [rolSelectedOptions, setRolSelectedOptions] = useState();

  const { data: dataGruposInvestigacion } = useQuery('grupos', () => getAllGrupos());
  const { data: dataPersonas } = useQuery('personas', () => getAllPersonas());

  const calcularGrupo = (idGrupo) => {
    if (!dataGruposInvestigacion) {
      return '...';
    }

    const grupoEncontrado = dataGruposInvestigacion?.grupos?.find((grupo) => grupo.idGrupoInvestigacion === idGrupo);

    return grupoEncontrado ? grupoEncontrado.siglas : 'Sin siglas';
  };

  if (isLoading) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Modificar Integrantes
          </Heading>
        </Box>

        {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
        <br />
        <Card width='100%'>
          <CardBody>
            <Text fontSize='md'>Agregar los investigadores al proyecto</Text>
            <br />
            <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
              <br />
              <Box display='flex' width='100%'>
                <Box display='flex' justifyContent='space-between' width='50%' marginLeft='2%'>
                  <GenericSelect
                    placeholder='Integrantes...'
                    options={investigadoresGrupos.map((item) => ({
                      value: item.idPersona,
                      label: item.apellido + ', ' + item.nombre,
                    }))}
                    onChange={(e) => {
                      setSelectedOptions(e.target.value);
                    }}
                    width='47.5%'
                  />
                  <GenericSelect
                    placeholder='Rol...'
                    options={roles.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                    onChange={(e) => {
                      setRolSelectedOptions(e.target.value);
                    }}
                    width='47.5%'
                  />
                </Box>
                <Box display='flex' justifyContent='flex-end' width='50%'>
                  <Button colorScheme='blue' variant='outline' mr='5' onClick={() => mutateInvestigador()}>
                    Agregar
                  </Button>
                </Box>
              </Box>
              <br />

              <Tabla
                columnas={['Apellido y nombre', 'Grupo', 'Rol', 'Eliminar']}
                datos={dataProyecto?.proyecto?.participa?.map((item, index) => {
                  return [
                    <div>{item.personas.apellido + ', ' + item.personas.nombre}</div>,
                    calcularGrupo(item.personas.idGrupoInvestigacion), //Buscar manera de indicar las siglas no el id del grupo
                    item.rol,
                    <DeleteIcon
                      cursor={'pointer'}
                      // onClick={() => {
                      //   eliminarInvestigador(item.idPersona, index);
                      // }}
                      onClick={() => {
                        mutateDelInvestigador(item.personas.idPersona);
                      }}
                    />,
                  ];
                })}
                paginado={false}
              />
            </Box>
            <br />
            <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
              <Button colorScheme='gray' variant='outline' onClick={() => navigate(-1)} mr='5%'>
                Volver
              </Button>
              <CustomModal
                isOpen={isOpen}
                onClose={closeModal}
                guardar={true}
                title='Guardar nuevo PID'
                content='Se guardara el nuevo PID'
                // onSave={handleSubmit((values) => mutate(values))}
                // onSave={() => mutateInvestigador()}
              />
            </Box>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
}
