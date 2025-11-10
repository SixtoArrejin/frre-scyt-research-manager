import React, { useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import CustomModal from '../../components/CustomModal';
import { getProyectoById } from '../../utils/api/proyectosApi';
import { getAllRegionales } from '../../utils/api/regionalesApi';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';

export default function AgregarRegional() {
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const { idPid } = useParams();

  const { data: dataProyecto, isLoading } = useQuery(['dataProyecto', idPid], () => getProyectoById(Number(idPid)));
  const { data: dataRegionales } = useQuery(['dataRegionales'], () => getAllRegionales());


  // const [selectedOptionsRegionales, setSelectedOptionsRegionales] = useState();

  /* const { mutate: mutateAddRegional, isLoading: isLoadingMutation } = useMutation({
    mutationFn: () => addRegional(Number(idPid), Number(selectedOptionsRegionales)),
    onSuccess: () => {
      toast({
        title: 'Agregar regional',
        description: `Se ha agregado el regional exitosamente`,
        status: 'success',
        isClosable: true,
      });
      queryClient.refetchQueries(['dataProyecto']);
    },
    onError: () => {
      toast({
        title: 'Error al agregar el regional',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  const { mutate: mutateDelRegional, isLoading: isLoadingMutationDel } = useMutation({
    mutationFn: (idRegional) => delRegional(Number(idPid), Number(idRegional)),
    onSuccess: () => {
      toast({
        title: 'Eliminar regional',
        description: `Se ha eliminado el regional exitosamente`,
        status: 'success',
        isClosable: true,
      });
      queryClient.refetchQueries(['dataProyecto']);
      // navigate(`/investigadores/5`);
      // navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al eliminar el regional',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  }); */

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
            Modificar Regionales
          </Heading>
        </Box>

        {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
        <br />

        <Card width='100%'>
          <CardBody>
            <Text fontSize='md' fontWeight='bold'>Agregar los regionales asociados al proyecto</Text>
            <br />
            <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
              <br />
              <Box display='flex' width='100%'>
                <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
                  <GenericSelect
                    placeholder='Regionales...'
                    options={dataRegionales?.regionales?.map((item, key) => ({
                      value: key,
                      label: item,
                    }))}
                    // onChange={(e) => {
                    //   setSelectedOptionsRegionales(e.target.value);
                    // }}
                  />
                </Box>
                <Box display='flex' justifyContent='flex-end' width='55%'>
                  <Button colorScheme='blue' variant='outline' mr='5' /* onClick={() => mutateAddRegional()} */>
                    Agregar
                  </Button>
                </Box>
              </Box>
              <br />

              <Tabla
                columnas={['Regional', 'Eliminar']}
                datos={dataProyecto?.proyecto?.regionalesAsociadas?.map((item, key) => {
                  return [
                    <div key={`regional-${key}`}>{item.nombreRegional}</div>,
                    <DeleteIcon
                      key={`delete-${key}`}
                      cursor={'pointer'}
                      /* onClick={() => {
                        mutateDelRegional(key);
                      }} */
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
                // onSave={handleSubmit((values) => onSub(values))}
              />
            </Box>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
}
