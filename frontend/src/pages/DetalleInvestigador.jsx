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
import { Search2Icon, AddIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
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
import categorias from '../data/ListaCategorias.json'
import { Link } from 'react-router-dom';
import proyectosInv from '../data/proyectosInv.json';

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
                    <Input name="ayn" placeholder="Apellido y Nombre" value={'Apellido y Nombre'} disabled/>
                    <FormLabel>Apellido y Nombre</FormLabel>
                  </FormControl>

                  <FormControl
                    variant="floating"
                    id="dni"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="20vw"
                  >
                    <Input name="dni" placeholder="DNI" value={45268597} disabled />
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
                    <Input name="estado" placeholder="Estado" value={'Activo'} disabled />
                    <FormLabel>Estado</FormLabel>
                  </FormControl>
                  <FormControl
                    variant="floating"
                    id="grupo"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="20vw"
                  >
                    <Input name="grupo" placeholder="Grupo" value={'CINAPTIC'} disabled />
                    <FormLabel>Grupo</FormLabel>
                  </FormControl>
                </Box>
                <br />
                <Box display='flex' width='80%' alignItems='center' justifyContent='flex-end' >
                  <Button colorScheme="blue" variant="outline" onClick={() => alert('Modificar')}>
                    Modificar
                  </Button>
                </Box>
              </Box>

            </CardBody>
          </Card>

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
                              <Link><DeleteIcon onClick={() => alert('Eliminar categoría')} /></Link>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
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
                              <Link><DeleteIcon onClick={() => alert('Eliminar categoría')} /></Link>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end' >
                <Button colorScheme="blue" variant="outline" onClick={() => alert('Agregar nueva categoría')}>
                  Nueva Categoría
                </Button>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize="md">Proyectos</Text>
              <br />
              <Card width='100%'>
                <CardBody>
                  <TableContainer>
                    <Table size="sm" variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th textAlign="center">
                            <Text fontSize="md">Fec. Inicio</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Fec. Fin</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Denominación</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Tipo</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Estado</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Ing. al proyecto</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Rol</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Más</Text>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {proyectosInv.map((item, index) => (
                          <Tr key={index}>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.fechaInicio}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.fechaFin}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.denominacion}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.tipo}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.estado}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.fecInicioActividad}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.rol}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Link><PlusSquareIcon onClick={() => alert('Ver más detalles del proyecto')} /></Link>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
              <br />
            </CardBody>
          </Card>
          <br />
          <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end' >
            <Button colorScheme="blue" variant="outline" onClick={() => alert('Generar un reporte con los detalles del investigador')}>
              Generar Reporte
            </Button>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}