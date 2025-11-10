import React from 'react';
import { Card, CardBody, Text, Heading, Box, Button, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { PlusSquareIcon } from '@chakra-ui/icons';
import {
  useNuevaPIForm,
  tiposPropiedadIntelectual,
} from '../../hooks/forms/useNuevaPIForm';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';
import BackButton from '../../components/BackButton';
import SeleccionarProyecto from '../vinculaciones/SeleccionarProyecto';
import DisplayField from '../../components/DisplayField';

export default function NuevaPropiedadIntelectual() {
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

    // Proyecto
    selectedProyecto,
    proyectoSeleccionado,
    handleProyectoSelected,
    vinculandoDesdeProyecto,

    // Investigadores
    agregarInvestigador,
    eliminarInvestigador,

    // Loading
    isLoadingMutation,

    // Navegación
    handleCancel,
  } = useNuevaPIForm();

  // Opciones para el select de investigadores (excluir los ya agregados)
  const investigadoresDisponibles = investigadores.filter(
    (inv) => !investigadoresAgregados.find((agregado) => agregado.idPersona === inv.idPersona)
  );

  return (
    <Card>
      <CardBody>
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <HStack width='100%' justifyContent='space-between' mb={6}>
              <BackButton to={vinculandoDesdeProyecto ? `/proyectos/${selectedProyecto?.idProyecto}` : '/proyectos'} />
              <Heading as='h2' size='xl' textAlign='center'>
                Nueva Propiedad Intelectual
              </Heading>
              <Box /> {/* Spacer para centrar el título */}
            </HStack>
            <br />

            {/* Mostrar selector de proyecto solo si NO se viene desde un proyecto */}
            {!vinculandoDesdeProyecto && !proyectoSeleccionado && (
              <SeleccionarProyecto onProyectoSelected={handleProyectoSelected} />
            )}

            {/* Mostrar proyecto seleccionado si se eligió uno */}
            {!vinculandoDesdeProyecto && proyectoSeleccionado && selectedProyecto && (
              <Card width='100%' mb={4}>
                <CardBody>
                  <Text fontSize='md' fontWeight='bold' mb={4}>
                    Datos del proyecto seleccionado
                  </Text>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' gap={4}>
                    <DisplayField
                      label='Código PID'
                      value={selectedProyecto.codPid || 'Sin código'}
                      width={{ base: '100%', md: '50%' }}
                      mb={4}
                    />
                    <DisplayField
                      label='Director'
                      value={
                        selectedProyecto.director
                          ? `${selectedProyecto.director.apellido}, ${selectedProyecto.director.nombre}`
                          : '-'
                      }
                      width={{ base: '100%', md: '50%' }}
                      mb={4}
                    />
                  </Box>
                  <DisplayField
                    label='Denominación'
                    value={selectedProyecto.denominacion}
                    width='100%'
                    mb={4}
                  />
                </CardBody>
              </Card>
            )}

            {/* Mostrar el formulario solo si viene desde proyecto O si ya seleccionó uno */}
            {(vinculandoDesdeProyecto || proyectoSeleccionado) && (
              <>
                <Card width='100%'>
                  <CardBody>
                    <Text fontSize='md' fontWeight='bold'>Ingrese los datos de la propiedad intelectual</Text>
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
                            <Text fontSize='sm' mb={2}>Investigador</Text>
                            <select
                              style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #E2E8F0',
                              }}
                              value={investigadorSeleccionado?.idPersona || ''}
                              onChange={(e) => {
                                const selected = investigadores.find(
                                  (inv) => inv.idPersona === parseInt(e.target.value)
                                );
                                setInvestigadorSeleccionado(selected);
                              }}
                            >
                              <option value=''>Seleccione un investigador...</option>
                              {investigadoresDisponibles.map((inv) => (
                                <option key={inv.idPersona} value={inv.idPersona}>
                                  {inv.apellido}, {inv.nombre}
                                </option>
                              ))}
                            </select>
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
                          columnas={['Apellido', 'Nombre', 'Porcentaje (%)', 'Eliminar']}
                          datos={investigadoresAgregados.map((inv) => [
                            inv.apellido,
                            inv.nombre,
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
                    type='submit'
                    colorScheme='blue'
                    isLoading={isLoadingMutation}
                    loadingText='Creando...'
                  >
                    Crear Propiedad Intelectual
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </form>
      </CardBody>
    </Card>
  );
}
