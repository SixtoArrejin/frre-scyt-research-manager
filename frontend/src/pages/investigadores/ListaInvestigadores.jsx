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
import InputLabel from "../../components/InputLabel";
import { Link } from "react-router-dom";
import { getAllPersonas } from "../../utils/api/personasApi";
import { useQuery } from 'react-query'
import TablaInvestigadores from "../../components/TablaInvestigadores";

export default function ListaInvestigadores() {
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [filtro, setFiltro] = useState(false);

  const { data, isLoading, error } = useQuery('personas', () => getAllPersonas());
  const [investigadores, setInvestigadores] = useState(data?.personas || []);

  useEffect(() => {
    if (nombre === "" && grupo === "") {
      // Si no se está filtrando nada, utiliza los datos originales data?.personas
      setInvestigadores(data?.personas || []);
      setFiltro(false);
    } else {
      const filteredInvestigadores = data?.personas.filter(
        (item) =>
          ((item.apellido.toLowerCase() + ' ' + item.nombre.toLowerCase()).includes(nombre.toLowerCase()) ||
            (item.nombre.toLowerCase() + ' ' + item.apellido.toLowerCase()).includes(nombre.toLowerCase())) &&
          item.gruposinvestigacion.siglas.toLowerCase().includes(grupo?.toLowerCase())
      );
      setInvestigadores(filteredInvestigadores);
      setFiltro(true)
    }
  }, [nombre, grupo, data]);

  const sortedInvestigadores = [...investigadores]?.sort((a, b) => {
    const apellidoA = a.apellido.toLowerCase();
    const apellidoB = b.apellido.toLowerCase();
    return apellidoA.localeCompare(apellidoB);
  });

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
              <Link to={'nuevo'}>
                <Button colorScheme="blue" variant="outline" mr="5">
                  Investigador +
                </Button>
              </Link>
            </Box>
          </Box>

          <br />

          {investigadores && (
            <TablaInvestigadores
              investigadores={sortedInvestigadores}
              filtro={filtro}
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