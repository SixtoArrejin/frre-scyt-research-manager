import React from 'react';
import { Spinner, Box, Card, CardBody, Text, Button } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useModificarProyectoForm, tipoProyectosInterinstitucionales } from '../../hooks/forms/useModificarProyectoForm';
import { TRL_OPTIONS } from '../../config/trl';
import FormLayout from '../../components/FormLayout';
import FormButtons from '../../components/FormButtons';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericRadio from '../../components/formControls/GenericRadio';
import Tabla from '../../components/Tabla';

export default function ModificarPIDs() {
  const {
    // Datos del proyecto
    dataProyecto,
    esPid,

    // Estados
    estado,
    setEstado,
    isModalOpen,

    // Formulario
    register,
    handleSubmit,
    errors,
    watch,
    onSubmit,

    // Loading states
    isLoading,
    isLoadingMutation,

    // Opciones para selects
    regionalesOptions,
    tiposProyectoOptions,
    tipoActividadOptions,
    estadoProyectoOptions,
    dataRegionales,

    // Instituciones asociadas
    selectedTipoProyecto,
    handleTipoProyectoChange,
    institucionesSeleccionadas,
    selectedInstitucion,
    setSelectedInstitucion,
    otraInstitucion,
    setOtraInstitucion,
    agregarInstitucion,
    eliminarInstitucion,

    // Funciones de modal
    openModal,
    closeModal,

    // Navegación
    handleCancel,
  } = useModificarProyectoForm();

  if (isLoading) {
    return (
      <Box
        display="flex"
        height="calc(100vh - 80px - 16px - 1px - 16px)"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  return (
    <FormLayout title="Modificar datos del Proyecto" subtitle="Datos del proyecto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          display="flex"
          width="100%"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box
            display="flex"
            width="70%"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            {/* Campos básicos */}
            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              width="100%"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <Box
                width={{ base: '100%', md: '30%' }}
                display="flex"
                alignItems="center"
              >
                <GenericRadio
                  name="tipo"
                  label="Tipo de proyecto:"
                  direction="row"
                  options={[
                    { value: 'pid', label: 'PID' },
                    { value: 'externo', label: 'Externo' },
                  ]}
                  register={register}
                  value={watch('tipo')}
                  errors={errors}
                  width="100%"
                />
              </Box>

              {esPid && (
                <GenericInput
                  name="codPid"
                  label="Código PID"
                  placeholder="Código PID"
                  register={register}
                  errors={errors}
                  width={{ base: '100%', md: '65%' }}
                  isRequired
                />
              )}
            </Box>

            <GenericSelect
              name="regional"
              label="Regional asociada"
              placeholder="Regional..."
              width="100%"
              mb={4}
              isRequired
              register={register}
              options={regionalesOptions}
              errors={errors}
            />

            <GenericInput
              textArea
              name="denominacion"
              label="Denominación"
              placeholder="Denominación"
              register={register}
              errors={errors}
              width="100%"
              isRequired
              mb={4}
            />

            <GenericInput
              textArea
              name="descripcionBreve"
              label="Descripción Breve"
              placeholder="Descripción breve del proyecto"
              register={register}
              errors={errors}
              width="100%"
              mb={4}
            />

            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <GenericInput
                type="date"
                name="fechaInicio"
                label="Fecha Inicio"
                register={register}
                errors={errors}
                width={{ base: '100%', md: '30%' }}
                mb={4}
              />
              <GenericInput
                type="date"
                name="fechaFin"
                label="Fecha Fin"
                register={register}
                errors={errors}
                width={{ base: '100%', md: '30%' }}
                mb={4}
              />

              <GenericInput
                type="number"
                name="convocatoria"
                label="Convocatoria"
                placeholder="Convocatoria"
                register={register}
                errors={errors}
                width={{ base: '100%', md: '30%' }}
                isRequired
                mb={4}
              />
            </Box>

            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <GenericInput
                name="programa"
                label="Programa"
                placeholder="Programa"
                register={register}
                errors={errors}
                width={{ base: '100%', md: '47.5%' }}
                isRequired
                mb={4}
              />

              <GenericSelect
                name="tipoProyecto"
                label="Tipo de proyecto"
                placeholder="Tipo de proyecto..."
                width={{ base: '100%', md: '47.5%' }}
                mb={4}
                isRequired={esPid}
                register={register}
                options={tiposProyectoOptions}
                errors={errors}
                onChange={handleTipoProyectoChange}
              />
            </Box>

            <Box
              display="flex"
              flexDirection={{ base: 'column', md: 'row' }}
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <GenericSelect
                name="trl"
                label="Nivel TRL"
                placeholder="Seleccione TRL..."
                width={{ base: '100%', md: !esPid ? '47.5%' : '100%' }}
                mb={4}
                register={register}
                options={TRL_OPTIONS}
                errors={errors}
              />

              {!esPid && (
                <GenericInput
                  name="empresaInstitucion"
                  label="Empresa/Institución"
                  placeholder="Empresa/Institución"
                  register={register}
                  errors={errors}
                  width={{ base: '100%', md: '47.5%' }}
                  isRequired
                  mb={4}
                />
              )}
            </Box>

            {/* Campos específicos para proyectos PID */}
            {esPid && (
              <>
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <GenericSelect
                    name="tipoActividad"
                    label="Tipo de actividad"
                    placeholder="Tipo de actividad..."
                    width={{ base: '100%', md: '30%' }}
                    mb={4}
                    isRequired
                    register={register}
                    options={tipoActividadOptions}
                    errors={errors}
                  />
                  <GenericSelect
                    name="estado"
                    label="Estado"
                    placeholder="Estado..."
                    width={{
                      base: '100%',
                      md: estado === 'HOMOLOGADO' ? '30%' : '65%',
                    }}
                    mb={4}
                    isRequired
                    register={register}
                    options={estadoProyectoOptions}
                    errors={errors}
                    onChange={(e) => setEstado(e.target.value)}
                  />

                  {estado === 'HOMOLOGADO' && (
                    <GenericInput
                      name="disposicion"
                      label="Disposición"
                      placeholder="Disposición"
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '30%' }}
                      isRequired={estado === 'HOMOLOGADO'}
                      mb={4}
                    />
                  )}
                </Box>

                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box
                    width={{ base: '100%', md: '50%' }}
                    display="flex"
                    justifyContent="center"
                  >
                    <GenericRadio
                      name="prorrogado"
                      label="Prorroga:"
                      direction="row"
                      options={[
                        { value: 'true', label: 'Si' },
                        { value: 'false', label: 'No' },
                      ]}
                      register={register}
                      defaultValue={
                        dataProyecto?.proyecto?.prorrogado ? 'true' : 'false'
                      }
                      errors={errors}
                      mb={4}
                    />
                  </Box>

                  <Box
                    width={{ base: '100%', md: '50%' }}
                    display="flex"
                    justifyContent="center"
                  >
                    <GenericRadio
                      name="completo"
                      label="Completo:"
                      direction="row"
                      options={[
                        { value: 'true', label: 'Si' },
                        { value: 'false', label: 'No' },
                      ]}
                      register={register}
                      defaultValue={
                        dataProyecto?.proyecto?.completo ? 'true' : 'false'
                      }
                      errors={errors}
                      mb={4}
                    />
                  </Box>
                </Box>

                {watch('prorrogado') === 'true' && (
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <GenericInput
                      name="nuevaFechaFin"
                      type="date"
                      register={register}
                      placeholder="Nueva Fecha Finalización"
                      label="Nueva Fecha Finalización"
                      width={{
                        base: '100%',
                        md: estado === 'HOMOLOGADO' ? '47.5%' : '100%',
                      }}
                      mb={4}
                      isRequired={watch('prorrogado') === 'true'}
                    />
                    {estado === 'HOMOLOGADO' && (
                      <GenericInput
                        name="nuevaDisposicion"
                        placeholder="Nueva Disposición"
                        register={register}
                        label="Nueva Disposición"
                        width={{ base: '100%', md: '46.25%' }}
                        mb={4}
                        isRequired={
                          estado === 'HOMOLOGADO' &&
                      watch('prorrogado') === 'true'
                        }
                      />
                    )}
                  </Box>
                )}
              </>
            )}

            {tipoProyectosInterinstitucionales?.includes(selectedTipoProyecto) && (
              <Card width="100%" mt={6} mb={6}>
                <CardBody>
                  <Text fontSize="md" fontWeight="bold">
                    {selectedTipoProyecto === 'PID Interfacultad' || selectedTipoProyecto?.includes('Multifacultad')
                      ? 'Agregar facultades regionales asociadas'
                      : 'Agregar instituciones asociadas'}
                  </Text>
                  <br />
                  <Box
                    display="flex"
                    flexDirection="column"
                    width="100%"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box display="flex" width="100%">
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="45%"
                        gap="2%"
                      >
                        <GenericSelect
                          placeholder={
                            selectedTipoProyecto === 'PID Interfacultad' || selectedTipoProyecto?.includes('Multifacultad')
                              ? 'Seleccione facultad regional...'
                              : 'Instituciones...'
                          }
                          isSearchable={true}
                          options={[
                            ...(dataRegionales?.regionales?.map((regional) => ({
                              value: regional,
                              label: regional,
                            })) || []),
                            { value: 'Otro', label: 'Otro' },
                          ]}
                          value={selectedInstitucion}
                          onChange={(e) => {
                            setSelectedInstitucion(e.target.value);
                          }}
                        />
                        {selectedInstitucion === 'Otro' && (
                          <GenericInput
                            placeholder={
                              selectedTipoProyecto === 'PID Interfacultad' || selectedTipoProyecto?.includes('Multifacultad')
                                ? 'Nombre de la facultad regional...'
                                : 'Nombre de la institución...'
                            }
                            value={otraInstitucion}
                            onChange={(e) => {
                              setOtraInstitucion(e.target.value);
                            }}
                          />
                        )}
                      </Box>
                      <Box display="flex" justifyContent="flex-end" width="55%">
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          onClick={agregarInstitucion}
                        >
                          Agregar
                        </Button>
                      </Box>
                    </Box>
                    <br />
                    {institucionesSeleccionadas?.length > 0 && (
                      <Box width="100%">
                        <Tabla
                          columnas={[
                            selectedTipoProyecto === 'PID Interfacultad' || selectedTipoProyecto?.includes('Multifacultad')
                              ? 'Facultad Regional'
                              : 'Institución',
                            'Eliminar',
                          ]}
                          datos={institucionesSeleccionadas.map((item) => [
                            item,
                            <DeleteIcon
                              key={`del-${item}`}
                              cursor="pointer"
                              onClick={() => eliminarInstitucion(item)}
                            />,
                          ])}
                          paginado={false}
                        />
                      </Box>
                    )}
                  </Box>
                </CardBody>
              </Card>
            )}

            <FormButtons
              cancelText="Cancelar"
              submitText="Aceptar"
              isLoading={isLoadingMutation}
              onCancel={handleCancel}
              onSubmit={openModal}
            />

            <CustomModal
              isOpen={isModalOpen}
              onClose={closeModal}
              guardar={true}
              title="Se modificarán los datos del proyecto."
              content="¿Seguro que desea modificar la información del proyecto?"
              onSave={handleSubmit(onSubmit)}
            />
          </Box>
        </Box>
      </form>
    </FormLayout>
  );
}
