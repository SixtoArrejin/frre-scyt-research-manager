import React, { useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { addGrupo, delGrupo } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import { getProyectoById } from '../../utils/api/proyectosApi';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';
import BackButton from '../../components/BackButton';

export default function AgregarGrupo() {
  const queryClient = useQueryClient();
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const toast = useToast();
  const navigate = useNavigate();

  const [selectedOptionsGrupos, setSelectedOptionsGrupos] = useState();

  const { idPid } = useParams();

  const { data: dataProyecto, isLoading } = useQuery(['dataProyecto', idPid], () => getProyectoById(Number(idPid)));

  const { data: dataGrupos } = useQuery(['allGrupos'], () => getAllGrupos());

  const { mutate: mutateAddGrupo } = useMutation({
    mutationFn: () => addGrupo(Number(idPid), Number(selectedOptionsGrupos)),
    onSuccess: () => {
      toast({
        title: 'Agregar grupo',
        description: 'Se ha agregado el grupo exitosamente',
        status: 'success',
        isClosable: true,
      });
      queryClient.refetchQueries(['dataProyecto']);
    },
    onError: () => {
      toast({
        title: 'Error al agregar el grupo',
        description: 'Intente de nuevo.',
        status: 'error',
        isClosable: true,
      });
    },
  });

  const { mutate: mutateDelGrupo } = useMutation({
    mutationFn: (idGrupo) => delGrupo(Number(idPid), Number(idGrupo)),
    onSuccess: () => {
      toast({
        title: 'Eliminar grupo',
        description: 'Se ha eliminado el grupo exitosamente',
        status: 'success',
        isClosable: true,
      });
      queryClient.refetchQueries(['dataProyecto']);
      // navigate(`/investigadores/5`);
      // navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al eliminar el grupo',
        description: 'Intente de nuevo.',
        status: 'error',
        isClosable: true,
      });
    },
  });

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
          <HStack width='100%' justifyContent='space-between' mb={6}>
            <BackButton />
            <Heading as='h2' size='xl' textAlign='center'>
              Modificar Grupos
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>
        </Box>

        {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
        <br />

        <Card width='100%'>
          <CardBody>
            <Text fontSize='md' fontWeight='bold'>Agregar los grupos asociados al proyecto</Text>
            <br />
            <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
              <br />
              <Box display='flex' width='100%'>
                <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
                  <GenericSelect
                    placeholder='Grupos...'
                    options={dataGrupos?.grupos?.map((item) => ({
                      value: item.idGrupoInvestigacion,
                      label: item.siglas,
                    }))}
                    onChange={(e) => {
                      setSelectedOptionsGrupos(e.target.value);
                    }}
                  />
                </Box>
                <Box display='flex' justifyContent='flex-end' width='55%'>
                  <Button colorScheme='blue' variant='outline' mr='5' onClick={() => mutateAddGrupo()}>
                    Agregar
                  </Button>
                </Box>
              </Box>
              <br />

              <Tabla
                columnas={['Grupo', 'Eliminar']}
                datos={dataProyecto?.proyecto?.tiene?.map((item) => {
                  return [
                    <div key={`grupo-${item?.gruposinvestigacion?.idGrupoInvestigacion}`}>{item?.gruposinvestigacion?.siglas}</div>,
                    <DeleteIcon
                      key={`delete-${item?.gruposinvestigacion?.idGrupoInvestigacion}`}
                      cursor={'pointer'}
                      onClick={() => {
                        mutateDelGrupo(item?.gruposinvestigacion?.idGrupoInvestigacion);
                      }}
                    />,
                  ];
                })}
                paginado={false}
              />
            </Box>

            <br />
            <Box
              display='flex'
              width='100%'
              alignItems='center'
              justifyContent="flex-end"
            >
              <Button colorScheme='gray' variant='outline' onClick={() => navigate(-1)} mr='5%'>
                Volver
              </Button>
              <CustomModal
                isOpen={isOpen}
                onClose={closeModal}
                guardar={true}
                title='Guardar nuevo PID'
                content='Se guardara el nuevo PID'
                // onSave={handleSubmit((values) => onSub(values))}
              />
            </Box>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
}
