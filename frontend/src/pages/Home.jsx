import {
  Card,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Box,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { getAllPersonas } from "../utils/api/personasApi";
import { getAllGrupos } from "../utils/api/gruposApi";
import { getProyectos } from "../utils/api/proyectosApi";
import { getVinculaciones } from "../utils/api/vinculacionesApi";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    data: dataPersonas,
    isLoading,
    error,
  } = useQuery("personas", () => getAllPersonas());
  const { data: dataGrupos } = useQuery("grupos", () => getAllGrupos());
  const { data: dataProyectos } = useQuery("proyectos", () => getProyectos());
  const { data: dataVinculaciones } = useQuery("vinculaciones", () =>
    getVinculaciones()
  );

  // Número total de personas
  const totalPersonas = dataPersonas?.personas?.length;

  // Personas activas
  const personasActivas = dataPersonas?.personas?.filter(
    (persona) => persona.activo
  )

  // Número de personas activas
  const personasActivasLength = dataPersonas?.personas?.filter(
    (persona) => persona.activo
  ).length;

  // Número de personas con ciertas categorias
  const [personasCategoriaUTN, setPersonasCategoriaUTN]= useState(0)
  const [personasCategoriaMinisterio, setPersonasCategoriaMinisterio]= useState(0)

  useEffect(() => {
    let contadorMinisterio = 0;
    let contadorUTN = 0;

    personasActivas?.forEach((persona) => {
      const tieneMinisterio = persona.categorias.some(
        (categoria) => categoria.tipo === "ministerio"
      );
      const tieneUTN = persona.categorias.some(
        (categoria) => categoria.tipo === "utn"
      );

      if (tieneMinisterio) {
        contadorMinisterio++;
      }

      if (tieneUTN) {
        contadorUTN++;
      }
    })
    setPersonasCategoriaMinisterio(contadorMinisterio)
    setPersonasCategoriaUTN(contadorUTN);
  }, [dataPersonas]);

  // Número total de grupos
  const totalGrupos = dataGrupos?.grupos?.length;

  // Número total de proyectos
  const totalProyectos = dataProyectos?.proyectos?.length;

  // Número de proyectos no completos
  const proyectosPID = dataProyectos?.proyectos?.filter(
    (proyecto) => proyecto.codPid
  ).length;

  // Número total de vinculaciones
  const totalVinculaciones = dataVinculaciones?.vinculaciones?.length;

  // Número de vinculaciones externes
  const vinculacionesConFinanciamiento =
    dataVinculaciones?.vinculaciones?.filter(
      (vinculacion) => vinculacion.vinculacionessinfinanciamiento === null
    ).length;

  if (isLoading) {
    return (
      <Box
        display="flex"
        height="calc(100vh - 80px - 16px - 1px - 16px)"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

  return (
    <Tabs variant="soft-rounded" colorScheme="blue" isLazy>
      <TabList>
        <Tab>Investigadores</Tab>
        <Tab>Grupos</Tab>
        <Tab>Proyectos</Tab>
        <Tab>Vinculaciones</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Flex direction="row" overflowX="auto" mt="3rem" px={4}>
            <Card key={1} w="300px" minHeight="100px" mx={2}>
              <CardBody>
                <Flex justifyContent="center" alignItems="baseline">
                  <Text fontSize="6xl">{personasActivasLength}</Text>
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
            <Card key={1} w="300px" minHeight="100px" mx={2}>
              <CardBody>
                <Flex justifyContent="center" alignItems="baseline">
                  <Text fontSize="6xl">{personasCategoriaMinisterio}</Text>
                  <Text fontSize="6xl">/</Text>
                  <Text fontSize="3xl">{personasActivasLength}</Text>
                </Flex>
              </CardBody>
              <CardFooter
                marginTop="-10%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Heading size="xs" textTransform="uppercase" textAlign="center">
                  Investigadores Categoria Ministerio
                </Heading>
              </CardFooter>
            </Card>
            <Card key={1} w="300px" minHeight="100px" mx={2}>
              <CardBody>
                <Flex justifyContent="center" alignItems="baseline">
                  <Text fontSize="6xl">{personasCategoriaUTN}</Text>
                  <Text fontSize="6xl">/</Text>
                  <Text fontSize="3xl">{personasActivasLength}</Text>
                </Flex>
              </CardBody>
              <CardFooter
                marginTop="-10%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Heading size="xs" textTransform="uppercase" textAlign="center">
                  Investigadores Categoria UTN
                </Heading>
              </CardFooter>
            </Card>
          </Flex>
        </TabPanel>
        <TabPanel>
          <Flex direction="row" overflowX="auto" mt="3rem" px={4}>
            <Card key={1} w="300px" minHeight="100px" mx={2}>
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
                  Grupos de investigación
                </Heading>
              </CardFooter>
            </Card>
          </Flex>
        </TabPanel>
        <TabPanel>
          <Flex direction="row" overflowX="auto" mt="3rem" px={4}>
            <Card key={1} w="300px" minHeight="100px" mx={2}>
              <CardBody>
                <Flex justifyContent="center" alignItems="baseline">
                  <Text fontSize="6xl">{proyectosPID}</Text>
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
                  Proyectos PID
                </Heading>
              </CardFooter>
            </Card>
            <Card key={2} w="300px" minHeight="100px" mx={2}>
              <CardBody>
                <Flex justifyContent="center" alignItems="baseline">
                  <Text fontSize="6xl">{totalProyectos - proyectosPID}</Text>
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
                  Proyectos Externos
                </Heading>
              </CardFooter>
            </Card>
          </Flex>
        </TabPanel>
        <TabPanel>
          <Flex direction="row" overflowX="auto" mt="3rem" px={4}>
            <Card key={1} w="300px" minHeight="100px" mx={2}>
              <CardBody>
                <Flex justifyContent="center" alignItems="baseline">
                  <Text fontSize="6xl">{vinculacionesConFinanciamiento}</Text>
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
                  Vinculaciones Con Financiamiento
                </Heading>
              </CardFooter>
            </Card>
            <Card key={2} w="300px" minHeight="100px" mx={2}>
              <CardBody>
                <Flex justifyContent="center" alignItems="baseline">
                  <Text fontSize="6xl">
                    {totalVinculaciones - vinculacionesConFinanciamiento}
                  </Text>
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
                  Vinculaciones Sin Financiamiento
                </Heading>
              </CardFooter>
            </Card>
          </Flex>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
