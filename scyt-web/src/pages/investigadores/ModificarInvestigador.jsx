import React, { useState } from 'react';
import { Box, Spinner, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import { useModificarInvestigadorForm } from '../../hooks/useModificarInvestigadorForm';
import FormLayout from '../../components/FormLayout';
import ErrorAlert from '../../components/ErrorAlert';
import FormButtons from '../../components/FormButtons';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';

export default function ModificarInvestigador() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    error,
    gruposOptions,
    gruposLoading,
    gruposError,
    investigadorError,
    handleCancel,
    onSubmitRaw,
    clearError,
    isLoading,
  } = useModificarInvestigadorForm();

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

  const onModalSubmit = async(data) => {
    closeModal();
    try {
      await onSubmitRaw(data);
    } catch (error) {
      // El error ya se maneja en el hook
      console.error('Error en submit:', error);
    }
  };

  // Mostrar spinner mientras carga
  if (isLoading) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  return (
    <FormLayout
      title='Modificar datos del Investigador'
      description='Ingrese los datos del investigador'
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
          {/* Campos del formulario */}
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                name='apellido'
                label='Apellido'
                placeholder='Apellido'
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
                placeholder='Nombre'
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
                placeholder='DNI'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb='5vh'
              />
            </Box>

            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericSelect
                type='number'
                name='idGrupoInvestigacion'
                label='Grupo'
                placeholder='Grupo...'
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
              <FormControl width={{ base: '100%', md: '50%' }}>
                <FormLabel>Estado del Investigador</FormLabel>
                <Switch
                  {...register('activo')}
                  isChecked={watch('activo')}
                  colorScheme='green'
                  size='lg'
                />
                <Box mt={2} fontSize='sm' color='gray.600'>
                  {watch('activo') ? 'Investigador activo' : 'Investigador inactivo'}
                </Box>
              </FormControl>
            </Box>
          </Box>

          {/* Mostrar errores */}
          <ErrorAlert
            error={investigadorError && {
              title: 'Error al cargar investigador',
              message: 'No se pudieron cargar los datos del investigador. Intente recargar la página.',
            }}
          />

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
            isDisabled={gruposLoading || !!gruposError || !!investigadorError}
          />

          {/* Modal de confirmación */}
          <CustomModal
            isOpen={isOpen}
            onClose={closeModal}
            guardar={true}
            title='Guardar datos'
            content='¿Está seguro que desea guardar los nuevos datos del investigador?'
            onSave={handleSubmit(onModalSubmit)}
          />
        </Box>
      </form>
    </FormLayout>
  );
}
