import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getPersonaById, updatePersona } from '../../utils/api/personasApi';
import { useMutation, useQuery } from 'react-query';
import { getAllGrupos } from '../../utils/api/gruposApi';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericRadio from '../../components/formControls/GenericRadio';

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  apellido: yup.string().required('El apellido es requerido'),
  dni: yup
    .mixed()
    .required('El DNI es requerido')
    .test('NaN', 'El DNI es requerido', (val) => !isNaN(val))
    .test('lenDNI', 'El DNI debe tener 8 dígitos', (val) => val.toString().length == 8),
  idGrupoInvestigacion: yup
    .mixed()
    .required('Indique a que grupo pertenece')
    .test('idNaN', 'Indique a que grupo pertenece', (val) => !isNaN(val)),
  // activo: yup.boolean().required('La comisión es requerida'),
});

export default function ModificarInvestigador() {
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const toast = useToast();

  const { idPersona } = useParams();

  const { data: investigador, isLoading, error: errorInvestigador } = useQuery(['persona'], () => getPersonaById(idPersona));
  const { data: grupos, isLoading: isLoadingGetGrupos, error: errorGrupos } = useQuery('grupos', () => getAllGrupos());

  useEffect(() => {
    setValue('activo', investigador?.persona.activo.toString());
    setValue('nombre', investigador?.persona.nombre);
    setValue('apellido', investigador?.persona.apellido);
    setValue('dni', investigador?.persona.dni);
    setValue('idGrupoInvestigacion', investigador?.persona.idGrupoInvestigacion);
  }, [investigador]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: investigador?.persona?.nombre,
      apellido: investigador?.persona?.apellido,
      dni: investigador?.persona?.dni,
      idGrupoInvestigacion: parseInt(investigador?.persona?.idGrupoInvestigacion),
      activo: investigador?.persona?.activo?.toString(),
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updatePersona(idPersona, formData),
    onSuccess: () => {
      toast({
        title: 'Modificar investigador',
        description: `Se ha modificado el investigador exitosamente`,
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al modificar los datos del investigador',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  const onSubmit = (values) => {
    // Convierte el valor de 'activo' a booleano antes de enviar
    const modifiedValues = {
      ...values,
      activo: values.activo === 'true',
    };
    mutate(modifiedValues);
  };

  if (isLoading) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            MODIFICAR DATOS DEL INVESTIGADOR
          </Heading>

          <br />
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Ingrese los datos del investigador</Text>
              <br />
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
                      type='number'
                      name='idGrupoInvestigacion'
                      label='Grupo'
                      placeholder='Grupo...'
                      width={{ base: '100%', md: '50%' }}
                      mb='5vh'
                      isRequired
                      register={register}
                      options={grupos?.grupos.map((grupo) => ({
                        value: parseInt(grupo.idGrupoInvestigacion),
                        label: grupo.siglas,
                      }))}
                      errors={errors}
                    />
                  </Box>
                </Box>
                <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                  <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                    <GenericRadio
                      name='activo'
                      label='Estado'
                      direction='row'
                      options={[
                        { value: 'true', label: 'Activo' },
                        { value: 'false', label: 'Inactivo' },
                      ]}
                      register={register}
                      defaultValue={investigador?.persona.activo ? 'true' : 'false'}
                      errors={errors}
                    />
                  </Box>
                </Box>
                <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end'>
                  <Button colorScheme='gray' variant='outline' mr='3%' onClick={() => navigate(-1)}>
                    Cancelar
                  </Button>
                  <Button onClick={openModal} colorScheme='blue' variant='outline'>
                    Guardar
                  </Button>
                  <CustomModal
                    isOpen={isOpen}
                    onClose={closeModal}
                    guardar={true}
                    title='Guardar datos'
                    content='Se guardara los nuevos datos del investigador'
                    onSave={handleSubmit((values) => onSubmit(values))}
                  />
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
