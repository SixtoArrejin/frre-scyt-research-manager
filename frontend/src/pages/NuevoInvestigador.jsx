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
  RadioGroup,
  Stack,
  Radio,
  Select,
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
import { Link } from 'react-router-dom';
import proyectosInv from '../utils/data/proyectosInv.json';

export default function NuevoInvestigador() {
  const [nya, setNya] = useState('');
  const [dni, setDni] = useState('');
  const [estado, setEstado] = useState('')
  const [grupo, setGrupo] = useState('')

  const [gruposExistentes, setGruposExistentes] = useState(['CINAPTIC', 'ACHETIQ', 'OTROS'])

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center' >
          <Heading as="h2" size="xl" textAlign="center">
            NUEVO INVESTIGADOR
          </Heading>

          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize="md">Ingrese los datos del investigador</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='90%' alignItems='center' justifyContent='space-between' >
                  <FormControl
                    variant="floating"
                    id="ayn"
                    onChange={event => setNya(event.target.value)}
                    width="30vw"
                  >
                    <Input name="ayn" placeholder="Apellido y Nombre" value={nya} />
                    <FormLabel>Apellido y Nombre</FormLabel>
                  </FormControl>

                  <FormControl
                    variant="floating"
                    id="dni"
                    onChange={event => setDni(event.target.value)}
                    width="15vw"
                  >
                    <Input name="dni" type='number' placeholder="DNI" value={dni} />
                    <FormLabel>DNI</FormLabel>
                  </FormControl>

                  {/* <FormControl
                    variant="floating"
                    id="estado"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="10vw"
                  >
                    <Input name="estado" placeholder="Estado" value={estado} />
                    <FormLabel>Estado</FormLabel>
                  </FormControl> */}
                  {/* <FormControl
                    variant="floating"
                    id="grupo"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="15vw"
                  >
                    <Input name="grupo" placeholder="Grupo" value={grupo} />
                    <FormLabel>Grupo</FormLabel>
                  </FormControl> */}
                  <Select placeholder="Grupo..." width='15vw'
                    name="grupo" id="grupo"
                    onChange={event => setGrupo(event.target.value)}
                    value={grupo}>
                    {gruposExistentes.map((grupo) => (
                      <option key={grupo} value={grupo}>
                        {grupo}
                      </option>
                    ))}
                  </Select>
                </Box>
                <br />
                <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end' >
                  <Button colorScheme="gray" variant="outline" onClick={() => alert('Cancelar')} mr='3%'>
                    Cancelar
                  </Button>
                  <Button colorScheme="blue" variant="outline" onClick={() => alert('Guardar')}>
                    Guardar
                  </Button>
                </Box>
              </Box>

            </CardBody>
          </Card>

        </Box>
      </CardBody>
    </Card>
  );
}