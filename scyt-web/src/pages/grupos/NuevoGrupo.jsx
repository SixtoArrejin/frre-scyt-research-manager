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
          {/* Primera fila: Nombre del grupo (TextArea 100%) */}
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <GenericInput
              textArea
              name='nombre'
              label='Nombre del Grupo'
              placeholder='Ej: Centro de Investigación Aplicada a Tecnologías de la Información y la Comunicación'
              register={register}
              errors={errors}
              width={{ base: '100%', md: '100%' }}
              isRequired
              mb='5vh'
            />
          </Box>

          {/* Segunda fila: Siglas (30%), Resolución (30%), Fecha Creación (30%) */}
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <Box display='flex' flexDirection='column' width={{ base: '100%', md: '30%' }} alignItems='center' justifyContent='center'>
              <GenericInput
                name='siglas'
                label='Siglas'
                placeholder='Ej: CINAPTIC'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '100%' }}
                isRequired
                mb='5vh'
              />
            </Box>

            <Box display='flex' flexDirection='column' width={{ base: '100%', md: '30%' }} alignItems='center' justifyContent='center'>
              <GenericInput
                name='resolucion'
                label='Resolución'
                placeholder='Ej: RES-001/2023'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '100%' }}
                isRequired
                mb='5vh'
              />
            </Box>

            <Box display='flex' flexDirection='column' width={{ base: '100%', md: '30%' }} alignItems='center' justifyContent='center'>
              <GenericInput
                name='fechaCreacion'
                label='Fecha de Creación'
                type='date'
                register={register}
                errors={errors}
                width={{ base: '100%', md: '100%' }}
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
