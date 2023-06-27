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
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { Search2Icon, AddIcon } from "@chakra-ui/icons";
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
import investigadores from "../Data/investigadores.json";
import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import InputLabel from '../components/InputLabel'

const ITEMS_PER_PAGE = 4; // Define el número de elementos por página

export default function ListaInvestigadores() {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  return (
    <Card>
      <CardBody>
        <Heading as="h2" size="xl" textAlign="center">
          INVESTIGADORES
        </Heading>

        <br />

        <Box display="flex" justifyContent="space-around" width='50%'>
          <InputLabel  placeholder='Nombre' id="AyN" width='15vw'/>
          <InputLabel  placeholder='Grupo' id="AyN" width='15vw'/>
          <Button colorScheme='blue' variant='outline'><Search2Icon /></Button>
        </Box>

        <br />

        <Card>
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
                  {investigadores
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
              <ReactPaginate
                previousLabel={<ChevronLeftIcon />}
                nextLabel={<ChevronRightIcon />}
                breakLabel="..."
                breakClassName="break-me"
                pageCount={Math.ceil(investigadores.length / ITEMS_PER_PAGE)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName="pagination"
                activeClassName="active"
                pageClassName="pagination-item"
                previousClassName="pagination-item"
                nextClassName="pagination-item"
                disabledClassName="pagination-disabled"
                previousLinkClassName="pagination-link"
                nextLinkClassName="pagination-link"
                pageLinkClassName="pagination-link"
              />
            </TableContainer>
          </CardBody>
        </Card>

        <br />

        <Box display="flex" justifyContent="flex-end" width='100%'>
          <Button colorScheme='blue' variant='outline' mr='5'>Nuevo Investigador</Button>
          <Button colorScheme='blue' variant='outline'>Imprimir</Button>
        </Box>
      </CardBody>
    </Card>
  );
}
