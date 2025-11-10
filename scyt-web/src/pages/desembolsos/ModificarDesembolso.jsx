import React from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner, HStack } from '@chakra-ui/react';
import GenericInput from '../../components/formControls/GenericInput';
import CustomModal from '../../components/CustomModal';
import GenericSelect from '../../components/formControls/GenericSelect';
import BackButton from '../../components/BackButton';
import { useModificarDesembolsoForm } from '../../hooks/forms/useModificarDesembolsoForm';

export default function ModificarDesembolso() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    isSubmitting,
    isModalOpen,
    openModal,
    closeModal,
    handleCancel,
    estadosOptions,
    onSubmit,
  } = useModificarDesembolsoForm();

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
              Modificar detalles del desembolso
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>

          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md' fontWeight='bold'>Datos del desembolso</Text>
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
                      label='Plazo de etapa'
                      placeholder='Meses'
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
                      options={estadosOptions}
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
                      <Button colorScheme='gray' variant='outline' onClick={handleCancel} mr='3%'>
                        Cancelar
                      </Button>
                    </Box>
                    <Button onClick={openModal} colorScheme='blue' variant='outline' isLoading={isSubmitting}>
                      Aceptar
                    </Button>
                    <CustomModal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Se modificaran los datos del desembolso.'
                      content='¿Seguro que desea modificar la información del desembolso?'
                      onSave={handleSubmit(onSubmit)}
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
