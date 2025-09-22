import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import CustomModal from '../../components/CustomModal';
import GenericRadio from '../../components/formControls/GenericRadio';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericInput from '../../components/formControls/GenericInput';
import { useNuevaCategoriaForm } from '../../hooks/forms/useNuevaCategoriaForm';
import FormLayout from '../../components/FormLayout';
import FormButtons from '../../components/FormButtons';

export default function NuevaCategoria() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    tipoCategoriaSeleccionada,
    categoriaOptions,
    comisionOptions,
    handleCancel,
    submitHandler,
    clearError,
  } = useNuevaCategoriaForm();

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
    <FormLayout title='Nueva Categoria' description='Datos de categoria'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericRadio
                name='tipo'
                label='Tipo de categoria:'
                direction='row'
                options={[
                  { value: 'ministerio', label: 'Ministerio' },
                  { value: 'utn', label: 'UTN' },
                ]}
                register={register}
                defaultValue='ministerio'
                errors={errors}
                mb='5vh'
              />
            </Box>

            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <FormControl width={{ base: '100%', md: '50%' }} mb='5vh'>
                <FormLabel>Equiparación</FormLabel>
                <Box display='flex' alignItems='center' gap={4}>
                  <Switch
                    {...register('equiparacion')}
                    isChecked={watch('equiparacion')}
                    colorScheme='green'
                    size='lg'
                    isDisabled={tipoCategoriaSeleccionada == 'ministerio'}
                  />
                  <Box fontSize='md' color='gray.600'>{watch('equiparacion') ? 'Si' : 'No'}</Box>
                </Box>
              </FormControl>
            </Box>
          </Box>

          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericSelect
                name='categoria'
                label='Categoria'
                placeholder='Seleccione categoria...'
                width={{ base: '100%', md: '50%' }}
                mb='5vh'
                isRequired
                register={register}
                options={categoriaOptions}
                errors={errors}
              />
            </Box>

            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                name='normativa'
                label='Resolución'
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
              <GenericSelect
                name='comision'
                label='Comisión'
                placeholder='Seleccione la comisión...'
                width={{ base: '100%', md: '50%' }}
                mb='5vh'
                isRequired
                register={register}
                options={comisionOptions}
                errors={errors}
              />
            </Box>

            <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
              <GenericInput
                type='date'
                name='fecha'
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
          <FormButtons
            onCancel={handleCancel}
            onSubmit={handleOpenModal}
            isLoading={false}
          />

          <CustomModal
            isOpen={isOpen}
            onClose={closeModal}
            guardar={true}
            title='Guardar nueva categoria'
            content='Se guardara la nueva categoria'
            onSave={handleSubmit(onSubmit)}
          />
        </Box>
      </form>
    </FormLayout>
  );
}
