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
import {
  Search2Icon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DeleteIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
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
  FormLabel,
} from "@chakra-ui/react";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from "../../utils/data/ListaCategorias.json";
import { Link, useParams } from "react-router-dom";
import proyectosInv from "../../utils/data/proyectosInv.json";
import { getGrupoById } from "../../utils/api/gruposApi";
import { useQuery } from "react-query";
import { formatoFechaISOaDDMMAAAA } from "../../utils/general";
import TablaInvestigadoresGrupo from "../../components/TablaInvestigadoresGrupo";
import TablaProyectosGrupo from "../../components/TablaProyectosGrupo";
import { getProyectosByIdGrupo } from "../../utils/api/proyectosApi";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function DetalleGrupo() {
  const { idGrupoInvestigacion } = useParams();

  const { data, isLoading, error } = useQuery(["grupo"], () =>
    getGrupoById(idGrupoInvestigacion)
  );

  const { data: dataProyectos} = useQuery(["proyectosGrupo"], () => getProyectosByIdGrupo(idGrupoInvestigacion))

  const [investigadores, setInvestigadores] = useState([]);
  const [sortedInvestigadores, setSortedInvestigadores] = useState([]);

  const [proyectos, setProyectos] = useState([]);

  // Este efecto se ejecutará cada vez que `data` cambie
  useEffect(() => {
    if (data && data.grupo && data.grupo.personas) {
      // Cuando tengas los datos de `grupo`, actualiza `investigadores` y `sortedInvestigadores`
      setInvestigadores(data.grupo.personas);

      const sorted = [...data.grupo.personas].sort((a, b) => {
        const apellidoA = a.apellido.toLowerCase();
        const apellidoB = b.apellido.toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      });

      setSortedInvestigadores(sorted);
    }

    if (dataProyectos && dataProyectos.proyectos) {
      setProyectos(dataProyectos.proyectos)
    }
  }, [data, dataProyectos]);


  /*   const categoriasUTN = data?.persona.categorias.filter(categoria => categoria.tipo === "utn");
  const categoriasMIN = data?.persona.categorias.filter(categoria => categoria.tipo === "ministerio");
  categoriasUTN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  categoriasMIN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  useEffect(() => {
    console.log(categoriasUTN)
    console.log(categoriasMIN)
  }, [categoriasUTN, categoriasMIN]); */

  return (
    <Card>
      <CardBody>
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Heading as="h2" size="xl" textAlign="center">
            DETALLES GRUPO
          </Heading>

          <br />
          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Datos del grupo</Text>
              <br />
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  flexDirection={{ base: "column", md: "row" }}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormControl
                    variant="floating"
                    id="ayn"
                    width={{ base: "100%", md: "30%" }}
                    mb="5vh"
                  >
                    <Input
                      name="ayn"
                      placeholder="Nombre"
                      value={data?.grupo.nombre}
                      disabled
                    />
                    <FormLabel>Nombre</FormLabel>
                  </FormControl>

                  <FormControl
                    variant="floating"
                    id="dni"
                    width={{ base: "100%", md: "20%" }}
                    mb="5vh"
                  >
                    <Input
                      name="dni"
                      placeholder="Siglas"
                      value={data?.grupo.siglas}
                      disabled
                    />
                    <FormLabel>Siglas</FormLabel>
                  </FormControl>

                  <FormControl
                    variant="floating"
                    id="estado"
                    width={{ base: "100%", md: "15%" }}
                    mb="5vh"
                  >
                    <Input
                      name="estado"
                      placeholder="Resolucion"
                      value={data?.grupo.resolucion}
                      disabled
                    />
                    <FormLabel>Resolucion</FormLabel>
                  </FormControl>

                  <FormControl
                    variant="floating"
                    id="estado"
                    width={{ base: "100%", md: "15%" }}
                    mb="5vh"
                  >
                    <Input
                      name="estado"
                      placeholder="Estado"
                      value={
                        formatoFechaISOaDDMMAAAA(data?.grupo.fechaCreacion) ||
                        ""
                      }
                      disabled
                    />
                    <FormLabel>Fecha</FormLabel>
                  </FormControl>
                </Box>
                <Box
                  display="flex"
                  width="90%"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Link to={`modificar`}>
                    <Button colorScheme="blue" variant="outline">
                      Modificar
                    </Button>
                  </Link>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Integrantes</Text>
              <br />
              <Card width="100%">
                <CardBody>
                  <TablaInvestigadoresGrupo
                    investigadores={sortedInvestigadores}
                  />
                </CardBody>
              </Card>
            </CardBody>
          </Card>

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Proyectos</Text>
              <br />
              <Card width="100%">
                <CardBody>
                  <TablaProyectosGrupo
                    proyectos={proyectos}
                  />
                </CardBody>
              </Card>
              <br />
            </CardBody>
          </Card>
          <br />
          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => console.log(sortedInvestigadores)}
            >
              Prueba aca
            </Button>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}
