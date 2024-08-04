import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Text,
  Heading,
  Box,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
} from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getDesembolsoById, putDesembolsoById } from '../../utils/api/vinculacionesApi';
import { formatoFechaISOaDDMMAAAA, convertirFechaDDMMAAAAaDate } from '../../utils/general';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import GenericInput from '../../components/formControls/GenericInput';

const schema = yup.object({});

export default function DetalleDesembolso() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { idDesembolso } = useParams();
  const [isOpenRendicion, setIsOpenRendicion] = useState(false);

  const openModalRendicion = () => {
    setIsOpenRendicion(true);
  };

  const closeModalRendicion = () => {
    setIsOpenRendicion(false);
  };

  const [isOpenFueraPlazo, setIsOpenFueraPlazo] = useState(false);

  const openModalFueraPlazo = () => {
    setIsOpenFueraPlazo(true);
  };

  const closeModalFueraPlazo = () => {
    setIsOpenFueraPlazo(false);
  };

  const { data: dataDesembolso } = useQuery(['desembolso', idDesembolso], () => getDesembolsoById(idDesembolso));
  // Función para sumar meses a una fecha
  function sumarMeses(fecha, meses) {
    const fechaInicio = new Date(fecha); // Convertir la fecha ISO en objeto Date
    fechaInicio.setMonth(fechaInicio.getMonth() + meses); // Sumar los meses
    return fechaInicio;
  }

  const fechaActual = formatoFechaISOaDDMMAAAA(new Date());
  const fechaRendicion = formatoFechaISOaDDMMAAAA(sumarMeses(dataDesembolso?.desembolso?.fechaDesembolso, dataDesembolso?.desembolso?.plazoEtapa));
  console.log('actual', fechaActual, convertirFechaDDMMAAAAaDate(fechaActual) > convertirFechaDDMMAAAAaDate(fechaRendicion));
  console.log('rendido', fechaRendicion);
  const {
    register: registerRendicion,
    handleSubmit: handleSubmitRendicion,
    formState: { errors: errorsRendicion },
  } = useForm({
    defaultValues: {
      // idDesembolso: parseInt(idDesembolso),
      fechaDeRendicionReal: new Date().toISOString().split('T')[0],
      montoRendido: null,
    },
    resolver: yupResolver(schema),
  });

  const { mutate: mutateRendicion, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => putDesembolsoById(parseInt(idDesembolso), formData),
    onSuccess: () => {
      queryClient.refetchQueries(['desembolso', idDesembolso]);
      toast({
        title: 'Rendición cargada',
        description: `Se ha cargado exitosamente`,
        status: 'success',
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: 'Error al registrar la rendición',
        description: `Intente de nuevo.`,
        status: 'error',
        isClosable: true,
      });
    },
  });

  const onSubmitRendicion = (values) => {
    console.log(values);
    mutateRendicion(values);
    closeModalRendicion();
  };

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Detalles del desembolso
          </Heading>

          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos del desembolso</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      label='Fecha de desembolso'
                      width={{ base: '100%', md: '47.5%' }}
                      value={formatoFechaISOaDDMMAAAA(dataDesembolso?.desembolso?.fechaDesembolso)}
                      isDisabled
                      mb='5vh'
                    />
                    <GenericInput
                      label='Monto desembolsado ($)'
                      width={{ base: '100%', md: '47.5%' }}
                      value={dataDesembolso?.desembolso?.montoDesembolsado}
                      isDisabled
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      label='Plazo de etapa'
                      width={{ base: '100%', md: '28%' }}
                      value={dataDesembolso?.desembolso?.plazoEtapa}
                      isDisabled
                      mb='5vh'
                    />
                    <GenericInput
                      label='Fecha de aprobado'
                      width={{ base: '100%', md: '34%' }}
                      value={formatoFechaISOaDDMMAAAA(dataDesembolso?.desembolso?.fechaAprobado)}
                      isDisabled
                      mb='5vh'
                    />
                    <GenericInput
                      label='Fecha de rendición estimada'
                      width={{ base: '100%', md: '34%' }}
                      value={fechaRendicion}
                      isDisabled
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      label='Fecha de rendición real'
                      width={{ base: '100%', md: '47.5%' }}
                      value={
                        dataDesembolso?.desembolso?.fechaDeRendicionReal
                          ? formatoFechaISOaDDMMAAAA(dataDesembolso?.desembolso?.fechaDeRendicionReal)
                          : null
                      }
                      isDisabled
                      mb='5vh'
                    />
                    <GenericInput
                      label='Monto rendido'
                      width={{ base: '100%', md: '47.5%' }}
                      value={dataDesembolso?.desembolso?.montoRendido || '-'}
                      isDisabled
                      mb='5vh'
                    />
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      label='Estado'
                      width={{ base: '100%', md: '47.5%' }}
                      value={dataDesembolso?.desembolso?.estado || '-'}
                      isDisabled
                      mb='5vh'
                    />
                    <GenericInput
                      label='Motivo de estado'
                      width={{ base: '100%', md: '47.5%' }}
                      /* value={data?.proyecto?.tipoActividad} */
                      isDisabled
                      mb='5vh'
                    />
                  </Box>

                  <Box display='flex' width='100%' alignItems='center'>
                    <Box width='70%'>
                      {' '}
                      {!dataDesembolso?.desembolso?.montoRendido && (
                        <Button colorScheme='blue' variant='outline' onClick={openModalRendicion}>
                          Ingresar fecha de rendición
                        </Button>
                      )}
                      <Modal isCentered isOpen={isOpenRendicion} onClose={closeModalRendicion}>
                        <ModalOverlay bg='blackAlpha.400' backdropFilter='blur(2px) hue-rotate(90deg)' />
                        <ModalContent>
                          <ModalHeader>Ingrese los datos</ModalHeader>
                          <ModalCloseButton onClick={closeModalRendicion} />
                          <ModalBody>
                            <Stack spacing={4}>
                              <GenericInput
                                name='fechaDeRendicionReal'
                                label='Fecha de Rendición'
                                type='date'
                                register={registerRendicion}
                                isRequired
                              />
                              <GenericInput
                                name='montoRendido'
                                type='number'
                                label='Monto rendido'
                                placeholder='Monto rendido'
                                register={registerRendicion}
                                isRequired
                              />
                            </Stack>
                          </ModalBody>
                          <ModalFooter>
                            <Button onClick={closeModalRendicion}>Cerrar</Button>
                            <Button ml={2} onClick={handleSubmitRendicion((values) => onSubmitRendicion(values))} colorScheme='blue'>
                              Guardar
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>{' '}
                      {/* No esta andando la comparacion de fechas - AHORA SI */}
                      {convertirFechaDDMMAAAAaDate(fechaActual) > convertirFechaDDMMAAAAaDate(fechaRendicion) && (
                        <Button colorScheme='blue' variant='outline' onClick={openModalFueraPlazo}>
                          Ingresar motivo de fuera de plazo
                        </Button>
                      )}
                      <Modal isCentered isOpen={isOpenFueraPlazo} onClose={closeModalFueraPlazo}>
                        <ModalOverlay bg='blackAlpha.400' backdropFilter='blur(2px) hue-rotate(90deg)' />
                        <ModalContent>
                          <ModalHeader>Ingrese los datos</ModalHeader>
                          <ModalCloseButton onClick={closeModalFueraPlazo} />
                          <ModalBody>
                            <Stack spacing={4}>
                              <Input name='Motivo de estado' placeholder='Montivo de estado' />
                            </Stack>
                          </ModalBody>
                          <ModalFooter>
                            <Button onClick={closeModalFueraPlazo}>Cerrar</Button>
                            <Button
                              ml={2}
                              onClick={() => {
                                /* onSave(); */
                                closeModalFueraPlazo();
                              }}
                              colorScheme='blue'
                            >
                              Guardar
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </Box>
                    <Box display='flex' width='30%' justifyContent='flex-end'>
                      <Button
                        colorScheme='blue'
                        variant='outline'
                        onClick={() => {
                          navigate(-1);
                        }}
                      >
                        Volver
                      </Button>
                    </Box>
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
