import React, { useState } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import { useModificarGrupoForm } from '../../hooks/forms/useModificarGrupoForm';
import FormLayout from '../../components/FormLayout';
import FormButtons from '../../components/FormButtons';
import ErrorAlert from '../../components/ErrorAlert';

export default function ModificarGrupo() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    grupoError,
    error,
    isLoading,
    handleCancel,
    onSubmit,
  } = useModificarGrupoForm();

  const openModal = () => {
    const isValid = !Object.keys(errors).length;
    if (isValid) {
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSubmitAndClose = (data) => {
    setIsOpen(false);
    onSubmit(data);
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
      title='Modificar Datos del Grupo'
      description='Ingrese los datos del grupo'
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
          {/* Campos del formulario */}
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
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

            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                name='siglas'
                label='Siglas'
                placeholder='Siglas'
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
                name='resolucion'
                label='Resolución'
                placeholder='Resolución'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb='5vh'
              />
            </Box>
            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                type='date'
                name='fechaCreacion'
                label='Fecha'
                placeholder='Fecha'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb='5vh'
              />
            </Box>
          </Box>

          {/* Mostrar errores */}
          <ErrorAlert
            error={grupoError && {
              title: 'Error al cargar grupo',
              message: 'No se pudieron cargar los datos del grupo. Intente recargar la página.',
            }}
          />

          <ErrorAlert error={error} />

          {/* Botones */}
          <FormButtons
            onCancel={handleCancel}
            onSubmit={openModal}
            isLoading={isSubmitting}
            isDisabled={!!grupoError}
          />

          {/* Modal de confirmación */}
          <CustomModal
            isOpen={isOpen}
            onClose={closeModal}
            guardar={true}
            title='Guardar datos'
            content='Se guardara los nuevos datos del grupo'
            onSave={handleSubmit(handleSubmitAndClose)}
          />
        </Box>
      </form>
    </FormLayout>
  );
}
