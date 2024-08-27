import React, { useEffect, useState } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';
import { getProyectoById, updateProyecto } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import { useForm } from 'react-hook-form';
import { getAllTiposProyectos } from '../../utils/api/tiposProyectosApi';
import { getAllRegionales } from '../../utils/api/regionalesApi';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericRadio from '../../components/formControls/GenericRadio';

const tipoActividad = ['Desarrollo Experimental', 'Investigación Aplicada', 'Investigación Básica'];

const estadoProyecto = [
  'EN TRÁMITE',
  'HOMOLOGADO',
  'REFORMULAR POR EVALUACIÓN EXTERNA',
  'REFORMULAR POR CONSEJO DE PROGRAMAS',
  'DENEGADO POR EVALUACIÓN EXTERNA',
  'DENEGADO POR CONSEJO DE PROGRAMAS',
  'CANCELADO',
];

export default function ModificarPIDs() {
  const navigate = useNavigate();
  const toast = useToast();

  const { idPid } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { data, isLoading, error } = useQuery(['proyecto', idPid], () => getProyectoById(Number(idPid)));

  const { data: dataRegionales, isLoading: isLoadingGetRegionales, error: errorRegionales } = useQuery(['regionales'], () => getAllRegionales());

  const {
    data: dataTiposProyectos,
    isLoading: isLoadingGetTiposProyectos,
    error: errorTiposProyectos,
  } = useQuery(['tiposProyectos'], () => getAllTiposProyectos());

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updateProyecto(Number(idPid), formData),
    onSuccess: () => {
      toast({
        title: 'Modificar PID',
        description: `Se ha modificado el PID exitosamente`,
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al modificar los datos del PID',
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
    reset,
  } = useForm();

  useEffect(() => {
    if (data) {
      reset({
        proyecto: {
          codPid: data.proyecto.codPid,
          tipoActividad: data.proyecto.tipoActividad,
          tipoProyecto: data.proyecto.tipoProyecto,
          programa: data.proyecto.programa,
          disposicion: data.proyecto.disposicion,
          fechaInicio: formatoFechaISOaAAAAMMDD(data.proyecto.fechaInicio),
          fechaFin: formatoFechaISOaAAAAMMDD(data.proyecto.fechaFin),
          denominacion: data.proyecto.denominacion,
          completo: data.proyecto.completo ? 'true' : 'false',
          regional: data.proyecto.regional,
          convocatoria: data.proyecto.convocatoria,
          estado: data.proyecto.estado,
          prorrogado: data.proyecto.prorrogado ? 'true' : 'false',
          tipo: data.proyecto.codPid ? 'pid' : 'externo',
          empresaInstitucion: data.proyecto.empresaInstitucion
        },
      });
      setEstado(data.proyecto.estado)
    }
  }, [data, reset]);

  const onSubmit = (values) => {
    const modifiedValues = {
      ...values.proyecto,
      prorrogado: values.proyecto.prorrogado === 'true',
      completo: values.proyecto.completo === 'true',
    };
    const proyecto = {
      proyecto: modifiedValues,
    };

    console.log(proyecto);
    mutate(proyecto);
  };

  const [estado, setEstado] = useState(data?.proyecto?.estado || '');

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
            Modificar datos del Proyecto
          </Heading>
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos del proyecto</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    {data?.proyecto?.codPid && (
                      <GenericInput
                        name='proyecto.codPid'
                        label='Código PID'
                        placeholder='Código PID'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '30%' }}
                        isRequired
                        mb='5vh'
                      />
                    )}

                    <GenericSelect
                      name='proyecto.regional'
                      label='Regional asociada'
                      placeholder='Regional...'
                      width={data?.proyecto?.codPid ? { base: '100%', md: '65%' } : '100%'}
                      mb='5vh'
                      isRequired
                      register={register}
                      options={(isLoadingGetRegionales ? ['Cargando...'] : dataRegionales.regionales).map((regional) => ({
                        value: regional,
                        label: regional,
                      }))}
                      errors={errors}
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      textArea
                      name='proyecto.denominacion'
                      label='Denominación'
                      placeholder='Denominación'
                      register={register}
                      errors={errors}
                      width='100%'
                      isRequired
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      type='date'
                      name='proyecto.fechaInicio'
                      label='Fecha Inicio'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '30%' }}
                      isRequired
                      mb='5vh'
                    />
                    <GenericInput
                      type='date'
                      name='proyecto.fechaFin'
                      label='Fecha Fin'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '30%' }}
                      isRequired
                      mb='5vh'
                    />

                    <GenericInput
                      type='number'
                      name='proyecto.convocatoria'
                      label='Convocatoria'
                      placeholder='Convocatoria'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '30%' }}
                      isRequired
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      name='proyecto.programa'
                      label='Programa'
                      placeholder='Programa'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '47.5%' }}
                      isRequired
                      mb='5vh'
                    />

                    <GenericSelect
                      name='proyecto.tipoProyecto'
                      label='Tipo de proyecto'
                      placeholder='Tipo de proyecto...'
                      width={{ base: '100%', md: '47.5%' }}
                      mb='5vh'
                      isRequired
                      register={register}
                      options={(isLoadingGetTiposProyectos ? ['Cargando...'] : dataTiposProyectos?.tiposProyectos).map((tipo) => ({
                        value: tipo,
                        label: tipo,
                      }))}
                      errors={errors}
                    />
                  </Box>
                  {!data?.proyecto?.codPid && (<Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      name='proyecto.empresaInstitucion'
                      label='Empresa/Institución'
                      placeholder='Empresa/Institución'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '50%' }}
                      isRequired
                      mb='5vh'
                    />
                  </Box>)}
                  {data?.proyecto?.codPid && (
                    <>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericSelect
                          name='proyecto.tipoActividad'
                          label='Tipo de actividad'
                          placeholder='Tipo de actividad...'
                          width={{ base: '100%', md: '30%' }}
                          mb='5vh'
                          isRequired
                          register={register}
                          options={tipoActividad.map((actividad) => ({
                            value: actividad,
                            label: actividad,
                          }))}
                          errors={errors}
                        />
                        <GenericSelect
                          name='proyecto.estado'
                          label='Estado'
                          placeholder='Estado...'
                          width={{ base: '100%', md: estado === 'HOMOLOGADO' ? '30%' : '65%' }}
                          mb='5vh'
                          isRequired
                          register={register}
                          options={estadoProyecto.map((estado) => ({
                            value: estado,
                            label: estado,
                          }))}
                          errors={errors}
                          onChange={(e) => setEstado(e.target.value)}
                        />

                        {estado === 'HOMOLOGADO' && (
                          <GenericInput
                            name='proyecto.disposicion'
                            label='Disposición'
                            placeholder='Disposición'
                            register={register}
                            errors={errors}
                            width={{ base: '100%', md: '30%' }}
                            isRequired={estado === 'HOMOLOGADO'}
                            mb='5vh'
                          />
                        )}
                      </Box>

                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Box width={{ base: '100%', md: '50%' }} display='flex' justifyContent='center'>
                          <GenericRadio
                            name='proyecto.prorrogado'
                            label='Prorroga:'
                            direction='row'
                            options={[
                              { value: 'true', label: 'Si' },
                              { value: 'false', label: 'No' },
                            ]}
                            register={register}
                            defaultValue={data?.proyecto?.prorrogado ? 'true' : 'false'}
                            errors={errors}
                            mb='5vh'
                          />
                        </Box>

                        <Box width={{ base: '100%', md: '50%' }} display='flex' justifyContent='center'>
                          <GenericRadio
                            name='proyecto.completo'
                            label='Completo:'
                            direction='row'
                            options={[
                              { value: 'true', label: 'Si' },
                              { value: 'false', label: 'No' },
                            ]}
                            register={register}
                            defaultValue={data?.proyecto?.completo ? 'true' : 'false'}
                            errors={errors}
                            mb='5vh'
                          />
                        </Box>
                      </Box>
                    </>
                  )}
                  <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                    <Button colorScheme='gray' variant='outline' onClick={() => navigate(-1)} mr='3%'>
                      Cancelar
                    </Button>
                    <Button onClick={openModal} colorScheme='blue' variant='outline' isLoading={isLoadingMutation}>
                      Aceptar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Se modificaran los datos del proyecto.'
                      content='¿Seguro que desea modificar la información del proyecto?'
                      onSave={handleSubmit((values) => onSubmit(values))}
                    />
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
