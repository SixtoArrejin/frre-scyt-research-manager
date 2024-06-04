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
import { Input, HStack, Flex, Spacer, Stack } from "@chakra-ui/react";
import { getAllPersonas } from "../utils/api/personasApi";
import { getAllGrupos } from "../utils/api/gruposApi";
import { getProyectos } from "../utils/api/proyectosApi";
import { getVinculaciones } from "../utils/api/vinculacionesApi"; 
import { useQuery } from "react-query";

export default function Home() {
  const {
    data: dataPersonas,
    isLoading,
    error,
  } = useQuery("personas", () => getAllPersonas());
  const { data: dataGrupos } = useQuery("grupos", () => getAllGrupos());
  const { data: dataProyectos } = useQuery("proyectos", () => getProyectos());
  const { data: dataVinculaciones } = useQuery("vinculaciones", () => getVinculaciones());

  // Número total de personas
  const totalPersonas = dataPersonas?.personas?.length;

  // Número de personas activas
  const personasActivas = dataPersonas?.personas?.filter(
    (persona) => persona.activo
  ).length;

  // Número total de grupos
  const totalGrupos = dataGrupos?.grupos?.length;

  // Número total de proyectos
  const totalProyectos = dataProyectos?.proyectos?.length;

  // Número de proyectos no completos
  const proyectosNoCompletos = dataProyectos?.proyectos?.filter(
    (proyecto) => !proyecto.completo
  ).length;

    // Número total de vinculaciones
    const totalVinculaciones = dataVinculaciones?.vinculaciones?.length;

    // Número de vinculaciones externes
    const vinculacionesExternas = dataVinculaciones?.vinculaciones?.filter(
      (vinculacion) => vinculacion.vinculacionessinfinanciamiento === null
    ).length;
  return (
    <Box margin="10px" display="flex" justifyContent="center" marginTop="3rem">
      <Stack
        direction={{ base: "column", md: "row" }}
        wrap="wrap"
        spacing="30px"
        justify="center"
        align="center"
        w="100%"
      >
        <Card key={1} w="300px" minHeight="100px">
          <CardBody>
            <Flex justifyContent="center" alignItems="baseline">
              <Text fontSize="6xl">{personasActivas}</Text>
              <Text fontSize="6xl">/</Text>
              <Text fontSize="3xl">{totalPersonas}</Text>
            </Flex>
          </CardBody>
          <CardFooter
            marginTop="-10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="xs" textTransform="uppercase" textAlign="center">
              Investigadores Activos
            </Heading>
          </CardFooter>
        </Card>
        <Card key={1} w="300px" minHeight="100px">
          <CardBody>
            <Flex justifyContent="center" alignItems="baseline">
              <Text fontSize="6xl">{proyectosNoCompletos}</Text>
              <Text fontSize="6xl">/</Text>
              <Text fontSize="3xl">{totalProyectos}</Text>
            </Flex>
          </CardBody>
          <CardFooter
            marginTop="-10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="xs" textTransform="uppercase" textAlign="center">
              Proyectos Activos
            </Heading>
          </CardFooter>
        </Card>
        <Card key={1} w="300px" minHeight="100px">
          <CardBody>
            <Flex justifyContent="center" alignItems="baseline">
              <Text fontSize="6xl">{vinculacionesExternas}</Text>
              <Text fontSize="6xl">/</Text>
              <Text fontSize="3xl">{totalVinculaciones}</Text>
            </Flex>
          </CardBody>
          <CardFooter
            marginTop="-10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="xs" textTransform="uppercase" textAlign="center">
              Vinculaciones Externas
            </Heading>
          </CardFooter>
        </Card>
        <Card key={1} w="300px" minHeight="100px">
          <CardBody>
            <Flex justifyContent="center" alignItems="baseline">
              <Text fontSize="6xl">{totalGrupos}</Text>
            </Flex>
          </CardBody>
          <CardFooter
            marginTop="-10%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Heading size="xs" textTransform="uppercase" textAlign="center">
              Grupos de investigacion
            </Heading>
          </CardFooter>
        </Card>
      </Stack>
    </Box>
  );
}
