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
import { Search2Icon, AddIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons";
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
import investigadores from "../data/investigadores.json";
import InputLabel from "../components/InputLabel";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function DetalleInvestigador() {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [investigadoresFiltrados, setInvestigadoresFiltrados] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState(false);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const totalPages = Math.ceil(
    (filtroActivo ? investigadoresFiltrados : investigadores).length /
    ITEMS_PER_PAGE
  );

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

  //handleFilter
  useEffect(() => {
    if (nombre === "" && grupo === "") {
      setInvestigadoresFiltrados([]);
      setFiltroActivo(false);
    } else {
      const filteredInvestigadores = investigadores.filter(
        (item) =>
          item.apellidoNombre.toLowerCase().includes(nombre.toLowerCase()) &&
          item.grupo.toLowerCase().includes(grupo.toLowerCase())
      );
      setInvestigadoresFiltrados(filteredInvestigadores);
      setFiltroActivo(true);
    }
    setCurrentPage(0);
  }, [nombre, grupo]);

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center' >
          <Heading as="h2" size="xl" textAlign="center">
            DETALLES INVESTIGADOR
          </Heading>

          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize="md">Datos del investigador</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='80%' alignItems='center' justifyContent='space-around' >
                  <InputLabel
                    placeholder="Apellido y Nombre"
                    id="ayn"
                    width="20vw"
                    onChange={(event) => setNombre(event.target.value)}
                    value={'Apellido Nombre'}
                  />
                  <InputLabel
                    placeholder="DNI"
                    id="dni"
                    width="20vw"
                    onChange={(event) => setGrupo(event.target.value)}
                    value={'45268597'}
                  />
                </Box>
                <br />
                <Box display='flex' width='80%' alignItems='center' justifyContent='space-around' >
                  <InputLabel
                    placeholder="Estado"
                    id="estado"
                    width="20vw"
                    onChange={(event) => setNombre(event.target.value)}
                    value={'Activo'}
                  />
                  <InputLabel
                    placeholder="Grupo Investigación"
                    id="grupo"
                    width="20vw"
                    onChange={(event) => setGrupo(event.target.value)}
                    value={'CINAPTIC'}
                  />
                </Box>
                <br />
                <Box display='flex' width='80%' alignItems='center' justifyContent='flex-end' >
                  <Button colorScheme="blue" variant="outline" mr="5">
                    Modificar
                  </Button>
                </Box>
              </Box>

            </CardBody>
          </Card>
          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <TableContainer>
                <Table size="sm" variant="striped" colorScheme="blackAlpha">
                  <Thead>
                    <Tr>
                      <Th textAlign="center">
                        <Checkbox border="gray"></Checkbox>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Apellido y Nombre</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Estado</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Grupo</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Cat. UTN</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Cat. Min.</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Ver más</Text>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(filtroActivo ? investigadoresFiltrados : investigadores)
                      .slice(
                        currentPage * ITEMS_PER_PAGE,
                        (currentPage + 1) * ITEMS_PER_PAGE
                      )
                      .map((item, index) => (
                        <Tr key={index}>
                          <Td textAlign="center">
                            <Checkbox border="gray"></Checkbox>
                          </Td>
                          <Td textAlign="center">
                            <Text fontSize="md">{item.apellidoNombre}</Text>
                          </Td>
                          <Td textAlign="center">
                            <Text fontSize="md">{item.estado}</Text>
                          </Td>
                          <Td textAlign="center">
                            <Text fontSize="md">{item.grupo}</Text>
                          </Td>
                          <Td textAlign="center">
                            <Text fontSize="md">{item.catUTN}</Text>
                          </Td>
                          <Td textAlign="center">
                            <Text fontSize="md">{item.catMin}</Text>
                          </Td>
                          <Td textAlign="center">
                            <Button colorScheme="blue" variant="outline">
                              Detalle
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
                <HStack spacing={4} mt={4} justify="center">
                  <IconButton
                    isDisabled={currentPage === 0}
                    icon={<ChevronLeftIcon />}
                    onClick={() => {
                      handlePageChange({ selected: currentPage - 1 });
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
                      Math.ceil(
                        (filtroActivo
                          ? investigadoresFiltrados
                          : investigadores
                        ).length / ITEMS_PER_PAGE
                      ) - 1
                    }
                    icon={<ChevronRightIcon />}
                    onClick={() => {
                      handlePageChange({ selected: currentPage + 1 });
                    }}
                  />
                </HStack>
              </TableContainer>
            </CardBody>
          </Card>

          <br />

          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button colorScheme="blue" variant="outline">
              Imprimir
            </Button>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}