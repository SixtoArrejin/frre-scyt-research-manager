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
import investigadores from "../utils/data/investigadores.json";
import InputLabel from "../components/InputLabel";
import categorias from '../utils/data/ListaCategorias.json'
import { Link, useParams } from 'react-router-dom';
import proyectosInv from '../utils/data/proyectosInv.json';
import { getPersonaById } from "../utils/api/personasApi";
import { useQuery } from "react-query";
import { formatoFechaISOaDDMMAAAA } from "../utils/general";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function DetalleInvestigador() {

  const { idPersona } = useParams()

  const { data, isLoading, error } = useQuery(['persona'], () => getPersonaById(idPersona));
  const ayn = data?.persona.apellido + ' ' + data?.persona.nombre;

  const categoriasUTN = data?.persona.categorias.filter(categoria => categoria.tipo === "utn");
  const categoriasMIN = data?.persona.categorias.filter(categoria => categoria.tipo === "ministerio");
  categoriasUTN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  categoriasMIN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  useEffect(() => {
    console.log(categoriasUTN)
    console.log(categoriasMIN)
  }, [categoriasUTN, categoriasMIN]);

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
                <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
                  <FormControl variant="floating" id="ayn" width={{ base: '100%', md: '30%' }} mb='5vh'>
                    <Input name="ayn" placeholder="Apellido y Nombre" value={data ? ayn : ''} disabled />
                    <FormLabel>Apellido y Nombre</FormLabel>
                  </FormControl>

                  <FormControl variant="floating" id="dni" width={{ base: '100%', md: '20%' }} mb='5vh'>
                    <Input name="dni" placeholder="DNI" value={data?.persona?.dni || ''} disabled />
                    <FormLabel>DNI</FormLabel>
                  </FormControl>

                  <FormControl variant="floating" id="estado" width={{ base: '100%', md: '15%' }} mb='5vh'>
                    <Input
                      name="estado"
                      placeholder="Estado"
                      value={data ? (data.persona.activo ? 'Activo' : 'Inactivo') : ''}
                      disabled
                    />
                    <FormLabel>Estado</FormLabel>
                  </FormControl>

                  <FormControl variant="floating" id="estado" width={{ base: '100%', md: '15%' }} mb='5vh'>
                    <Input
                      name="estado"
                      placeholder="Estado"
                      value={data?.persona?.comision || ''}
                      disabled
                    />
                    <FormLabel>Comisión</FormLabel>
                  </FormControl>

                  <FormControl variant="floating" id="grupo" width={{ base: '100%', md: '15%' }} mb='5vh' >
                    <Input
                      name="grupo"
                      placeholder="Grupo"
                      value={data?.persona?.gruposinvestigacion?.siglas || ''}
                      disabled
                    />
                    <FormLabel>Grupo</FormLabel>
                  </FormControl>
                </Box>
                <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end' >
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
                        {categoriasMIN?.map((item, index) => (
                          <Tr key={index}>
                            <Td textAlign="center">
                              <Text fontSize="md">{formatoFechaISOaDDMMAAAA(item.fecha)}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.categoria}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.normativa}</Text>
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
                        {categoriasUTN?.map((item, index) => (
                          <Tr key={index}>
                            <Td textAlign="center">
                              <Text fontSize="md">{formatoFechaISOaDDMMAAAA(item.fecha)}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.categoria}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.normativa}</Text>
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