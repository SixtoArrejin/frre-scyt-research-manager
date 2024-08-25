import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useToast, Box } from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import { useParams } from 'react-router-dom';
import { createConvenio } from '../../utils/api/vinculacionesApi';

export default function NuevoConvenioModal({ isOpen, onClose, title, onSave, categoria = null }) {
  const { idVinculacion } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idVinculacion: parseInt(idVinculacion),
      tipoConvenio: '',
      nroConvenio: null,
    },
  });

  const toast = useToast();
  const queryClient = useQueryClient();

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => createConvenio(formData),
    onSuccess: () => {
      queryClient.refetchQueries(['vinculacion', idVinculacion]);
      toast({
        title: 'Nuevo Convenio',
        description: `Se ha agregado el convenio exitosamente.`,
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
    console.log(values);
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
            <GenericSelect
              key={`${categoria?.idCategoria}`} // Cambia la key cada vez que se modifica la categoría o el tipo
              name='tipoConvenio'
              label='Tipo'
              placeholder='Seleccione el tipo...'
              width={{ base: '100%', md: '47.5%' }}
              isRequired
              register={register}
              options={['Especifico', 'Colaboración', 'Otro...'].map((option) => ({
                value: option,
                label: option,
              }))}
              errors={errors}
            />
            <GenericInput
              type='number'
              name='nroConvenio'
              label='Número'
              placeholder='Número'
              register={register}
              errors={errors}
              width={{ base: '100%', md: '47.5%' }}
              isRequired
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cerrar</Button>
          <Button ml={2} isLoading={isLoadingMutation} onClick={handleSubmit((values) => onSub(values))} colorScheme='blue'>
            Guardar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
