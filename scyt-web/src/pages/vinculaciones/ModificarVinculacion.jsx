import React from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner, HStack } from '@chakra-ui/react';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import CustomModal from '../../components/CustomModal';
import BackButton from '../../components/BackButton';
import { useModificarVinculacionForm } from '../../hooks/forms/useModificarVinculacionForm';

export default function ModificarVinculacion() {
  const {
    register,
    handleSubmit,
    errors,
    financiamiento,
    investigadoresOptions,
    isLoading,
    isSubmitting,
    isModalOpen,
    openModal,
    closeModal,
    handleCancel,
    onSubmit,
  } = useModificarVinculacionForm();

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
              Modificar datos de la vinculación
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md' fontWeight='bold'>Datos de vinculación</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      name='empresaInstitucion'
                      label='Empresa/Institución'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '100%' }}
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericSelect
                      name='idResponsable'
                      label='Responsable'
                      placeholder='Seleccione un responsable...'
                      register={register}
                      errors={errors}
                      options={investigadoresOptions}
                      width={{ base: '100%', md: '100%' }}
                      mb='5vh'
                    />
                  </Box>
                  {financiamiento && (
                    <Box width='100%'>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Título'
                          name='conFinanciamiento.titulo'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                        <GenericInput
                          label='Nombre del beneficiario'
                          name='conFinanciamiento.nombreBeneficiario'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Monto'
                          name='conFinanciamiento.monto'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='number'
                          mb='5vh'
                        />
                        <GenericInput
                          label='Cantidad de desembolsos'
                          name='conFinanciamiento.cantidadDesembolsos'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='number'
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Fecha de presentación'
                          name='conFinanciamiento.fechaPresentacion'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='date'
                          mb='5vh'
                        />
                        <GenericInput
                          label='Fecha de adjudicación'
                          name='conFinanciamiento.fechaAdjudicacion'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='date'
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Plazo de ejecución (meses)'
                          name='conFinanciamiento.plazoEjecucion'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '100%' }}
                          type='number'
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Estado'
                          name='conFinanciamiento.estado'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                        {/* Pensar en si esto debe condicionarse o no. Cargar cuando el estado sea "Desistido" nomás? */}
                        <GenericInput
                          label='Motivo desistido'
                          name='conFinanciamiento.motivoEstado'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                      </Box>{' '}
                    </Box>
                  )}
                  {!financiamiento && (
                    <Box width='100%'>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Fecha de inicio'
                          name='sinFinanciamiento.fechaInicio'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='date'
                          mb='5vh'
                        />
                        <GenericInput
                          label='Fecha de cierre'
                          name='sinFinanciamiento.fechaCierre'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='date'
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          textArea
                          label='Descripción'
                          name='sinFinanciamiento.descripcion'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                      </Box>
                    </Box>
                  )}
                  <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                    <Button colorScheme='gray' variant='outline' mr='3%' onClick={handleCancel}>
                      Cancelar
                    </Button>
                    <Button onClick={openModal} isLoading={isSubmitting} colorScheme='blue' variant='outline'>
                      Guardar
                    </Button>
                    <CustomModal
                      isOpen={isModalOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Guardar datos'
                      content='Se guardara los nuevos datos del convenio'
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
