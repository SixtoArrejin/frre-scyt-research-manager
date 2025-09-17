import React, { useEffect, useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { createCategoria } from '../../utils/api/categoriasApi';
import { useMutation } from 'react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomModal from '../../components/CustomModal';
import GenericRadio from '../../components/formControls/GenericRadio';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericInput from '../../components/formControls/GenericInput';

const schema = yup.object({
  tipo: yup
    .string()
    .required('El tipo es requerido')
    .test('tipoCat', 'La categoria debe ser Ministerio o UTN', (val) => val.toLowerCase() === 'ministerio' || val.toLowerCase() === 'utn'),
  categoria: yup.string().required('La categoria es requerida'),
  normativa: yup
    .string()
    .required('La resolución es requerida')
    .matches(/^\d+\/\d+$/, 'El formato de la resolución debe ser \'###/###\''),
  comision: yup.string().required('La comisión es requerida'),
  fecha: yup.string().required('La fecha es requerida'),
});

const COMISIONES = [
  'Ingeniería',
  'Educación',
  'Antropología',
  'Ciencias de la Tierra, el Mar y la Atmosfera',
  'Química, Bioquímica y Farmacia',
  'Ciencias Básicas y Aplicadas',
];

export default function NuevaCategoria() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toast = useToast();
  const navigate = useNavigate();

  const { idPersona } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control, //para usar useWatch
  } = useForm({
    defaultValues: {
      tipo: 'ministerio',
      equiparacion: 'true',
      categoria: '',
      fecha: '',
      normativa: '',
      idPersona: parseInt(idPersona),
      comision: '',
    },
    resolver: yupResolver(schema),
  });

  const tipoCategoriaSeleccionada = useWatch({ control, name: 'tipo' });

  useEffect(() => {
    if (tipoCategoriaSeleccionada) {
      setValue('categoria', '');
    }
  }, [tipoCategoriaSeleccionada, setValue]);

  const { mutate } = useMutation({
    mutationFn: (formData) => createCategoria(formData),
    onSuccess: () => {
      toast({
        title: 'Nueva categoria',
        description: 'Categoria creada exitosamente.',
        status: 'success',
        isClosable: true,
      });
      navigate(`/investigadores/${idPersona}`);
    },
    onError: () => {
      toast({
        title: 'Error al crear la categoria',
        description: 'Intente de nuevo.',
        status: 'error',
        isClosable: true,
      });
    },
  });

  const onSub = (values) => {
    // Convierte el valor de 'activo' a booleano antes de enviar
    const modifiedValues = {
      ...values,
      equiparacion: values.equiparacion == 'true',
    };
    console.log(values);
    console.log(modifiedValues);
    mutate(modifiedValues);
  };

  const catUTN = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const catMIN = ['I', 'II', 'III', 'IV', 'V'];

  return (
    <>
      <Card>
        <CardBody>
          <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <Heading as='h2' size='xl' textAlign='center'>
              Nueva Categoria
            </Heading>

            <br />
            <br />
            <Card width='100%'>
              <CardBody>
                <Text fontSize='md'>Datos de categoria</Text>
                <br />
                <form onSubmit={handleSubmit((values) => onSub(values))}>
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
                        <GenericRadio
                          name='equiparacion'
                          label='Equiparación:'
                          direction='row'
                          options={[
                            { value: 'true', label: 'Si' },
                            { value: 'false', label: 'No' },
                          ]}
                          register={register}
                          defaultValue='true'
                          isDisabled={tipoCategoriaSeleccionada == 'ministerio'}
                          errors={errors}
                          mb='5vh'
                        />
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
                          options={
                            tipoCategoriaSeleccionada == 'utn'
                              ? catUTN.map((option) => ({
                                value: option,
                                label: option,
                              }))
                              : catMIN.map((option) => ({
                                value: option,
                                label: option,
                              }))
                          }
                          errors={errors}
                        />
                      </Box>

                      <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                        <GenericInput
                          name='normativa'
                          label='Resolución'
                          placeholder='Resolución'
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
                          options={COMISIONES.map((comision) => ({
                            value: comision,
                            label: comision,
                          }))}
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
                        title='Guardar nueva categoria'
                        content='Se guardara la nueva categoria'
                        onSave={handleSubmit((values) => onSub(values))}
                      />
                    </Box>
                  </Box>
                </form>
              </CardBody>
            </Card>
          </Box>
        </CardBody>
      </Card>
    </>
  );
}
