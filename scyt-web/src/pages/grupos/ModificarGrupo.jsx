import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getGrupoById, updateGrupo } from '../../utils/api/gruposApi';
import { useMutation, useQuery } from 'react-query';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  resolucion: yup
    .string()
    .required('La resolución es requerida')
    .matches(/^\d+\/\d+$/, 'El formato de la resolución debe ser \'###/###\''),
  fechaCreacion: yup.string().required('La fecha es requerida'),
  siglas: yup.string().required('Las siglas son requeridas'),
});

export default function ModificarGrupo() {
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const toast = useToast();

  const { idGrupoInvestigacion } = useParams();

  const { data, isLoading, error: errorGrupo } = useQuery(['grupo'], () => getGrupoById(idGrupoInvestigacion));

  useEffect(() => {
    setValue('nombre', data?.grupo.nombre);
    setValue('resolucion', data?.grupo.resolucion);
    setValue('fechaCreacion', formatoFechaISOaAAAAMMDD(data?.grupo.fechaCreacion));
    setValue('siglas', data?.grupo.siglas);
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: data?.grupo?.nombre,
      resolucion: data?.grupo?.resolucion,
      fechaCreacion: formatoFechaISOaAAAAMMDD(data?.grupo?.fechaCreacion),
      siglas: data?.grupo?.siglas,
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updateGrupo(idGrupoInvestigacion, formData),
    onSuccess: () => {
      toast({
        title: 'Modificar grupo',
        description: 'Se ha modificado el grupo exitosamente',
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al modificar los datos del grupo',
        description: 'Intente de nuevo.',
        status: 'error',
        isClosable: true,
      });
    },
  });

  const onSub = (values) => {
    console.log(values);
    mutate(values);
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
            Modificar Datos del Grupo
          </Heading>
          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Ingrese los datos del grupo</Text>
              <br />
              <form onSubmit={handleSubmit((values) => onSub(values))}>
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        name='nombre'
                        label='Nombre'
                        placeholder='Nombre'
                        register={register}
                        defaultValue={data?.grupo?.nombre || ''}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        name='siglas'
                        label='Siglas'
                        placeholder='Siglas'
                        register={register}
                        defaultValue={data?.grupo?.siglas || ''}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>
                  </Box>

                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        name='resolucion'
                        label='Resolución'
                        placeholder='Resolución'
                        register={register}
                        defaultValue={data?.grupo?.resolución || ''}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        type='date'
                        name='fechaCreacion'
                        label='Fecha'
                        placeholder='Fecha'
                        register={register}
                        defaultValue={formatoFechaISOaAAAAMMDD(data?.grupo.fechaCreacion) || ''}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>
                  </Box>
                  <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end'>
                    <Button colorScheme='gray' variant='outline' mr='3%' onClick={() => navigate(-1)}>
                      Cancelar
                    </Button>
                    <Button onClick={openModal} isLoading={isLoadingMutation} colorScheme='blue' variant='outline'>
                      Guardar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Guardar datos'
                      content='Se guardara los nuevos datos del grupo'
                      onSave={handleSubmit((values) => mutate(values))}
                    />
                  </Box>
                </Box>
              </form>
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
