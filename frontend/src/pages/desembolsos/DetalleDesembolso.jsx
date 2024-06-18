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
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";

import { Link, useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { getDesembolsoById } from "../../utils/api/vinculacionesApi";
import { formatoFechaISOaDDMMAAAA } from "../../utils/general";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function DetalleDesembolso() {
  const navigate = useNavigate();

  const { idDesembolso } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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
                        value={dataDesembolso?.desembolso?.fechaAprobado}
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
                        /*                         value={formatoFechaISOaDDMMAAAA(
                          data?.proyecto?.fechaFin
                        )} */
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
                        /* value={data?.proyecto?.programa} */
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
                        /* value={data?.proyecto?.tipoProyecto} */
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
                      <Button colorScheme="blue" variant="outline">
                        Ingresar fecha de rendición
                      </Button>{" "}
                      {dataDesembolso?.desembolso?.fechaRendicion === null &&
                        fechaRendicion <= fechaActual && (
                          <Button colorScheme="blue" variant="outline">
                            Ingresar motivo de fuera de plazo
                          </Button>
                        )}
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
