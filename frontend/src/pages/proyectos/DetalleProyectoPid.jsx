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
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from '../../utils/data/ListaCategorias.json'
import { Link, useParams } from 'react-router-dom';
import proyectosInv from '../../utils/data/proyectosInv.json';
import { getPersonaById } from "../../utils/api/personasApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatoFechaISOaDDMMAAAA } from "../../utils/general";
import { deleteCategoriaById } from "../../utils/api/categoriasApi";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function DetalleProyectoPid() {

  const { idPersona } = useParams()
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(['persona'], () => getPersonaById(idPersona));
  const ayn = data?.persona.apellido + ' ' + data?.persona.nombre;

  const toast = useToast();

  const categoriasUTN = data?.persona.categorias.filter(categoria => categoria.tipo === "utn");
  const categoriasMIN = data?.persona.categorias.filter(categoria => categoria.tipo === "ministerio");
  categoriasUTN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  categoriasMIN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const { mutate, isLoading: isLoadingMutation } = useMutation(
    {
      mutationFn: (idCategoria) => deleteCategoriaById(idCategoria),
      onSuccess: () => {
        toast({
          title: "Eliminar categoria",
          description: `Se ha eliminado la categoria exitosamente`,
          status: "info",
          isClosable: true,
        });
        queryClient.refetchQueries(['persona']);
      },
      onError: () => {
        toast({
          title: "Eliminar categoria",
          description: `Intente de nuevo.`,
          status: "error",
          isClosable: true,
        });
      },
    }
  );

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center' >
          <Heading as="h2" size="xl" textAlign="center">
            Detalles PID
          </Heading>

          <br />
          <br />


          <Card width='100%'>
            <CardBody>
              <Text fontSize="md">Datos del proyecto</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="apellido" placeholder="Apellido" />
                      <FormLabel>Código PID</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '100%' }} mb='5vh'>
                      <Textarea placeholder='Denominación' style={{ resize: 'none' }} />
                      <FormLabel>Denominación</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="apellido" placeholder="Apellido" />
                      <FormLabel>Director</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="codirector" placeholder="Codirector" />
                      <FormLabel>Codirector</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" id="fechaInicio" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="fechaInicio" placeholder="Fecha Inicio" />
                      <FormLabel>Fecha Inicio</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="fechaFin" placeholder="Fecha Fin" />
                      <FormLabel>Fecha Fin</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="prorroga" placeholder="Prorroga" />
                      <FormLabel>Prorroga</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="programa" placeholder="Programa" />
                      <FormLabel>Programa</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="tipoProyecto" placeholder="Tipo de proyecto" />
                      <FormLabel>Tipo de proyecto</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="actividad" placeholder="Actividad" />
                      <FormLabel>Actividad</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="estado" placeholder="Estado" />
                      <FormLabel>Estado</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="completo" placeholder="Completo" />
                      <FormLabel>Completo</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="convocatoria" placeholder="Convocatoria" />
                      <FormLabel>Convocatoria</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="disposicion" placeholder="Disposición" />
                      <FormLabel>Disposición</FormLabel>
                    </FormControl>
                  </Box>
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
                              <Link><DeleteIcon onClick={() => mutate(item.idCategoria)} /></Link>
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
                              <Link><DeleteIcon onClick={() => mutate(item.idCategoria)} /></Link>
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
                <Link to={`nueva-categoria`}>
                  <Button colorScheme="blue" variant="outline">
                    Nueva Categoría
                  </Button>
                </Link>
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