import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { useNuevoInvestigadorForm } from '../../hooks/forms/useNuevoInvestigadorForm';
import FormLayout from '../../components/FormLayout';
import ErrorAlert from '../../components/ErrorAlert';
import FormButtons from '../../components/FormButtons';
import CustomModal from '../../components/CustomModal';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericInput from '../../components/formControls/GenericInput';

export default function NuevoInvestigador() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    error,
    gruposOptions,
    gruposLoading,
    gruposError,
    handleCancel,
    submitHandler,
    clearError,
  } = useNuevoInvestigadorForm();

  const openModal = () => {
    clearError();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    handleSubmit(() => {
      clearError();
      openModal();
    }, (errors) => {
      console.log('Errores de validación:', errors);
    })();
  };

  const onSubmit = (data) => {
    closeModal();
    submitHandler(data);
  };

  return (
    <FormLayout
      title='Nuevo Investigador'
      description='Ingrese los datos del investigador'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
          {/* Campos del formulario */}
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                name='apellido'
                label='Apellido'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb='5vh'
              />
            </Box>

            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                name='nombre'
                label='Nombre'
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
                type='number'
                name='dni'
                label='DNI'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb='5vh'
              />
            </Box>

            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericSelect
                name='idGrupoInvestigacion'
                label='Grupo'
                placeholder='Seleccione un grupo...'
                width={{ base: '100%', md: '50%' }}
                mb='5vh'
                isRequired
                register={register}
                options={gruposOptions}
                errors={errors}
                isDisabled={gruposLoading || !!gruposError}
              />
            </Box>
          </Box>

          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                type='date'
                name='fechaIngresoGrupo'
                label='Fecha de Ingreso al Grupo'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb='5vh'
              />
            </Box>
            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              {/* Espacio vacío para mantener el layout */}
            </Box>
          </Box>

          {/* Mostrar errores */}
          <ErrorAlert
            error={gruposError && {
              title: 'Error al cargar grupos',
              message: 'No se pudieron cargar los grupos de investigación. Intente recargar la página.',
            }}
          />

          <ErrorAlert error={error} />

          {/* Botones */}
          <FormButtons
            onCancel={handleCancel}
            onSubmit={handleOpenModal}
            isLoading={isSubmitting}
            isDisabled={gruposLoading || !!gruposError}
          />

          {/* Modal de confirmación */}
          <CustomModal
            isOpen={isOpen}
            onClose={closeModal}
            guardar={true}
            title='Guardar nuevo investigador'
            content='¿Está seguro que desea guardar el nuevo investigador?'
            onSave={handleSubmit(onSubmit)}
          />
        </Box>
      </form>
    </FormLayout>
  );
}
