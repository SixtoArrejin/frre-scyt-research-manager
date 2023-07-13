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

export default function NuevoInvestigador() {

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
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="25vw"
                  >
                    <Input name="ayn" placeholder="Apellido y Nombre" value={'Apellido y Nombre'} />
                    <FormLabel>Apellido y Nombre</FormLabel>
                  </FormControl>

                  <FormControl
                    variant="floating"
                    id="dni"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="10vw"
                  >
                    <Input name="dni" placeholder="DNI" value={45268597} />
                    <FormLabel>DNI</FormLabel>
                  </FormControl>

                  <FormControl
                    variant="floating"
                    id="estado"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="10vw"
                  >
                    <Input name="estado" placeholder="Estado" value={'Activo'} />
                    <FormLabel>Estado</FormLabel>
                  </FormControl>
                  <FormControl
                    variant="floating"
                    id="grupo"
                    // onChange={event => setNombreProducto(event.target.value)}
                    width="15vw"
                  >
                    <Input name="grupo" placeholder="Grupo" value={'CINAPTIC'} />
                    <FormLabel>Grupo</FormLabel>
                  </FormControl>
                </Box>
                <br />
                <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end' >
                  <Button colorScheme="blue" variant="outline" onClick={() => alert('Modificar')}>
                    Modificar
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