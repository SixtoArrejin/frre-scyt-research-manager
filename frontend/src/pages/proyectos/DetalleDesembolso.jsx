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
import {
  Search2Icon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DeleteIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from "../../utils/data/ListaCategorias.json";
import { Link, useParams, useNavigate } from "react-router-dom";
import proyectosInv from "../../utils/data/proyectosInv.json";
import { getPersonaById } from "../../utils/api/personasApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  formatoFechaISOaDDMMAAAA,
  getCategoriaMasActual,
} from "../../utils/general";
import { deleteCategoriaById } from "../../utils/api/categoriasApi";
import { getProyectoById } from "../../utils/api/proyectosApi";
import CustomModal from "../../components/CustomModal";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function DetalleDesembolso() {
  const navigate = useNavigate();

  const { idProyecto } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { data, isLoading, error } = useQuery(["proyecto", idProyecto], () =>
    getProyectoById(Number(idProyecto))
  );
  const [integrantes, setIntegrantes] = useState(data?.proyecto?.participa);
  const [grupos, setGrupos] = useState(data?.proyecto?.tiene);
  const [proyecto, setProyecto] = useState(data?.proyecto);

  useEffect(() => {
    setIntegrantes(data?.proyecto?.participa);
    setGrupos(data?.proyecto?.tiene);
    setProyecto(data?.proyecto);
  }, [data]);

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
                        value={data?.proyecto?.codPid}
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
                        defaultValue={data?.proyecto?.regional}
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
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Plazo de etapa"
                        placeholder="Plazo de etapa"
                        isDisabled
                        value={
                          data?.proyecto?.director.apellido +
                          ", " +
                          data?.proyecto?.director.nombre
                        }
                      />
                      <FormLabel>Plazo de etapa</FormLabel>
                    </FormControl>

                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Fecha de rendición estimada"
                        placeholder="Fecha de rendición estimada"
                        isDisabled
                        value={
                          data?.proyecto?.codirector.apellido +
                          ", " +
                          data?.proyecto?.codirector.nombre
                        }
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
                      id="fechaInicio"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Fecha aprobado"
                        placeholder="Fecha aprobado"
                        isDisabled
                        value={formatoFechaISOaDDMMAAAA(
                          data?.proyecto?.fechaInicio
                        )}
                      />
                      <FormLabel>Fecha aprobado</FormLabel>
                    </FormControl>

                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Fecha de rendición real"
                        placeholder="Fecha de rendición real"
                        isDisabled
                        value={formatoFechaISOaDDMMAAAA(
                          data?.proyecto?.fechaFin
                        )}
                      />
                      <FormLabel>Fecha de rendición real</FormLabel>
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
                        name="Monto rendido"
                        placeholder="Monto rendido"
                        isDisabled
                        value={data?.proyecto?.programa}
                      />
                      <FormLabel>Monto rendido</FormLabel>
                    </FormControl>

                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "47.5%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Estado"
                        placeholder="Estado"
                        isDisabled
                        value={data?.proyecto?.tipoProyecto}
                      />
                      <FormLabel>Estado</FormLabel>
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
                        name="Motivo de estado"
                        placeholder="Motivo de estado"
                        isDisabled
                        value={data?.proyecto?.tipoActividad}
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
                      <Button colorScheme="blue" variant="outline">
                        Ingresar motivo de fuera de plazo
                      </Button>
                    </Box>
                    <Box  display="flex" width="30%" justifyContent="flex-end">
                      <Link to={`modificar`}>
                        <Button colorScheme="blue" variant="outline">
                          Modificar
                        </Button>
                      </Link>
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
