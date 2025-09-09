import React, { useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useToast, Box } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { putCategoriaById } from '../../utils/api/categoriasApi';
import { useForm, useWatch } from 'react-hook-form';
import GenericInput from '../../components/formControls/GenericInput';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericRadio from '../../components/formControls/GenericRadio';

const COMISIONES = [
  'Ingeniería',
  'Educación',
  'Antropología',
  'Ciencias de la Tierra, el Mar y la Atmosfera',
  'Química, Bioquímica y Farmacia',
  'Ciencias Básicas y Aplicadas',
];

const catUTN = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const catMIN = ['I', 'II', 'III', 'IV', 'V'];

export default function EditCategoriaModal({ isOpen, onClose, guardar = false, title, onSave, eliminar = false, categoria = null }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      fecha: '',
      categoria: '',
      comision: '',
      normativa: '',
      tipo: '',
      equiparacion: '',
    },
  });

  useEffect(() => {
    if (categoria) {
      reset({
        fecha: formatoFechaISOaAAAAMMDD(categoria.fecha),
        categoria: categoria.categoria,
        comision: categoria.comision,
        normativa: categoria.normativa,
        tipo: categoria.tipo,
        equiparacion: categoria.equiparacion ? 'true' : 'false',
      });
    }
  }, [categoria, reset]);

  const tipoCategoria = useWatch({ control, name: 'tipo' });

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
    const modifiedValues = {
      ...values,
      equiparacion: values.equiparacion === 'true',
    };
    mutate(modifiedValues);
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
              key={`${categoria?.idCategoria}-${tipoCategoria}`} // Cambia la key cada vez que se modifica la categoría o el tipo
              name='categoria'
              label='Categoria'
              placeholder='Seleccione categoria...'
              width={{ base: '100%', md: '47.5%' }}
              mb='5vh'
              isRequired
              register={register}
              options={(tipoCategoria === 'ministerio' ? catMIN : catUTN).map((option) => ({
                value: option,
                label: option,
              }))}
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
              options={COMISIONES.map((comision) => ({
                value: comision,
                label: comision,
              }))}
              errors={errors}
            />
          </Box>
          {tipoCategoria === 'utn' && (
            <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='center'>
              <GenericRadio
                name='equiparacion'
                label='Equiparación:'
                direction='row'
                options={[
                  { value: 'true', label: 'Si' },
                  { value: 'false', label: 'No' },
                ]}
                register={register}
                defaultValue={categoria?.equiparacion ? 'true' : 'false'}
                errors={errors}
                mt='5vh'
              />
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
