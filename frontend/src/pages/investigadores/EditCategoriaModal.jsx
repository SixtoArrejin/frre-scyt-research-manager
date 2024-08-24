import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useToast, Box } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCategoriaById, putCategoriaById } from '../../utils/api/categoriasApi';
import { useForm } from 'react-hook-form';
import GenericInput from '../../components/formControls/GenericInput';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';
import GenericSelect from '../../components/formControls/GenericSelect';

const COMISIONES = [
  'Ingeniería',
  'Educación',
  'Antropología',
  'Ciencias de la Tierra, el Mar y la Atmosfera',
  'Química, Bioquímica y Farmacia',
  'Ciencias Básicas y Aplicadas',
];

export default function EditCategoriaModal({ isOpen, onClose, guardar = false, title, onSave, eliminar = false, categoria = null }) {
  const { data, isLoading, error } = useQuery(['categoria', categoria.idCategoria], () => getCategoriaById(categoria.idCategoria));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha: formatoFechaISOaAAAAMMDD(categoria?.fecha),
      categoria: categoria?.categoria,
      comision: categoria?.comision,
      normativa: categoria?.normativa,
    },
  });
  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => putCategoriaById(categoria.idCategoria, formData),
    onSuccess: () => {
      queryClient.refetchQueries(['persona']);
      toast({
        title: 'Modificar Cateogria',
        description: `Se ha modificado la categoria exitosamente.`,
        status: 'success',
        isClosable: true,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: 'Error al modificar los datos de la categoria',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  });
  const onSub = (values) => {
    // console.log(values);
    mutate(values);
  };
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg='blackAlpha.400' backdropFilter='blur(2px) hue-rotate(90deg)' />
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
              name='categoria'
              label='Categoria'
              placeholder='Seleccione categoria...'
              width={{ base: '100%', md: '47.5%' }}
              mb='5vh'
              isRequired
              register={register}
              options={['I', 'II', 'III', 'IV', 'V'].map((option) => ({
                value: option,
                label: option,
              }))}
              errors={errors}
            />
          </Box>
          <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
            <GenericInput
              name='normativa'
              label='Resolución'
              register={register}
              errors={errors}
              width={{ base: '100%', md: '47.5%' }}
              isRequired
              mb='5vh'
            />
            <GenericSelect
              name='comision'
              label='Comisión'
              placeholder='Seleccione la comisión...'
              width={{ base: '100%', md: '47.5%' }}
              mb='5vh'
              isRequired
              register={register}
              options={COMISIONES.map((comision) => ({
                value: comision,
                label: comision,
              }))}
              errors={errors}
            />
          </Box>
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
