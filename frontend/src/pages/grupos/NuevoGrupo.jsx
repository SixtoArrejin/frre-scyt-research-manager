import React, { useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast } from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createGrupo } from '../../utils/api/gruposApi';
import { useMutation } from 'react-query';
import CustomModal from '../../components/CustomModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import GenericInput from '../../components/formControls/GenericInput';

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  resolucion: yup
    .string()
    .required('La resolución es requerida')
    .matches(/^\d+\/\d+$/, "El formato de la resolución debe ser '###/###'"),
  fechaCreacion: yup.string().required('La fecha es requerida'),
  siglas: yup.string().required('Las siglas son requeridas'),
});

export default function NuevoGrupo() {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      resolucion: '',
      fechaCreacion: '',
      siglas: '',
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => createGrupo(formData),
    onSuccess: () => {
      toast({
        title: 'Crear grupo',
        description: `Se ha creado exitosamente`,
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al crear el grupo',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  const onSub = (values) => {
    console.log(values);
    mutate(values);
  };

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Nuevo Grupo
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
                        id='nombre'
                        name='nombre'
                        label='Nombre'
                        placeholder='Nombre'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                      />
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        id='siglas'
                        name='siglas'
                        label='Siglas'
                        placeholder='Siglas'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                      />
                    </Box>
                  </Box>

                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        id='resolucion'
                        name='resolucion'
                        label='Resolución'
                        placeholder='Resolución'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                      />
                    </Box>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        id='fechaCreacion'
                        name='fechaCreacion'
                        label='Fecha Creación'
                        placeholder='Fecha'
                        type='date'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                      />
                    </Box>
                  </Box>
                  <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end'>
                    <Button colorScheme='gray' variant='outline' mr='3%' onClick={() => navigate(-1)}>
                      Cancelar
                    </Button>
                    <Button onClick={openModal} colorScheme='blue' variant='outline' isLoading={isLoadingMutation}>
                      Guardar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Guardar nuevo grupo'
                      content='Se guardara el nuevo grupo'
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
