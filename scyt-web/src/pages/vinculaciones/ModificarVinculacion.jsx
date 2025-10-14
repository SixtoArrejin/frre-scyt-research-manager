import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner, useToast } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';
import { getVinculacionById, updateVinculacion } from '../../utils/api/vinculacionesApi';
import { getProyectoById } from '../../utils/api/proyectosApi';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import { useForm } from 'react-hook-form';
import CustomModal from '../../components/CustomModal';

export default function ModificarVinculacion() {
  const [Financiamiento, setFinanciamiento] = useState();
  const [investigadoresOptions, setInvestigadoresOptions] = useState([]);

  const [isOpenModalVinculacion, setIsOpenModalVinculacion] = useState(false);

  const openModal = () => {
    setIsOpenModalVinculacion(true);
  };

  const closeModal = () => {
    setIsOpenModalVinculacion(false);
  };

  const navigate = useNavigate();
  const toast = useToast();

  const { idVinculacion } = useParams();

  const { data, isLoading } = useQuery(['vinculacion-mod', idVinculacion], () => getVinculacionById(idVinculacion));

  // Obtener proyecto para listar investigadores
  const { data: dataProyecto } = useQuery(
    ['proyecto-investigadores', data?.vinculacion?.idProyecto],
    () => getProyectoById(data?.vinculacion?.idProyecto),
    { enabled: !!data?.vinculacion?.idProyecto },
  );

  useEffect(() => {
    if (!data || !data.vinculacion || data.vinculacion.vinculacionesconfinanciamiento == null) {
      setFinanciamiento(false);
    } else {
      setFinanciamiento(true);
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      //Vinculacion en general
      empresaInstitucion: '',
      numeroMarco: '',
      idResponsable: '',
      //Vinculación con Financiamiento
      conFinanciamiento: {
        titulo: '',
        nombreBeneficiario: '',
        monto: '',
        cantidadDesembolsos: '',
        fechaPresentacion: '',
        fechaAdjudicacion: '',
        plazoEjecucion: '',
        estado: '',
        motivoEstado: '',
      },
      sinFinanciamiento: {
        fechaInicio: '',
        fechaCierre: '',
        descripcion: '',
      },
    },
  });

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updateVinculacion(idVinculacion, formData),
    onSuccess: () => {
      toast({
        title: 'Modificar vinculación',
        description: 'Se ha modificado el grupo exitosamente',
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: (error) => {
      const errorMessage = error?.message;
      toast({
        title: 'Error al modificar los datos de la vinculación',
        description: `${errorMessage || 'Intente nuevamente'}`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  // Generar opciones de investigadores del proyecto
  useEffect(() => {
    if (dataProyecto?.proyecto?.participa) {
      const options = dataProyecto.proyecto.participa.map((participacion) => ({
        value: participacion.personas.idPersona,
        label: `${participacion.personas.apellido}, ${participacion.personas.nombre}`,
      }));
      setInvestigadoresOptions(options);
    }
  }, [dataProyecto]);

  // Resetear el formulario cuando se cargan los datos
  useEffect(() => {
    if (data?.vinculacion && reset) {
      reset({
        empresaInstitucion: data.vinculacion.empresaInstitucion || '',
        numeroMarco: data.vinculacion.numeroMarco || '',
        idResponsable: data.vinculacion.idResponsable || '',
        conFinanciamiento: {
          titulo: data.vinculacion.vinculacionesconfinanciamiento?.titulo || '',
          nombreBeneficiario: data.vinculacion.vinculacionesconfinanciamiento?.nombreBeneficiario || '',
          monto: data.vinculacion.vinculacionesconfinanciamiento?.monto || '',
          cantidadDesembolsos: data.vinculacion.vinculacionesconfinanciamiento?.cantidadDesembolsos || '',
          fechaPresentacion: formatoFechaISOaAAAAMMDD(data.vinculacion.vinculacionesconfinanciamiento?.fechaPresentacion) || '',
          fechaAdjudicacion: formatoFechaISOaAAAAMMDD(data.vinculacion.vinculacionesconfinanciamiento?.fechaAdjudicacion) || '',
          plazoEjecucion: data.vinculacion.vinculacionesconfinanciamiento?.plazoEjecucion || '',
          estado: data.vinculacion.vinculacionesconfinanciamiento?.estado || '',
          motivoEstado: data.vinculacion.vinculacionesconfinanciamiento?.motivoEstado || '',
        },
        sinFinanciamiento: {
          fechaInicio: formatoFechaISOaAAAAMMDD(data.vinculacion.vinculacionessinfinanciamiento?.fechaInicio) || '',
          fechaCierre: formatoFechaISOaAAAAMMDD(data.vinculacion.vinculacionessinfinanciamiento?.fechaCierre) || '',
          descripcion: data.vinculacion.vinculacionessinfinanciamiento?.descripcion || '',
        },
      });
    }
  }, [data, reset]);

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
            Modificar datos de la vinculación
          </Heading>
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos de vinculación</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      name='empresaInstitucion'
                      label='Empresa/Institución'
                      register={register}
                      errors={errors}
                      width={{ base: '100%', md: '65%' }}
                      mb='5vh'
                    />
                    <GenericInput
                      register={register}
                      errors={errors}
                      name='numeroMarco'
                      label='Nro Marco'
                      width={{ base: '100%', md: '30%' }}
                      type='number'
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericSelect
                      name='idResponsable'
                      label='Responsable'
                      placeholder='Seleccione un responsable...'
                      register={register}
                      errors={errors}
                      options={investigadoresOptions}
                      width={{ base: '100%', md: '100%' }}
                      mb='5vh'
                    />
                  </Box>
                  {Financiamiento && (
                    <Box width='100%'>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Título'
                          name='conFinanciamiento.titulo'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                        <GenericInput
                          label='Nombre del beneficiario'
                          name='conFinanciamiento.nombreBeneficiario'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Monto'
                          name='conFinanciamiento.monto'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='number'
                          mb='5vh'
                        />
                        <GenericInput
                          label='Cantidad de desembolsos'
                          name='conFinanciamiento.cantidadDesembolsos'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='number'
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Fecha de presentación'
                          name='conFinanciamiento.fechaPresentacion'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='date'
                          mb='5vh'
                        />
                        <GenericInput
                          label='Fecha de adjudicación'
                          name='conFinanciamiento.fechaAdjudicacion'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='date'
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Plazo de ejecución (meses)'
                          name='conFinanciamiento.plazoEjecucion'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='number'
                          mb='5vh'
                        />
                        {/* La línea probablemente desaparezca de la vinculación (La borramos) */}
                        <GenericInput
                          label='Línea'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.nombreLinea}
                          isDisabled
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Estado'
                          name='conFinanciamiento.estado'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                        {/* Pensar en si esto debe condicionarse o no. Cargar cuando el estado sea "Desistido" nomás? */}
                        <GenericInput
                          label='Motivo desistido'
                          name='conFinanciamiento.motivoEstado'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                      </Box>{' '}
                    </Box>
                  )}
                  {!Financiamiento && (
                    <Box width='100%'>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Fecha de inicio'
                          name='sinFinanciamiento.fechaInicio'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='date'
                          mb='5vh'
                        />
                        <GenericInput
                          label='Fecha de cierre'
                          name='sinFinanciamiento.fechaCierre'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          type='date'
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          textArea
                          label='Descripción'
                          name='sinFinanciamiento.descripcion'
                          register={register}
                          errors={errors}
                          width={{ base: '100%', md: '47.5%' }}
                          mb='5vh'
                        />
                      </Box>
                    </Box>
                  )}
                  <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                    <Button colorScheme='gray' variant='outline' mr='3%' onClick={() => navigate(-1)}>
                      Cancelar
                    </Button>
                    <Button onClick={openModal} isLoading={isLoadingMutation} colorScheme='blue' variant='outline'>
                      Guardar
                    </Button>
                    <CustomModal
                      isOpen={isOpenModalVinculacion}
                      onClose={closeModal}
                      guardar={true}
                      title='Guardar datos'
                      content='Se guardara los nuevos datos del convenio'
                      onSave={handleSubmit((values) => {
                        const modifiedValues = {
                          ...values,
                          idResponsable: values.idResponsable && values.idResponsable !== '' ? Number(values.idResponsable) : null,
                        };
                        console.log('Datos a actualizar:', modifiedValues);
                        mutate(modifiedValues);
                      })}
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
