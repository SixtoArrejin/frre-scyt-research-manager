import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Box,
  Button,
  Checkbox,
  IconButton,
  useToast,
  Select,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
} from "@chakra-ui/react";

import { Input, HStack } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";

import { Link, useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { getDesembolsoById, putDesembolsoById } from "../../utils/api/vinculacionesApi";
import {
  formatoFechaISOaDDMMAAAA,
  convertirFechaDDMMAAAAaDate,
} from "../../utils/general";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

const schema = yup.object({

});

export default function DetalleDesembolso() {
  const navigate = useNavigate();
  const toast = useToast();

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

  const { data: dataDesembolso } = useQuery(["desembolso"], () =>
    getDesembolsoById(idDesembolso)
  );
  // Función para sumar meses a una fecha
  function sumarMeses(fecha, meses) {
    const fechaInicio = new Date(fecha); // Convertir la fecha ISO en objeto Date
    fechaInicio.setMonth(fechaInicio.getMonth() + meses); // Sumar los meses
    return fechaInicio;
  }

  const fechaActual = formatoFechaISOaDDMMAAAA(new Date());
  const fechaRendicion = formatoFechaISOaDDMMAAAA(
    sumarMeses(
      dataDesembolso?.desembolso?.fechaDesembolso,
      dataDesembolso?.desembolso?.plazoEtapa
    )
  );
  console.log("actual", fechaActual, convertirFechaDDMMAAAAaDate(fechaActual) > convertirFechaDDMMAAAAaDate(fechaRendicion))
  console.log("rendido", fechaRendicion)
  const {
    register: registerRendicion,
    handleSubmit: handleSubmitRendicion,
    formState: { errors: errorsRendicion },
  } = useForm({
    defaultValues: {
      // idDesembolso: parseInt(idDesembolso),
      fechaDeRendicionReal: new Date().toISOString().split("T")[0],
      montoRendido: null,
    },
    resolver: yupResolver(schema),
  });

  const { mutate: mutateRendicion, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => putDesembolsoById(parseInt(idDesembolso), formData),
    onSuccess: () => {
      toast({
        title: "Rendición cargada",
        description: `Se ha cargado exitosamente`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al registrar la rendición",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const onSubmitRendicion = (values) => {
    console.log(values);
    mutateRendicion(values)
    // closeModalRendicion();
  };

  return (
    <Card>
      <CardBody>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Heading as="h2" size="xl" textAlign="center">
            Detalles del desembolso
          </Heading>

          <br />

          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Datos del desembolso</Text>
              <br />
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  width="70%"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Fecha de desembolso"
                        placeholder="Fecha de desembolso"
                        isDisabled
                        value={formatoFechaISOaDDMMAAAA(
                          dataDesembolso?.desembolso?.fechaDesembolso
                        )}
                      />
                      <FormLabel>Fecha de desembolso</FormLabel>
                    </FormControl>
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Monto desembolsado"
                        placeholder="Monto desembolsado ($)"
                        isDisabled
                        value={dataDesembolso?.desembolso?.montoDesembolsado}
                      />
                      <FormLabel>Monto desembolsado ($)</FormLabel>
                    </FormControl>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "28%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Plazo de etapa"
                        placeholder="Plazo de etapa"
                        isDisabled
                        value={dataDesembolso?.desembolso?.plazoEtapa}
                      />
                      <FormLabel>Plazo de etapa</FormLabel>
                    </FormControl>
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "34%" }}
                      mb="5vh"
                    >
                      <Input
                        name="fecha de aprobado"
                        placeholder="Fecha de aprobado"
                        isDisabled
                        value={formatoFechaISOaDDMMAAAA(dataDesembolso?.desembolso?.fechaAprobado)}
                      />
                      <FormLabel>Fecha de Aprobado</FormLabel>
                    </FormControl>
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "34%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Fecha de rendición estimada"
                        placeholder="Fecha de rendición estimada"
                        isDisabled
                        value={fechaRendicion}
                      />
                      <FormLabel>Fecha de rendición estimada</FormLabel>
                    </FormControl>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Fecha de rendición real"
                        placeholder="Fecha de rendición real"
                        isDisabled
                        value={
                          dataDesembolso?.desembolso?.fechaDeRendicionReal ?
                            formatoFechaISOaDDMMAAAA(dataDesembolso?.desembolso?.fechaDeRendicionReal)
                            : null
                        }
                      />
                      <FormLabel>Fecha de rendición real</FormLabel>
                    </FormControl>
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Monto rendido"
                        placeholder="Monto rendido"
                        isDisabled
                        value={dataDesembolso?.desembolso?.montoRendido || "-"}
                      />
                      <FormLabel>Monto rendido</FormLabel>
                    </FormControl>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Estado"
                        placeholder="Estado"
                        isDisabled
                        value={dataDesembolso?.desembolso?.estado || "-"}
                      />
                      <FormLabel>Estado</FormLabel>
                    </FormControl>
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Motivo de estado"
                        placeholder="Motivo de estado"
                        isDisabled
                      /* value={data?.proyecto?.tipoActividad} */
                      />
                      <FormLabel>Motivo de estado</FormLabel>
                    </FormControl>
                  </Box>

                  <Box display="flex" width="100%" alignItems="center">
                    <Box width="70%">
                      {" "}
                      {!dataDesembolso?.desembolso?.montoRendido &&
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          onClick={openModalRendicion}
                        >
                          Ingresar fecha de rendición
                        </Button>
                      }
                      <Modal
                        isCentered
                        isOpen={isOpenRendicion}
                        onClose={closeModalRendicion}
                      >
                        <ModalOverlay
                          bg="blackAlpha.400"
                          backdropFilter="blur(2px) hue-rotate(90deg)"
                        />
                        <ModalContent>
                          <ModalHeader>Ingrese los datos</ModalHeader>
                          <ModalCloseButton onClick={closeModalRendicion} />
                          <ModalBody>
                            <Stack spacing={4}>
                              <Input
                                name="Fecha Rendicion"
                                placeholder="Fecha Rendicion"
                                type="date"
                                {...registerRendicion("fechaDeRendicionReal")}
                              />
                              <Input
                                name="Monto rendido"
                                type="number"
                                placeholder="Monto rendido"
                                {...registerRendicion("montoRendido", {
                                  setValueAs: (v) => Number(v),
                                })}
                              />
                            </Stack>
                          </ModalBody>
                          <ModalFooter>
                            <Button onClick={closeModalRendicion}>
                              Cerrar
                            </Button>
                            <Button
                              ml={2}
                              onClick={handleSubmitRendicion((values) => onSubmitRendicion(values))}
                              colorScheme="blue"
                            >
                              Guardar
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>{" "}
                      {/* No esta andando la comparacion de fechas - AHORA SI */}
                      {(convertirFechaDDMMAAAAaDate(fechaActual) > convertirFechaDDMMAAAAaDate(fechaRendicion)) && (
                        <Button
                          colorScheme="blue"
                          variant="outline"
                          onClick={openModalFueraPlazo}
                        >
                          Ingresar motivo de fuera de plazo
                        </Button>
                      )}
                      <Modal
                        isCentered
                        isOpen={isOpenFueraPlazo}
                        onClose={closeModalFueraPlazo}
                      >
                        <ModalOverlay
                          bg="blackAlpha.400"
                          backdropFilter="blur(2px) hue-rotate(90deg)"
                        />
                        <ModalContent>
                          <ModalHeader>Ingrese los datos</ModalHeader>
                          <ModalCloseButton onClick={closeModalFueraPlazo} />
                          <ModalBody>
                            <Stack spacing={4}>
                              <Input
                                name="Motivo de estado"
                                placeholder="Montivo de estado"
                              />
                            </Stack>
                          </ModalBody>
                          <ModalFooter>
                            <Button onClick={closeModalFueraPlazo}>
                              Cerrar
                            </Button>
                            <Button
                              ml={2}
                              onClick={() => {
                                /* onSave(); */
                                closeModalFueraPlazo();
                              }}
                              colorScheme="blue"
                            >
                              Guardar
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </Box>
                    <Box display="flex" width="30%" justifyContent="flex-end">
                      <Button
                        colorScheme="blue"
                        variant="outline"
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
