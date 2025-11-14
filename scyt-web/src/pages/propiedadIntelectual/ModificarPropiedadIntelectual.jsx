import React, { useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, HStack, Spinner } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  useModificarPIForm,
} from '../../hooks/forms/useModificarPIForm';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';
import BackButton from '../../components/BackButton';

const tiposPropiedadIntelectual = [
  'Derecho de Autor',
  'Modelo de Utilidad',
  'Modelo Industrial',
  'Patente',
  'Otros',
];

export default function ModificarPropiedadIntelectual() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    // Formulario
    register,
    handleSubmit,
    errors,
    onSubmit,

    // Estados
    investigadores,
    investigadoresAgregados,
    investigadorSeleccionado,
    setInvestigadorSeleccionado,
    porcentajeParticipacion,
    setPorcentajeParticipacion,

    // PI actual
    isLoadingPI,

    // Investigadores
    agregarInvestigador,
    eliminarInvestigador,

    // Loading
    isLoadingMutation,

    // Navegación
    handleCancel,
  } = useModificarPIForm();

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleSubmitAndClose = async() => {
    await onSubmit();
    closeModal();
  };

  // Opciones para el select de investigadores (excluir los ya agregados)
  const investigadoresDisponibles = investigadores.filter(
    (inv) => !investigadoresAgregados.find((agregado) => agregado.idPersona === inv.idPersona),
  );

  if (isLoadingPI) {
    return (
      <Box
        display='flex'
        height='calc(100vh - 80px - 16px - 1px - 16px)'
        width='100%'
        alignItems='center'
        justifyContent='center'
      >
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  return (
    <Card>
      <CardBody>
        <form style={{ width: '100%' }}>
          <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <HStack width='100%' justifyContent='space-between' mb={6}>
              <BackButton onClick={handleCancel} />
              <Heading as='h2' size='xl' textAlign='center'>
                Modificar Propiedad Intelectual
              </Heading>
              <Box /> {/* Spacer para centrar el título */}
            </HStack>
            <br />

            <Card width='100%'>
              <CardBody>
                <Text fontSize='md' fontWeight='bold'>Datos de la propiedad intelectual</Text>
                <br />
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericSelect
                        name='tipoPI'
                        label='Tipo de Propiedad Intelectual'
                        placeholder='Seleccione un tipo...'
                        register={register}
                        errors={errors}
                        options={tiposPropiedadIntelectual.map((tipo) => ({
                          value: tipo,
                          label: tipo,
                        }))}
                        width={{ base: '100%', md: '47.5%' }}
                        isRequired
                        mb='5vh'
                      />
                      <GenericInput
                        name='numeroExpediente'
                        label='Número de Expediente'
                        placeholder='Número de Expediente'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                      />
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        name='fechaInicio'
                        label='Fecha de Inicio'
                        type='date'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                      />
                      <GenericInput
                        name='fechaCierre'
                        label='Fecha de Cierre'
                        type='date'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                      />
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        name='descripcion'
                        label='Descripción'
                        placeholder='Descripción de la propiedad intelectual'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '100%' }}
                        mb='5vh'
                        textArea={true}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardBody>
            </Card>

            <br />
            <Card width='100%'>
              <CardBody>
                <Text fontSize='md' fontWeight='bold'>Añadir investigadores involucrados</Text>
                <br />
                <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
                  <Box display='flex' width='100%'>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} justifyContent='space-between' width='70%' marginLeft='2%' gap={4}>
                      <Box width={{ base: '100%', md: '45%' }}>
                        <GenericSelect
                          label='Investigador'
                          placeholder='Seleccione un investigador...'
                          options={investigadoresDisponibles.map((inv) => ({
                            value: inv.idPersona,
                            label: `${inv.apellido}, ${inv.nombre}`,
                          }))}
                          value={investigadorSeleccionado?.idPersona || ''}
                          onChange={(e) => {
                            const selected = investigadores.find(
                              (inv) => inv.idPersona === parseInt(e.target.value),
                            );
                            setInvestigadorSeleccionado(selected);
                          }}
                        />
                      </Box>
                      <GenericInput
                        type='number'
                        placeholder='Porcentaje de participación'
                        label='Porcentaje (%)'
                        width={{ base: '100%', md: '25%' }}
                        mb='5vh'
                        value={porcentajeParticipacion}
                        onChange={(e) => setPorcentajeParticipacion(e.target.value)}
                        min='0'
                        max='100'
                        step='0.01'
                      />
                      <Box display='flex' alignItems='flex-end' width='20%' mb='5vh'>
                        <Button colorScheme='blue' variant='outline' onClick={agregarInvestigador} width='100%'>
                          Agregar
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <br />
                  <Text fontSize='md' fontWeight='bold' alignSelf='flex-start' ml={4}>
                    Investigadores involucrados agregados
                  </Text>
                  <br />
                  {investigadoresAgregados.length > 0 ? (
                    <Tabla
                      columnas={['Investigador', 'Porcentaje (%)', 'Eliminar']}
                      datos={investigadoresAgregados.map((inv) => [
                        <div key={`nombre-${inv.idPersona}`}>
                          {inv.apellido} {inv.nombre}
                        </div>,
                        inv.porcentajeParticipacion,
                        <DeleteIcon
                          key={inv.idPersona}
                          cursor='pointer'
                          onClick={() => eliminarInvestigador(inv.idPersona)}
                        />,
                      ])}
                      paginado={false}
                    />
                  ) : (
                    <Text color='gray.500'>No hay investigadores agregados aún.</Text>
                  )}
                </Box>
              </CardBody>
            </Card>

            <br />
            <Box display='flex' width='100%' justifyContent='flex-end' gap={4}>
              <Button variant='outline' onClick={handleCancel}>
                Cancelar
              </Button>
              <Button
                colorScheme='blue'
                variant='outline'
                onClick={handleOpenModal}
                isLoading={isLoadingMutation}
                loadingText='Actualizando...'
              >
                Guardar Cambios
              </Button>
            </Box>

            <CustomModal
              isOpen={isOpen}
              onClose={closeModal}
              guardar={true}
              title='Guardar cambios en Propiedad Intelectual'
              content='¿Estás seguro de que deseas guardar los cambios en esta Propiedad Intelectual?'
              onSave={() => handleSubmit(handleSubmitAndClose)()}
            />
          </Box>
        </form>
      </CardBody>
    </Card>
  );
}
