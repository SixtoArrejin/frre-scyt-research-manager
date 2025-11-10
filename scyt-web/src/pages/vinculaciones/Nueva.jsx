import React from 'react';
import { Card, CardBody, Text, Heading, Box, Button, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  useNuevaVinculacionForm,
  tiposConvenio,
} from '../../hooks/forms/useNuevaVinculacionForm';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import GenericRadio from '../../components/formControls/GenericRadio';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';
import BackButton from '../../components/BackButton';
import SeleccionarProyecto from './SeleccionarProyecto';
import DisplayField from '../../components/DisplayField';

export default function NuevaVinculacion() {
  const {
    // Formulario
    register,
    handleSubmit,
    errors,
    onSubmit,

    // Estados
    isModalOpen,
    investigadoresOptions,
    selectedConvenio,
    setSelectedConvenio,
    nroConvenio,
    setNroConvenio,

    // Proyecto
    selectedProyecto,
    proyectoSeleccionado,
    handleProyectoSelected,
    vinculandoDesdeProyecto,

    // Convenios
    convenios,
    agregarConvenio,
    eliminarConvenio,

    // Watched values
    tipoFinanciamiento,

    // Loading
    isLoadingMutation,

    // Funciones de modal
    openModal,
    closeModal,

    // Navegación
    handleCancel,
  } = useNuevaVinculacionForm();

  return (
    <Card>
      <CardBody>
        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <HStack width='100%' justifyContent='space-between' mb={6}>
              <BackButton to='/vinculaciones' />
              <Heading as='h2' size='xl' textAlign='center'>
                Nueva Vinculacion
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
                    <Text fontSize='md' fontWeight='bold'>Ingrese los datos de la nueva vinculación</Text>
                    <br />
                    <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                      <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                        <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                          <GenericInput
                            name='empresaInstitucion'
                            label='Empresa/Institución'
                            placeholder='Empresa/Institución'
                            register={register}
                            errors={errors}
                            width={{ base: '100%', md: '50%' }}
                            isRequired
                            mb='5vh'
                          />
                          <Box width={{ base: '100%', md: '45%' }} display='flex' justifyContent='center'>
                            <GenericRadio
                              name='financiamiento'
                              // label='Tipo de categoria:'
                              direction='row'
                              options={[
                                { value: 'true', label: 'Con financiamiento' },
                                { value: 'false', label: 'Sin financiamiento' },
                              ]}
                              register={register}
                              defaultValue='false'
                              mb='5vh'
                              width={'100%'}
                            />
                          </Box>
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
                      </Box>
                    </Box>
                  </CardBody>
                </Card>

                {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
                <br />
                <Card width='100%'>
                  <CardBody>
                    <Text fontSize='md' fontWeight='bold'>Convenios</Text>
                    <br />
                    <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
                      <br />
                      <Box display='flex' width='100%'>
                        <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} justifyContent='space-between' width='60%' marginLeft='2%'>
                          <GenericSelect
                            isSearchable={true}
                            label='Tipo de convenio'
                            options={tiposConvenio.map((item) => ({
                              value: item,
                              label: item,
                            }))}
                            value={selectedConvenio}
                            onChange={(e) => {
                              setSelectedConvenio(e.target.value);
                            }}
                            width={{ base: '100%', md: '35%' }}
                            mb='5vh'
                          />
                          <GenericInput
                            type='text'
                            placeholder='Nro Convenio'
                            label='Nro Convenio'
                            width={{ base: '100%', md: '35%' }}
                            mb='5vh'
                            value={nroConvenio}
                            onChange={(e) => setNroConvenio(e.target.value)}
                          />

                          <Box display='flex' justifyContent='flex-end' width='20%'>
                            <Button colorScheme='blue' variant='outline' onClick={agregarConvenio}>
                        Agregar
                            </Button>
                          </Box>
                        </Box>
                      </Box>

                      <Tabla
                        columnas={['Tipo', 'Número', 'Eliminar']}
                        datos={convenios?.map((item, index) => {
                          return [
                            <div key={`tipo-${index}`} {...register(`convenios[${index}]`, { value: item })}>{item.tipoConvenio}</div>,
                            <span key={`nro-${index}`}>{item.nroConvenio}</span>,
                            <DeleteIcon
                              key={`delete-${index}`}
                              cursor={'pointer'}
                              onClick={() => {
                                eliminarConvenio(index);
                              }}
                            />,
                          ];
                        })}
                        paginado={false}
                      />
                    </Box>
                  </CardBody>
                </Card>
                <br />

                <Card width='100%'>
                  <CardBody>
                    <Text fontSize='md' fontWeight='bold'>Ingrese los datos del convenio {tipoFinanciamiento === 'true' ? 'con' : 'sin'} financiamiento</Text>
                    <br />
                    <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                      {tipoFinanciamiento === 'true' && (
                        <Box display='flex' width='75%' alignItems='center' justifyContent='center' flexDirection='column'>
                          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                            <GenericInput
                              name='titulo'
                              placeholder='Título'
                              register={register}
                              errors={errors}
                              label='Título'
                              width={{ base: '100%', md: '47.5%' }}
                              mb='5vh'
                              isRequired
                            />
                            <GenericInput
                              name='beneficiario'
                              placeholder='Nombre del beneficiario'
                              register={register}
                              errors={errors}
                              label='Nombre del beneficiario'
                              width={{ base: '100%', md: '47.5%' }}
                              mb='5vh'
                              isRequired
                            />
                          </Box>
                          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                            <GenericInput
                              type='number'
                              name='monto'
                              placeholder='Monto'
                              register={register}
                              errors={errors}
                              label='Monto'
                              width={{ base: '100%', md: '47.5%' }}
                              mb='5vh'
                              isRequired
                            />
                            <GenericInput
                              type='number'
                              name='desembolsos'
                              placeholder='Cantidad de desembolsos'
                              register={register}
                              errors={errors}
                              label='Cantidad de desembolsos'
                              width={{ base: '100%', md: '47.5%' }}
                              mb='5vh'
                              isRequired
                            />
                          </Box>

                          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                            <GenericInput
                              type='date'
                              name='presentacion'
                              register={register}
                              errors={errors}
                              label='Presentación'
                              width={{ base: '100%', md: '47.5%' }}
                              mb='5vh'
                              isRequired
                            />
                            <GenericInput
                              type='date'
                              name='adjudicacion'
                              register={register}
                              errors={errors}
                              label='Adjudicación'
                              width={{ base: '100%', md: '47.5%' }}
                              mb='5vh'
                            />
                          </Box>
                          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                            <GenericInput
                              type='number'
                              name='plazoEjecucion'
                              placeholder='Plazo de ejecución'
                              register={register}
                              errors={errors}
                              label='Plazo de ejecución (meses)'
                              width={{ base: '100%', md: '100%' }}
                              mb='5vh'
                              isRequired
                            />
                          </Box>
                        </Box>
                      )}

                      {tipoFinanciamiento === 'false' && (
                        <Box display='flex' width='75%' alignItems='center' justifyContent='center' flexDirection='column'>
                          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                            <GenericInput
                              type='date'
                              name='fechaInicio'
                              register={register}
                              errors={errors}
                              label='Inicio'
                              width={{ base: '100%', md: '47.5%' }}
                              mb='5vh'
                              isRequired
                            />
                            <GenericInput
                              type='date'
                              name='fechaCierre'
                              register={register}
                              errors={errors}
                              label='Cierre'
                              width={{ base: '100%', md: '47.5%' }}
                              mb='5vh'
                              isRequired
                            />
                          </Box>
                          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                            <GenericInput
                              textArea
                              name='descripcion'
                              placeholder='Descripción'
                              register={register}
                              errors={errors}
                              label='Descripción'
                              width='100%'
                              mb='5vh'
                              isRequired
                            />
                          </Box>
                        </Box>
                      )}
                    </Box>
                    <Box
                      display='flex'
                      width='100%'
                      alignItems='center'
                      justifyContent='flex-end'
                    >
                      <Button colorScheme='gray' variant='outline' onClick={handleCancel} mr='5%'>
                  Cancelar
                      </Button>
                      <Button onClick={openModal} isLoading={isLoadingMutation} colorScheme='blue' variant='outline' ml='5%'>
                  Guardar
                      </Button>
                      <CustomModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        guardar={true}
                        title='Guardar nueva Vinculación'
                        content='¿Está seguro que desea guardar la nueva vinculación?'
                        onSave={handleSubmit(onSubmit)}
                      />
                    </Box>
                  </CardBody>
                </Card>
              </>
            )}
          </Box>
        </form>
      </CardBody>
    </Card>
  );
}
