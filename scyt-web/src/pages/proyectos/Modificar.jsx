import React from 'react';
import { Spinner, Box } from '@chakra-ui/react';
import { useModificarProyectoForm } from '../../hooks/forms/useModificarProyectoForm';
import FormLayout from '../../components/FormLayout';
import FormButtons from '../../components/FormButtons';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericRadio from '../../components/formControls/GenericRadio';

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
            >
              {esPid && (
                <GenericInput
                  name="codPid"
                  label="Código PID"
                  placeholder="Código PID"
                  register={register}
                  errors={errors}
                  width={{ base: '100%', md: '30%' }}
                  isRequired
                  mb={4}
                />
              )}

              <GenericSelect
                name="regional"
                label="Regional asociada"
                placeholder="Regional..."
                width={esPid ? { base: '100%', md: '65%' } : '100%'}
                mb={4}
                isRequired
                register={register}
                options={regionalesOptions}
                errors={errors}
              />
            </Box>

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
                isRequired
                mb={4}
              />
              <GenericInput
                type="date"
                name="fechaFin"
                label="Fecha Fin"
                register={register}
                errors={errors}
                width={{ base: '100%', md: '30%' }}
                isRequired
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
                isRequired
                register={register}
                options={tiposProyectoOptions}
                errors={errors}
              />
            </Box>

            {/* Campos específicos para proyectos externos */}
            {!esPid && (
              <GenericInput
                name="empresaInstitucion"
                label="Empresa/Institución"
                placeholder="Empresa/Institución"
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb={4}
              />
            )}

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
