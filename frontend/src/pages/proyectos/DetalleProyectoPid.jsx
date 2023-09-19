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
import { formatoFechaISOaDDMMAAAA, getCategoriaMasActual } from "../../utils/general";
import { deleteCategoriaById } from "../../utils/api/categoriasApi";
import { getProyectoById } from "../../utils/api/proyectosApi";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function DetalleProyectoPid() {

  const { idPid } = useParams()
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(["proyecto"], () => getProyectoById(Number(idPid)))
  const [integrantes, setIntegrantes] = useState(data?.proyecto?.participa)
  const [grupos, setGrupos] = useState(data?.proyecto?.tiene)
  const [proyectoPID, setProyectoPID] = useState(data?.proyecto)


  useEffect(() => {
    setIntegrantes(data?.proyecto?.participa)
    setGrupos(data?.proyecto?.tiene)
    setProyectoPID(data?.proyecto)
  }, [data])

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
                      <Input name="apellido" placeholder="Código PID" isDisabled value={data?.proyecto?.pids?.codPid} />
                      <FormLabel>Código PID</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '100%' }} mb='5vh'>
                      <Textarea placeholder='Denominación' style={{ resize: 'none' }} isDisabled value={data?.proyecto?.denominacion} />
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
                      <Input name="fechaInicio" placeholder="Fecha Inicio" isDisabled value={formatoFechaISOaDDMMAAAA(data?.proyecto?.fechaInicio)} />
                      <FormLabel>Fecha Inicio</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="fechaFin" placeholder="Fecha Fin" isDisabled value={formatoFechaISOaDDMMAAAA(data?.proyecto?.fechaFin)}/>
                      <FormLabel>Fecha Fin</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="prorroga" placeholder="Prorroga" isDisabled value={data?.proyecto?.pids?.prorrogado ? 'Si' : 'No'} />
                      <FormLabel>Prorroga</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="programa" placeholder="Programa" isDisabled value={data?.proyecto?.pids?.programa}/>
                      <FormLabel>Programa</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="tipoProyecto" placeholder="Tipo de proyecto" isDisabled value={data?.proyecto?.pids?.tipoProyecto}/>
                      <FormLabel>Tipo de proyecto</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="actividad" placeholder="Actividad" isDisabled value={data?.proyecto?.tipoActividad}/>
                      <FormLabel>Tipo Actividad</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="estado" placeholder="Estado" isDisabled value={data?.proyecto?.estado} />
                      <FormLabel>Estado</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="completo" placeholder="Completo" isDisabled value={data?.proyecto?.completo ? 'Si' : 'No'} />
                      <FormLabel>Completo</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="convocatoria" placeholder="Convocatoria" isDisabled value={data?.proyecto?.convocatoria} />
                      <FormLabel>Convocatoria</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="disposicion" placeholder="Disposición" isDisabled value={data?.proyecto?.pids?.disposicion} />
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
              <Text fontSize="md">Integrantes del proyecto</Text>
              <br />
              <Card width='100%'>
                <CardBody>
                  <TableContainer>
                    <Table size="sm" variant="striped" colorScheme="blackAlpha">
                      <Thead>
                        <Tr>
                          <Th textAlign="center">
                            <Text fontSize="md">Rol</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Apellido y Nombre</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Estado</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Fecha Ingreso</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Cat. UTN</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Cat. MIN.</Text>
                          </Th>
                          <Th textAlign="center">
                            <Text fontSize="md">Más</Text>
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {integrantes?.map((item, index) => {
                          const ayn = item?.personas.apellido + " " + item?.personas.nombre 
                          const catUTN = getCategoriaMasActual(item?.personas.categorias, 'utn')
                          const catMIN = getCategoriaMasActual(item?.personas.categorias, 'ministerio')
                          return (
                          <Tr key={index}>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.rol}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{ayn}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.personas.activo ? "Activo" : "Inactivo"}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{formatoFechaISOaDDMMAAAA(item.personas.fechaIngreso)}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{catUTN ? catUTN.categoria : "-"}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{catMIN ? catMIN.categoria : "-"}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Link to={`/investigadores/${item.idPersona}`}><PlusSquareIcon /></Link>
                            </Td>
                          </Tr>
                        )})}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </CardBody>
              </Card>
              <br />
            </CardBody>
          </Card>

          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize="md">Grupos</Text>
              <br />
              <Card width='100%'>
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
                            <Text fontSize="md">Fecha de creación</Text>
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
                              <Text fontSize="md">{item.gruposinvestigacion?.siglas}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{item.gruposinvestigacion?.resolucion}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Text fontSize="md">{formatoFechaISOaDDMMAAAA(item.gruposinvestigacion?.fechaCreacion)}</Text>
                            </Td>
                            <Td textAlign="center">
                              <Link to={`/grupos-investigacion/${item.gruposinvestigacion?.idGrupoInvestigacion}`}><PlusSquareIcon /></Link>
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