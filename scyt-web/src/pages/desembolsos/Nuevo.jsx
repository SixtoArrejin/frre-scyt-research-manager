import React from 'react';
import { Card, CardBody, Text, Heading, Box, Button, HStack } from '@chakra-ui/react';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import BackButton from '../../components/BackButton';
import { useNuevoDesembolsoForm } from '../../hooks/forms/useNuevoDesembolsoForm';

export default function NuevoDesembolso() {
  const {
    register,
    handleSubmit,
    errors,
    isModalOpen,
    openModal,
    closeModal,
    handleCancel,
    onSubmit,
  } = useNuevoDesembolsoForm();

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <HStack width='100%' justifyContent='space-between' mb={6}>
            <BackButton />
            <Heading as='h2' size='xl' textAlign='center'>
              Nuevo Desembolso
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>

          <br />
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md' fontWeight='bold'>Ingrese los datos del desembolso</Text>
              <br />
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
                      label='Plazo de etapa'
                      type='number'
                      placeholder='Plazo de la etapa en meses'
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
                  <Button colorScheme='gray' variant='outline' mr='3%' onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button onClick={openModal} colorScheme='blue' variant='outline'>
                    Guardar
                  </Button>
                  <CustomModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    guardar={true}
                    title='Guardar nuevo desembolso'
                    content='Se guardara el nuevo desembolso'
                    onSave={handleSubmit(onSubmit)}
                  />
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
