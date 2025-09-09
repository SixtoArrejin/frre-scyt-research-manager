import React, { useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { useForm } from 'react-hook-form';
import { createPersona } from '../../utils/api/personasApi';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomModal from '../../components/CustomModal';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericInput from '../../components/formControls/GenericInput';

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  apellido: yup.string().required('El apellido es requerido'),
  dni: yup
    .mixed()
    .required('El DNI es requerido')
    .test('NaN', 'El DNI es requerido', (val) => !isNaN(val))
    .test('lenDNI', 'El DNI debe tener 8 dígitos', (val) => val.toString().length == 8),
  idGrupoInvestigacion: yup.number().required('Indique a que grupo pertenece'),
});

export default function NuevoInvestigador() {
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toast = useToast();
  const navigate = useNavigate();

  const { data, isLoading: isLoadingGetGrupos, error } = useQuery('grupos', () => getAllGrupos());

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => createPersona(formData),
    onSuccess: () => {
      toast({
        title: 'Nuevo investigador',
        description: `Se ha creado el nuevo investigador exitosamente`,
        status: 'success',
        isClosable: true,
      });
      // navigate(`/investigadores/5`);
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al cargar el investigador',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      dni: null,
      idGrupoInvestigacion: null,
      activo: true,
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (dataForm, event) => {
    console.log(dataForm);
    event.preventDefault();
    mutate(dataForm);
  };

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Nuevo Investigador
          </Heading>

          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Ingrese los datos del investigador</Text>
              <br />
              <form onSubmit={handleSubmit((values) => mutate(values))}>
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
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
                        name='idGrupoInvestigacion'
                        label='Grupo'
                        placeholder='Grupo...'
                        width={{ base: '100%', md: '50%' }}
                        mb='5vh'
                        isRequired
                        register={register}
                        options={data?.grupos.map((grupo) => ({
                          value: grupo.idGrupoInvestigacion,
                          label: grupo.siglas,
                        }))}
                        errors={errors}
                      />
                    </Box>
                  </Box>

                  <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end'>
                    <Button colorScheme='gray' variant='outline' onClick={() => navigate(-1)} mr='3%'>
                      Cancelar
                    </Button>
                    <Button onClick={openModal} isLoading={isLoading} colorScheme='blue' variant='outline'>
                      Guardar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Guardar nuevo investigador'
                      content='Se guardara el nuevo investigador'
                      onSave={handleSubmit((values) => mutate(values))}
                    />
                  </Box>
                </Box>
              </form>
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
