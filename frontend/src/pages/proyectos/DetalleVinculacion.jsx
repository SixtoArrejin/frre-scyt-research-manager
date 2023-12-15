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

export default function DetalleVinculacion() {
  const Financiamiento = false;
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
            Detalles de vinculación
          </Heading>

          <br />

          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Datos de vinculación</Text>
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
                      width={{ base: "100%", md: "65%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Empresa/institución"
                        placeholder="Empresa/institución"
                        isDisabled
                        value={data?.proyecto?.codPid}
                      />
                      <FormLabel>Empresa/institución</FormLabel>
                    </FormControl>
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "30%" }}
                      mb="5vh"
                    >
                      <Input
                        name="Nro Marco"
                        placeholder="Nro Marco"
                        isDisabled
                        defaultValue={data?.proyecto?.regional}
                      />
                      <FormLabel>Nro Marco</FormLabel>
                    </FormControl>
                  </Box>
                  {Financiamiento && (
                    <Box width="100%">
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
                            name="Titulo"
                            placeholder="Titulo"
                            isDisabled
                            value={
                              data?.proyecto?.director.apellido +
                              ", " +
                              data?.proyecto?.director.nombre
                            }
                          />
                          <FormLabel>Titulo</FormLabel>
                        </FormControl>

                        <FormControl
                          variant="floating"
                          width={{ base: "100%", md: "47.5%" }}
                          mb="5vh"
                        >
                          <Input
                            name="Nombre del beneficiario"
                            placeholder="Nombre del beneficiario"
                            isDisabled
                            value={
                              data?.proyecto?.codirector.apellido +
                              ", " +
                              data?.proyecto?.codirector.nombre
                            }
                          />
                          <FormLabel>Nombre del beneficiario</FormLabel>
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
                            name="Monto"
                            placeholder="Monto"
                            isDisabled
                            value={formatoFechaISOaDDMMAAAA(
                              data?.proyecto?.fechaInicio
                            )}
                          />
                          <FormLabel>Monto</FormLabel>
                        </FormControl>

                        <FormControl
                          variant="floating"
                          width={{ base: "100%", md: "47.5%" }}
                          mb="5vh"
                        >
                          <Input
                            name="Cantidad de desembolsos"
                            placeholder="Cantidad de desembolsos"
                            isDisabled
                            value={formatoFechaISOaDDMMAAAA(
                              data?.proyecto?.fechaFin
                            )}
                          />
                          <FormLabel>Cantidad de desembolsos</FormLabel>
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
                            name="Fecha de presentación"
                            placeholder="Fecha de presentación"
                            isDisabled
                            value={data?.proyecto?.programa}
                          />
                          <FormLabel>Fecha de presentación</FormLabel>
                        </FormControl>

                        <FormControl
                          variant="floating"
                          width={{ base: "100%", md: "47.5%" }}
                          mb="5vh"
                        >
                          <Input
                            name="Fecha de adjudicación"
                            placeholder="Fecha de adjudicación"
                            isDisabled
                            value={data?.proyecto?.tipoProyecto}
                          />
                          <FormLabel>Fecha de adjudicación</FormLabel>
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
                            name="Plazo de ejecución"
                            placeholder="Plazo de ejecución"
                            isDisabled
                            value={data?.proyecto?.tipoActividad}
                          />
                          <FormLabel>Plazo de ejecución</FormLabel>
                        </FormControl>

                        <FormControl
                          variant="floating"
                          width={{ base: "100%", md: "47.5%" }}
                          mb="5vh"
                        >
                          <Input
                            name="Linea"
                            placeholder="Linea"
                            isDisabled
                            value={data?.proyecto?.estado}
                          />
                          <FormLabel>Linea</FormLabel>
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
                            value={data?.proyecto?.convocatoria}
                          />
                          <FormLabel>Estado</FormLabel>
                        </FormControl>

                        <FormControl
                          variant="floating"
                          width={{ base: "100%", md: "47.5%" }}
                          mb="5vh"
                        >
                          <Input
                            name="Motivo desistido"
                            placeholder="Motivo desistido"
                            isDisabled
                            value={data?.proyecto?.disposicion}
                          />
                          <FormLabel>Motivo desistido</FormLabel>
                        </FormControl>
                      </Box>{" "}
                    </Box>
                  )}
                  {!Financiamiento && (
                    <Box width="100%">
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
                            name="Fecha Inicio"
                            placeholder="Fecha de inicio"
                            isDisabled
                            value={
                              data?.proyecto?.director.apellido +
                              ", " +
                              data?.proyecto?.director.nombre
                            }
                          />
                          <FormLabel>Fecha de inicio</FormLabel>
                        </FormControl>

                        <FormControl
                          variant="floating"
                          width={{ base: "100%", md: "47.5%" }}
                          mb="5vh"
                        >
                          <Input
                            name="Fecha cierre"
                            placeholder="Fecha de cierre"
                            isDisabled
                            value={
                              data?.proyecto?.codirector.apellido +
                              ", " +
                              data?.proyecto?.codirector.nombre
                            }
                          />
                          <FormLabel>Fecha de cierre</FormLabel>
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
                          width={{ base: "100%", md: "100%" }}
                          mb="5vh"
                        >
                          <Input
                            name="Descripción"
                            placeholder="Descripción"
                            isDisabled
                            value={formatoFechaISOaDDMMAAAA(
                              data?.proyecto?.fechaInicio
                            )}
                          />
                          <FormLabel>Descripción</FormLabel>
                        </FormControl>
                      </Box>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    width="100%"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    {/* <Button
                      colorScheme="gray"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      mr="3%"
                    >
                      Cancelar
                    </Button> */}
                    <Link to={`modificar`}>
                      <Button colorScheme="blue" variant="outline">
                        Modificar
                      </Button>
                    </Link>
                    {/* <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title="Guardar nuevo investigador"
                      content="Se guardara el nuevo investigador"
                      // onSave={handleSubmit((values) => mutate(values))}
                    /> */}
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Convenio</Text>
              <br />
              <Card width="100%">
                <CardBody>
                  <TableContainer>
                    <Table size="sm" variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th textAlign="center">
                            <Text fontSize="md">Tipo</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Numero</Text>
                          </Th>

                          <Th textAlign="center">
                            <Text fontSize="md">Eliminar</Text>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {integrantes?.map((item, index) => {
                          const ayn =
                            item?.personas.apellido +
                            " " +
                            item?.personas.nombre;
                          const catUTN = getCategoriaMasActual(
                            item?.personas.categorias,
                            "utn"
                          );
                          const catMIN = getCategoriaMasActual(
                            item?.personas.categorias,
                            "ministerio"
                          );
                          return (
                            <Tr key={index}>
                              <Td textAlign="center">
                                <Text fontSize="md">{item.rol}</Text>
                              </Td>
                              <Td textAlign="center">
                                <Text fontSize="md">{ayn}</Text>
                              </Td>

                              <Td textAlign="center">
                                <Link to={`/investigadores/${item.idPersona}`}>
                                  <DeleteIcon />
                                </Link>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Link to={`agregar-investigador`}>
                  <Button colorScheme="blue" variant="outline">
                    Agregar Convenio
                  </Button>
                </Link>
              </Box>
              <br />
            </CardBody>
          </Card>

          <br />
          {Financiamiento && (<Card width="100%">
            <CardBody>
              <Text fontSize="md">Desembolsos</Text>
              <br />
              <Card width="100%">
                <CardBody>
                  <TableContainer>
                    <Table size="sm" variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th textAlign="center">
                            <Text fontSize="md">Nro. Desembolso</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Fecha de desembolso</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Monto desmbolsado ($)</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Estado</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Ver más</Text>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {grupos?.map((item, index) => (
                          <Tr key={index}>
                            <Td textAlign="center">
                              <Text fontSize="md">
                                {item.gruposinvestigacion?.siglas}
                              </Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">
                                {item.gruposinvestigacion?.resolucion}
                              </Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">
                                {formatoFechaISOaDDMMAAAA(
                                  item.gruposinvestigacion?.fechaCreacion
                                )}
                              </Text>
                            </Td>
                            <Td textAlign="center">
                              <Link
                                to={`/grupos-investigacion/${item.gruposinvestigacion?.idGrupoInvestigacion}`}
                              >
                                <PlusSquareIcon />
                              </Link>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="space-between" // Cambiado de "flex-end" a "space-between"
              >
                <FormControl
                  variant="floating"
                  width={{ base: "100%", md: "47.5%" }}
                  mb="5vh"
                  mt="9" // Asegura que no haya margen superior en FormControl
                >
                  <Input
                    name="Saldo"
                    placeholder="Saldo ($)"
                    isDisabled
                    value={100000}
                  />
                  <FormLabel>Saldo ($)</FormLabel>
                </FormControl>
                <Link to={`agregar-grupo`}>
                  <Button colorScheme="blue" variant="outline">
                    {" "}
                    {/* Añadido el ancho del botón */}
                    Agregar Convenio
                  </Button>
                </Link>
              </Box>

              <br />
            </CardBody>
          </Card>)}
          <br />
          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() =>
                alert("Generar un reporte con los detalles del investigador")
              }
            >
              Generar Reporte
            </Button>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}
