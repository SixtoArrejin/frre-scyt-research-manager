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
import { Search2Icon, AddIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, DeleteIcon } from "@chakra-ui/icons";
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
  FormLabel
} from "@chakra-ui/react";
import investigadores from "../data/investigadores.json";
import InputLabel from "../components/InputLabel";
import categorias from '../data/categorias.json'
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function DetalleInvestigador() {

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
                  <FormControl
                    variant="floating"
                    id="ayn"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="20vw"
                  >
                    <Input name="ayn" placeholder="Apellido y Nombre" value={'Apellido y Nombre'} />
                    <FormLabel>Apellido y Nombre</FormLabel>
                  </FormControl>

                  <FormControl
                    variant="floating"
                    id="dni"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="20vw"
                  >
                    <Input name="dni" placeholder="DNI" value={45268597} />
                    <FormLabel>DNI</FormLabel>
                  </FormControl>
                </Box>
                <br />
                <Box display='flex' width='80%' alignItems='center' justifyContent='space-around' >
                  <FormControl
                    variant="floating"
                    id="estado"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="20vw"
                  >
                    <Input name="estado" placeholder="Estado" value={'Activo'} />
                    <FormLabel>Estado</FormLabel>
                  </FormControl>
                  <FormControl
                    variant="floating"
                    id="grupo"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="20vw"
                  >
                    <Input name="grupo" placeholder="Grupo" value={'CINAPTIC'} />
                    <FormLabel>Grupo</FormLabel>
                  </FormControl>
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
              <Text fontSize="md">Categoría Ministerio</Text>
              <br />
              <Card width='100%'>
                <CardBody>
                  <TableContainer>
                    <Table size="sm" variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th textAlign="center">
                            <Text fontSize="md">Fecha</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Categoría</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Resolución</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Eliminar</Text>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {categorias.map((item, index) => (
                          <Tr key={index}>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.fecha}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.categoria}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.resolucion}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Link><DeleteIcon /></Link>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
              <br />
              <br />
              <Text fontSize="md">Categoría UTN</Text>
              <br />
              <Card width='100%'>
                <CardBody>
                  <TableContainer>
                    <Table size="sm" variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th textAlign="center">
                            <Text fontSize="md">Fecha</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Categoría</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Resolución</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Equiparación</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Eliminar</Text>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {categorias.map((item, index) => (
                          <Tr key={index}>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.fecha}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.categoria}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.resolucion}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.equiparacion ? 'SI' : 'NO'}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Link><DeleteIcon /></Link>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
            </CardBody>
          </Card>

          <br />
        </Box>
      </CardBody>
    </Card>
  );
}