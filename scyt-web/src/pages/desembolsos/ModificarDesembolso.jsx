import React, { useEffect, useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getDesembolsoById, putDesembolsoById } from '../../utils/api/vinculacionesApi';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import GenericInput from '../../components/formControls/GenericInput';
import CustomModal from '../../components/CustomModal';
import GenericSelect from '../../components/formControls/GenericSelect';

const estados = ['Rendido', 'Aprobado', 'En ejecución', 'En ejecución - Fuera de plazo'];
const schema = yup.object({});

export default function ModificarDesembolso() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { idDesembolso } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { data: dataDesembolso, isLoading } = useQuery(['desembolso', idDesembolso], () => getDesembolsoById(idDesembolso));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (dataDesembolso) {
      reset({
        plazoEtapa: dataDesembolso.desembolso.plazoEtapa,
        montoDesembolsado: dataDesembolso.desembolso.montoDesembolsado,
        estado: dataDesembolso.desembolso.estado,
        fechaDesembolso: formatoFechaISOaAAAAMMDD(dataDesembolso.desembolso.fechaDesembolso),
        ...(dataDesembolso.desembolso.fechaAprobado && { fechaAprobado: formatoFechaISOaAAAAMMDD(dataDesembolso.desembolso.fechaAprobado) }),
        ...(dataDesembolso.desembolso.fechaDeRendicionReal && {
          fechaDeRendicionReal: formatoFechaISOaAAAAMMDD(dataDesembolso.desembolso.fechaDeRendicionReal),
        }),
        ...(dataDesembolso.desembolso.montoRendido && { montoRendido: dataDesembolso.desembolso.montoRendido }),
        ...(dataDesembolso.desembolso.estado && { estado: dataDesembolso.desembolso.estado }),
        ...(dataDesembolso.desembolso.motivoEstado && { motivoEstado: dataDesembolso.desembolso.motivoEstado }),
      });
    }
  }, [dataDesembolso, reset]);

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => putDesembolsoById(parseInt(idDesembolso), formData),
    onSuccess: () => {
      queryClient.refetchQueries(['desembolso', idDesembolso]);
      toast({
        title: 'Desembolso modificado',
        description: 'Se ha modificado el desembolso exitosamente',
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al modificar el desembolso',
        description: 'Intente de nuevo.',
        status: 'error',
        isClosable: true,
      });
    },
  });

  const onSubmit = (values) => {
    console.log(values);
    mutate(values);
    closeModal();
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
            Modificar detalles del desembolso
          </Heading>

          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos del desembolso</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      name='fechaDesembolso'
                      label='Fecha de desembolso'
                      type='date'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '47.5%' }}
                      isRequired
                      mb='5vh'
                    />
                    <GenericInput
                      name='montoDesembolsado'
                      label='Monto desembolsado ($)'
                      placeholder='Modonto desembolsado ($)'
                      width={{ base: '100%', md: '47.5%' }}
                      type='number'
                      register={register}
                      errors={errors}
                      isRequired
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      name='plazoEtapa'
                      label='Plazo de etapa (meses)'
                      placeholder='Plazo de etapa (meses)'
                      type='number'
                      width={{ base: '100%', md: '28%' }}
                      register={register}
                      errors={errors}
                      isRequired
                      mb='5vh'
                    />
                    <GenericInput
                      name='fechaAprobado'
                      label='Fecha de aprobado'
                      type='date'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '34%' }}
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      name='fechaDeRendicionReal'
                      label='Fecha de rendición real'
                      type='date'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '47.5%' }}
                      mb='5vh'
                    />
                    <GenericInput
                      name='montoRendido'
                      label='Monto rendido ($)'
                      placeholder='Monto rendido ($)'
                      type='number'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '47.5%' }}
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericSelect
                      name='estado'
                      label='Estado'
                      placeholder='Estado...'
                      width={{ base: '100%', md: '47.5%' }}
                      mb='5vh'
                      isRequired
                      register={register}
                      options={estados.map((estado) => ({
                        value: estado,
                        label: estado,
                      }))}
                      errors={errors}
                    />
                    <GenericInput
                      label='Motivo de estado'
                      name='motivoEstado'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '47.5%' }}
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                    <Box display='flex' width='20%' justifyContent='flex-end'>
                      <Button colorScheme='gray' variant='outline' onClick={() => navigate(-1)} mr='3%'>
                        Cancelar
                      </Button>
                    </Box>
                    <Button onClick={openModal} colorScheme='blue' variant='outline' isLoading={isLoadingMutation}>
                      Aceptar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Se modificaran los datos del desembolso.'
                      content='¿Seguro que desea modificar la información del desembolso?'
                      onSave={handleSubmit((values) => onSubmit(values))}
                    />
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
