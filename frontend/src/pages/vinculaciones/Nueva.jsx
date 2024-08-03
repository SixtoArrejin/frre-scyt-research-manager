import React, { useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { createVinculacion } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import GenericRadio from '../../components/formControls/GenericRadio';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';

export default function NuevaVinculacion() {
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);
  const { idPid } = useParams();

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toast = useToast();
  const navigate = useNavigate();

  const [selectedConvenio, setSelectedConvenio] = useState();
  const [nroConvenio, setNroConvenio] = useState();

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => createVinculacion(idPid, formData), //Cambiar por createVinculacion(idPid, formData)
    onSuccess: () => {
      toast({
        title: 'Nueva Vinculación',
        description: `Se ha creado la nueva vinculación exitosamente`,
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: (error) => {
      const errorMessage = error?.message;
      toast({
        title: 'Error al crear la vinculación',
        description: `${errorMessage || 'Intente nuevamente'}`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  const { control, register, handleSubmit, setValue } = useForm({
    defaultValues: {
      adjudicacion: null,
      beneficiario: null,
      desembolsos: null,
      empresaInstitucion: null,
      nroMarco: null,
      financiamiento: 'false',
      linea: null,
      monto: null,
      plazoEjecucion: null,
      presentacion: null,
    },
  });

  const {
    fields: convenios,
    append,
    remove,
    update,
  } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: 'convenios', // Nombre del campo de formulario que es un arreglo
  });

  const tipoFinanciamiento = useWatch({ control, name: 'financiamiento' });

  const agregarConvenio = () => {
    // Verificar si ya existe un convenio con el mismo tipo y número
    const convenioExistente = convenios.find((convenio) => convenio.tipoConvenio === selectedConvenio && convenio.nroConvenio === nroConvenio);

    if (convenioExistente) {
      // Mostrar un mensaje de error o realizar alguna acción apropiada
      toast({
        title: 'Este convenio ya fue agregado',
        status: 'info',
        isClosable: true,
      });
    } else {
      // Agregar el nuevo convenio al array
      append({ tipoConvenio: selectedConvenio, nroConvenio });
    }
  };

  const eliminarConvenio = (index) => {
    remove(index);
  };

  const onSub = (values) => {
    const modifiedValues = {
      ...values,
      financiamiento: values.financiamiento == 'true',
    };
    // console.log(modifiedValues);
    mutate(modifiedValues);
  };

  return (
    <Card>
      <CardBody>
        <form style={{ width: '100%' }} onSubmit={handleSubmit((values) => onSub(values))}>
          <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <Heading as='h2' size='xl' textAlign='center'>
              Nueva Vinculacion
            </Heading>
            <br />
            <Card width='100%'>
              <CardBody>
                <Text fontSize='md'>Ingrese los datos de la nueva vinculación</Text>
                <br />
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        name='empresaInstitucion'
                        label='Empresa/Institución'
                        placeholder='Empresa/Institución'
                        register={register}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                      <Box width={{ base: '100%', md: '45%' }} display='flex' justifyContent='center'>
                        <GenericRadio
                          name='financiamiento'
                          // label='Tipo de categoria:'
                          direction='row'
                          options={[
                            { value: 'true', label: 'Con financiamiento' },
                            { value: 'false', label: 'Sin financiamiento' },
                          ]}
                          register={register}
                          defaultValue='false'
                          mb='5vh'
                          width={'100%'}
                        />
                      </Box>
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        type='number'
                        name='nroMarco'
                        placeholder='Nro Marco'
                        register={register}
                        label='Nro Marco'
                        width={{ base: '100%', md: '50%' }}
                        mb='5vh'
                        isRequired
                      />
                    </Box>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Convenios</Text>
              <br />
              <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
                <br />
                <Box display='flex' width='100%'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} justifyContent='space-between' width='60%' marginLeft='2%'>
                    <GenericSelect
                      isSearchable={true}
                      label='Tipo de convenio'
                      options={['Especifico', 'Colaboración', 'Otro...'].map((item) => ({
                        value: item,
                        label: item,
                      }))}
                      onChange={(e) => {
                        setSelectedConvenio(e.target.value);
                      }}
                      width={{ base: '100%', md: '35%' }}
                      mb='5vh'
                    />
                    <GenericInput
                      placeholder='Nro Convenio'
                      label='Nro Convenio'
                      width={{ base: '100%', md: '35%' }}
                      mb='5vh'
                      onChange={(e) => setNroConvenio(Number(e.target.value))}
                    />

                    <Box display='flex' justifyContent='flex-end' width='20%'>
                      <Button colorScheme='blue' variant='outline' onClick={agregarConvenio}>
                        Agregar
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Tabla
                  columnas={['Tipo', 'Número', 'Eliminar']}
                  datos={convenios?.map((item, index) => {
                    return [
                      <div {...register(`convenios[${index}]`, { value: item })}>{item.tipoConvenio}</div>,
                      item.nroConvenio,
                      <DeleteIcon
                        cursor={'pointer'}
                        onClick={() => {
                          eliminarConvenio(index);
                        }}
                      />,
                    ];
                  })}
                  paginado={false}
                />
              </Box>
            </CardBody>
          </Card>
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Ingrese los datos del convenio {tipoFinanciamiento === 'true' ? 'con' : 'sin'} financiamiento</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                {tipoFinanciamiento === 'true' && (
                  <Box display='flex' width='75%' alignItems='center' justifyContent='center' flexDirection='column'>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        name='titulo'
                        placeholder='Título'
                        register={register}
                        label='Título'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                      <GenericInput
                        name='beneficiario'
                        placeholder='Nombre del beneficiario'
                        register={register}
                        label='Nombre del beneficiario'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        type='number'
                        name='monto'
                        placeholder='Monto'
                        register={register}
                        label='Monto'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                      <GenericInput
                        type='number'
                        name='desembolsos'
                        placeholder='Cantidad de desembolsos'
                        register={register}
                        label='Cantidad de desembolsos'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                    </Box>

                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        type='date'
                        name='presentacion'
                        register={register}
                        label='Presentación'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                      <GenericInput
                        type='date'
                        name='adjudicacion'
                        register={register}
                        label='Adjudicación'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        type='number'
                        name='plazoEjecucion'
                        placeholder='Plazo de ejecución'
                        register={register}
                        label='Plazo de ejecución (meses)'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                      <GenericSelect
                        name='linea'
                        label='Línea'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                        register={register}
                        options={['1ro', '2do', '3ro'].map((item) => ({
                          value: item,
                          label: item,
                        }))}
                        placeholder='Línea...'
                      />
                    </Box>
                  </Box>
                )}

                {tipoFinanciamiento === 'false' && (
                  <Box display='flex' width='75%' alignItems='center' justifyContent='center' flexDirection='column'>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        type='date'
                        name='fechaInicio'
                        register={register}
                        label='Inicio'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                      <GenericInput
                        type='date'
                        name='fechaCierre'
                        register={register}
                        label='Cierre'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        textArea
                        name='descripcion'
                        placeholder='Descripción'
                        register={register}
                        label='Descripción'
                        width='100%'
                        mb='5vh'
                        isRequired
                      />
                    </Box>
                  </Box>
                )}
              </Box>
              <Box
                display='flex'
                width='100%'
                alignItems='center'
                justifyContent='flex-end'
                // justifyContent="center"
              >
                <Button colorScheme='gray' variant='outline' onClick={() => navigate(-1)} mr='5%'>
                  Cancelar
                </Button>
                <Button onClick={openModal} isLoading={isLoading} colorScheme='blue' variant='outline' ml='5%'>
                  Guardar
                </Button>
                <CustomModal
                  isOpen={isOpen}
                  onClose={closeModal}
                  guardar={true}
                  title='Guardar nuevo PID'
                  content='Se guardara el nuevo Proyecto'
                  onSave={handleSubmit((values) => onSub(values))}
                />
              </Box>
            </CardBody>
          </Card>
        </form>
      </CardBody>
    </Card>
  );
}
