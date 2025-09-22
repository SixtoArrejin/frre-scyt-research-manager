import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Box, FormControl, FormLabel, Switch } from '@chakra-ui/react';
import GenericInput from '../../components/formControls/GenericInput';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';
import GenericSelect from '../../components/formControls/GenericSelect';
import { useEditCategoriaForm } from '../../hooks/forms/useEditCategoriaForm';

export default function EditCategoriaModal({ isOpen, onClose, guardar = false, title, onSave, eliminar = false, categoria = null }) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    tipoCategoria,
    categoriaOptions,
    comisionOptions,
    isLoadingMutation,
    submitHandler,
  } = useEditCategoriaForm(categoria, onClose);

  const onSub = (values) => {
    submitHandler(values);
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg='blackAlpha.200' backdropFilter='blur(1px)' />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <GenericInput
              name='fecha'
              label='Fecha'
              type='date'
              defaultValue={formatoFechaISOaAAAAMMDD(categoria?.fecha) || ''}
              register={register}
              errors={errors}
              width={{ base: '100%', md: '47.5%' }}
              isRequired
              mb='5vh'
            />
            <GenericSelect
              key={`${categoria?.idCategoria}-${tipoCategoria}`} // Cambia la key cada vez que se modifica la categoría o el tipo
              name='categoria'
              label='Categoria'
              placeholder='Seleccione categoria...'
              width={{ base: '100%', md: '47.5%' }}
              mb='5vh'
              isRequired
              register={register}
              options={categoriaOptions}
              errors={errors}
            />
          </Box>
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <GenericInput name='normativa' label='Resolución' register={register} errors={errors} width={{ base: '100%', md: '47.5%' }} isRequired />
            <GenericSelect
              name='comision'
              label='Comisión'
              placeholder='Seleccione la comisión...'
              width={{ base: '100%', md: '47.5%' }}
              isRequired
              register={register}
              options={comisionOptions}
              errors={errors}
            />
          </Box>
          {tipoCategoria === 'utn' && (
            <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='center'>
              <FormControl width={{ base: '100%', md: '50%' }} mt='5vh'>
                <FormLabel>Equiparación</FormLabel>
                <Box display='flex' alignItems='center' gap={4}>
                  <Switch
                    {...register('equiparacion')}
                    isChecked={watch('equiparacion')}
                    colorScheme='green'
                    size='lg'
                  />
                  <Box fontSize='md' color='gray.700'>{watch('equiparacion') ? 'Si' : 'No'}</Box>
                </Box>
              </FormControl>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
          {guardar && (
            <Button ml={2} isLoading={isLoadingMutation} onClick={handleSubmit((values) => onSub(values))} colorScheme='blue'>
              Guardar
            </Button>
          )}
          {eliminar && (
            <Button
              ml={2}
              onClick={() => {
                onSave();
                onClose();
              }}
              colorScheme='red'
            >
              Eliminar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
