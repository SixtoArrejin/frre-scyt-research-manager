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
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import {
  Search2Icon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  PlusSquareIcon,
  DeleteIcon,
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
} from "@chakra-ui/react";
// import investigadores from "../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import { Link, useHistory, useLocation, useNavigate } from "react-router-dom";
import { getAllGrupos } from "../../utils/api/gruposApi";
import { useQuery } from "react-query";
import TablaGrupos from "../../components/TablaGrupos";

import { getAllPersonas } from "../../utils/api/personasApi";

import { Select } from "@chakra-ui/react";

const ITEMS_PER_PAGE = 2; // Define el número de elementos por página

export default function ListaGrupos() {
  const [siglas, setSiglas] = useState("");
  const [filtro, setFiltro] = useState(false);

  const { data, isLoading, error } = useQuery("grupos", () => getAllGrupos());
  const [grupos, setGrupos] = useState(data?.grupos || []);

  //Aca se agrega lo de la tabla nueva
  const [selectedOptions, setSelectedOptions] = useState();
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const handleSelectPage = (event) => {
    if (parseInt(event.target.value, 10) > totalPages) {
      handlePageChange(0);
    } else {
      if (parseInt(event.target.value, 10) !== "") {
        const selectedPage = parseInt(event.target.value, 10);
        setCurrentPage(selectedPage - 1);
      } else {
        handlePageChange(0);
      }
    }
  };

  const { data: dataPersonas } = useQuery("personas", () => getAllPersonas());
  const [investigadores, setInvestigadores] = useState(
    dataPersonas?.personas || []
  );

  const roles = ["Investigador", "Becario"];

  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] =
    useState([]);

  const totalPages = Math.ceil(
    investigadoresSeleccionados.length || 1 / ITEMS_PER_PAGE
  );

  const sortedInvestigadores = [...investigadores]?.sort((a, b) => {
    const apellidoA = a.apellido.toLowerCase();
    const apellidoB = b.apellido.toLowerCase();
    return apellidoA.localeCompare(apellidoB);
  });

  const agregarInvestigador = () => {
    console.log(sortedInvestigadores);
    console.log(selectedOptions);
    const objetoBuscado = sortedInvestigadores.find(
      (item) => item.idPersona == selectedOptions
    );
    console.log(objetoBuscado);

    // Verificar si el objeto ya está en investigadoresSeleccionados antes de agregarlo
    const objetoYaAgregado = investigadoresSeleccionados.find(
      (item) => item.idPersona == selectedOptions
    );

    if (!objetoYaAgregado) {
      setInvestigadoresSeleccionados([
        ...investigadoresSeleccionados,
        objetoBuscado,
      ]);
    }
  };

  const eliminarInvestigador = (idAEliminar) => {
    // Filtrar los investigadores y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosInvestigadores = investigadoresSeleccionados.filter(
      (item) => item.idPersona !== idAEliminar
    );

    // Actualizar investigadoresSeleccionados con el nuevo arreglo
    setInvestigadoresSeleccionados(nuevosInvestigadores);
  };

  //Esto ya pertenece a lo de grupos

  useEffect(() => {
    if (siglas === "") {
      // Si no se está filtrando nada, utiliza los datos originales data?.personas
      setGrupos(data?.grupos || []);
      setFiltro(false);
    } else {
      const filteredGrupos = data?.grupos.filter((item) =>
        item.siglas.toLowerCase().includes(siglas?.toLowerCase())
      );
      setGrupos(filteredGrupos);
      setFiltro(true);
    }
  }, [siglas, data]);

  if (isLoading) {
    return <Text fontSize="md">Cargando...</Text>;
  }

  const sortedGrupos = [...grupos]?.sort((a, b) => {
    const siglasA = a.siglas.toLowerCase();
    const siglasB = b.siglas.toLowerCase();
    return siglasA.localeCompare(siglasB);
  });

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
            GRUPOS
          </Heading>

          <br />

          <Box display="flex" width="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              width="45%"
              marginLeft="2%"
            >
              <InputLabel
                placeholder="Siglas"
                id="Siglas"
                width="15vw"
                onChange={(event) => setSiglas(event.target.value)}
                value={siglas}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" width="55%">
              <Link to={"nuevo"}>
                <Button colorScheme="blue" variant="outline" mr="5">
                  Grupo +
                </Button>
              </Link>
            </Box>
          </Box>

          <br />

          {grupos && <TablaGrupos grupos={sortedGrupos} filtro={filtro} />}

          <br />
        </Box>

        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Heading as="h2" size="xl" textAlign="center">
            PRUEBA DE TABLA DE INVESTIGADORES A PROYECTOS
          </Heading>
          <br />
          <Box display="flex" width="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              width="45%"
              marginLeft="2%"
            >
              <Select
                placeholder="Integrantes"
                isSearchable={true}
                onChange={(e) => {
                  setSelectedOptions(e.target.value);
                }}
              >
                {sortedInvestigadores.map((item, index) => (
                  <option key={item.idPersona} value={item.idPersona}>
                    {item.apellido + ", " + item.nombre}
                  </option>
                ))}
              </Select>
            </Box>
            <Box display="flex" justifyContent="flex-end" width="55%">
              <Button
                colorScheme="blue"
                variant="outline"
                mr="5"
                onClick={agregarInvestigador}
              >
                Agregar
              </Button>
              <Button
                colorScheme="blue"
                variant="outline"
                mr="5"
                onClick={() => {
                  console.log(investigadoresSeleccionados);
                }}
              >
                Prueba
              </Button>
            </Box>
          </Box>
          <br />
          {/* Aca se agrega la tabla no correspondiente a la pagina */}
          <Card width="100%">
            <CardBody>
              <TableContainer>
                <Table size="sm" variant="striped" colorScheme="blackAlpha">
                  <Thead>
                    <Tr>
                      <Th textAlign="center">
                        <Text fontSize="md">Apellido y Nombre</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Grupo</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Rol</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Eliminar</Text>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {investigadoresSeleccionados
                      ?.slice(
                        currentPage * ITEMS_PER_PAGE,
                        (currentPage + 1) * ITEMS_PER_PAGE
                      )
                      .map((item, index) => {
                        return (
                          <Tr key={index}>
                            <Td textAlign="center">
                              <Text fontSize="md">
                                {item.apellido + ", " + item.nombre}
                              </Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">
                                {item.gruposinvestigacion.siglas}
                              </Text>
                            </Td>
                            <Td textAlign="center">
                              <Select
                                placeholder="Rol"
                                onChange={(e) => {
                                  setSelectedOptions(e.target.value);
                                }}
                              >
                                {roles.map((role, index) => (
                                  <option key={index} value={role}>
                                    {role}
                                  </option>
                                ))}
                              </Select>
                            </Td>
                            <Td textAlign="center">
                              <DeleteIcon
                                onClick={() =>
                                  eliminarInvestigador(item.idPersona)
                                }
                              />
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
                <HStack spacing={4} mt={4} justify="center">
                  <IconButton
                    isDisabled={currentPage === 0}
                    icon={<ChevronLeftIcon />}
                    onClick={() => {
                      handlePageChange(currentPage - 1);
                    }}
                  />

                  <Input
                    type="number"
                    value={currentPage + 1}
                    onChange={handleSelectPage}
                    style={{ width: "50px", textAlign: "center" }}
                  />

                  <Text>de {totalPages}</Text>

                  <IconButton
                    isDisabled={
                      currentPage ===
                      Math.ceil(investigadores?.length / ITEMS_PER_PAGE) - 1
                    }
                    icon={<ChevronRightIcon />}
                    onClick={() => {
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </HStack>
              </TableContainer>
            </CardBody>
          </Card>
          <br />
        </Box>
      </CardBody>
    </Card>
  );
}
