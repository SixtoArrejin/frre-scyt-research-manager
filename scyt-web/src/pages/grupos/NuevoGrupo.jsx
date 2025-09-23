import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import { useNuevoGrupoForm } from '../../hooks/forms/useNuevoGrupoForm';
import FormLayout from '../../components/FormLayout';
import FormButtons from '../../components/FormButtons';

export default function NuevoGrupo() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    handleCancel,
    submitHandler,
    clearError,
  } = useNuevoGrupoForm();

  const onSubmit = (data) => {
    closeModal();
    submitHandler(data);
  };

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

  return (
    <FormLayout title='Nuevo Grupo de Investigación' description='Ingrese los datos del grupo'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
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

            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                name='siglas'
                label='Siglas'
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
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb='5vh'
              />
            </Box>
            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                name='fechaCreacion'
                label='Fecha Creación'
                type='date'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '50%' }}
                isRequired
                mb='5vh'
              />
            </Box>
          </Box>

          <FormButtons
            onCancel={handleCancel}
            onSubmit={handleOpenModal}
            isLoading={false}
          />

          <CustomModal
            isOpen={isOpen}
            onClose={closeModal}
            guardar={true}
            title='Guardar nuevo grupo'
            content='Se guardara el nuevo grupo'
            onSave={handleSubmit(onSubmit)}
          />
        </Box>
      </form>
    </FormLayout>
  );
}
