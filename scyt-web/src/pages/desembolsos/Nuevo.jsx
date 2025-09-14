import React, { useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import CustomModal from '../../components/CustomModal';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createDesembolsoByIdVinculacion } from '../../utils/api/vinculacionesApi';
import GenericInput from '../../components/formControls/GenericInput';

const schema = yup.object({
  fechaDesembolso: yup.date().required('La fecha es requerida'),
  plazoEtapa: yup.number().required('El plazo es requerido'),
  montoDesembolsado: yup.number().required('El monto es requerido'),
});

export default function NuevoDesembolso() {
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
  const { idVinculacion } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idConFinanciamiento: parseInt(idVinculacion),
      fechaDesembolso: new Date().toISOString().split('T')[0],
      // fechaAprobado: new Date().toISOString().split('T')[0],
      plazoEtapa: null,
      montoDesembolsado: null,
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => createDesembolsoByIdVinculacion(formData),
    onSuccess: () => {
      toast({
        title: 'Crear desembolso',
        description: 'Se ha creado exitosamente',
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al registrar el desembolso',
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

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Nuevo Desembolso
          </Heading>

          <br />
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Ingrese los datos del desembolso</Text>
              <br />
              <form onSubmit={handleSubmit((values) => onSub(values))}>
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        name='fechaDesembolso'
                        label='Fecha de desembolso'
                        type='date'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        name='plazoEtapa'
                        label='Plazo de etapa (meses)'
                        type='number'
                        placeholder='Plazo de etapa'
                        register={register}
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
                        name='montoDesembolsado'
                        label='Monto'
                        type='number'
                        placeholder='Monto'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      {/* <GenericInput
                        name='fechaAprobado'
                        label='Fecha de aprobado'
                        type='date'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      /> */}
                    </Box>
                  </Box>
                  <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end'>
                    <Button colorScheme='gray' variant='outline' mr='3%' onClick={() => navigate(-1)}>
                      Cancelar
                    </Button>
                    <Button onClick={openModal} colorScheme='blue' variant='outline'>
                      Guardar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Guardar nuevo desembolso'
                      content='Se guardara el nuevo desembolso'
                      onSave={handleSubmit((values) => onSub(values))}
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
