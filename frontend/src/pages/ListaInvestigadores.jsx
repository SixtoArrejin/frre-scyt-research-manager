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
import { Search2Icon, AddIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, PlusSquareIcon } from "@chakra-ui/icons";
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
// import investigadores from "../utils/data/investigadores.json";
import InputLabel from "../components/InputLabel";
import { Link, useHistory, useLocation, useNavigate } from "react-router-dom";
import { getAllPersonas } from "../utils/api/personasApi";
import { useQuery } from 'react-query'
import TablaInvestigadores from "../components/TablaInvestigadores";

export default function ListaInvestigadores( {from} ) {
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");

  const { data, isLoading, error } = useQuery('personas', () => getAllPersonas());

  const investigadores = data?.personas.sort((a, b) => {
    const apellidoA = a.apellido.toUpperCase();
    const apellidoB = b.apellido.toUpperCase();

    if (apellidoA < apellidoB) {
      return -1;
    }
    if (apellidoA > apellidoB) {
      return 1;
    }
    return 0;
  });

  if (isLoading) {
    return <Text fontSize="md">Cargando...</Text>
  }

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center' >
          <Heading as="h2" size="xl" textAlign="center">
            INVESTIGADORES
          </Heading>

          <br />

          <Box display="flex" width="100%">
            <Box display="flex" justifyContent="space-between" width="45%" marginLeft="2%">
              <InputLabel
                placeholder="Nombre"
                id="AyN"
                width="15vw"
                onChange={(event) => setNombre(event.target.value)}
                value={nombre}
              />
              <InputLabel
                placeholder="Grupo"
                id="AyN"
                width="15vw"
                onChange={(event) => setGrupo(event.target.value)}
                value={grupo}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" width="55%">
              <Button colorScheme="blue" variant="outline" mr="5">
                Investigador +
              </Button>
            </Box>
          </Box>

          <br />

          {investigadores && (
            <TablaInvestigadores
              investigadores={investigadores}
              searchNombre={nombre}
              searchGrupo={grupo}
            />
          )}

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