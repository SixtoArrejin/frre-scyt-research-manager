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

import InputLabel from "../components/InputLabel";
import { Link } from "react-router-dom";
import { getAllGrupos } from "../utils/api/gruposApi.js";
import { useQuery } from 'react-query'

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function ListaGrupos() {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [gruposFiltrados, setgruposFiltrados] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState(false);

  const { data, isLoading, error } = useQuery('grupos', () => getAllGrupos());
  const [grupos, setGrupos] = useState(data?.grupos || []);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const totalPages = Math.ceil(
    (filtroActivo ? gruposFiltrados : grupos).length / ITEMS_PER_PAGE
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
/*   useEffect(() => {
    if (grupo === "") {
      setgruposFiltrados([]);
      setFiltroActivo(false);
    } else {
      const filteredgrupos = grupos.filter((item) =>
        item.grupo.toLowerCase().includes(grupo.toLowerCase())
      );
      setgruposFiltrados(filteredgrupos);
      setFiltroActivo(true);
    }
    setCurrentPage(0);
  }, [grupo]); */

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
            GRUPOS DE INVESTIGACIÓN
          </Heading>

          <br />

          <Box display="flex" width="100%">
            <Box display="flex" width="45%" marginLeft="2%">
              <InputLabel
                placeholder="Grupo"
                id="grupo"
                width="15vw"
                onChange={(event) => setGrupo(event.target.value)}
                value={grupo}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" width="55%">
              <Button colorScheme="blue" variant="outline" mr="5" onClick={()=>{console.log(grupos)}}>
                Grupo +
              </Button>
            </Box>
          </Box>

          <br />

          <Card width="100%">
            <CardBody>
              <TableContainer>
                <Table size="sm" variant="striped" colorScheme="blackAlpha">
                  <Thead>
                    <Tr>
                      <Th textAlign="center">
                        <Text fontSize="md">Grupo</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Resolución</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Fecha creación</Text>
                      </Th>
                      <Th textAlign="center">
                        <Text fontSize="md">Ver más</Text>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {(filtroActivo ? gruposFiltrados : grupos)
                      .slice(
                        currentPage * ITEMS_PER_PAGE,
                        (currentPage + 1) * ITEMS_PER_PAGE
                      )
                      .map((item, index) => (
                        <Tr key={index}>
                          <Td textAlign="center">
                            <Text fontSize="md">{item.grupo}</Text>
                          </Td>
                          <Td textAlign="center">
                            <Text fontSize="md">{item.resolucion}</Text>
                          </Td>
                          <Td textAlign="center">
                            <Text fontSize="md">{item.fecha}</Text>
                          </Td>
                          <Td textAlign="center">
                            <Link><PlusSquareIcon onClick={() => alert("Detalle del grupo")} /></Link>
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
                        (filtroActivo ? gruposFiltrados : grupos).length /
                          ITEMS_PER_PAGE
                      ) -
                        1
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
        </Box>
      </CardBody>
    </Card>
  );
}
