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
} from "@chakra-ui/react";
// import investigadores from "../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import { Link, useHistory, useLocation, useNavigate } from "react-router-dom";
import { getAllGrupos } from "../../utils/api/gruposApi";
import { useQuery } from "react-query";
import { getProyectos } from "../../utils/api/proyectosApi";
import Tabla from "../../components/Tabla";
import { formatoFechaISOaDDMMAAAA } from "../../utils/general";

export default function ProyectosExternosF() {
  const [denominacion, setDenominacion] = useState("");
  const [filtro, setFiltro] = useState(false);

  const { data, isLoading, error } = useQuery("proyectos", () => getProyectos("externo", "financiamiento"));
  const [proyectos, setProyectos] = useState(data?.proyectos || []);

  useEffect(() => {
    if (denominacion === "") {
      // Si no se está filtrando nada, utiliza los datos originales data?.personas
      setProyectos(data?.proyectos || []);
      setFiltro(false);
    } else {
      const filteredProyectos = data?.proyectos.filter(
        (item) =>
          item.proyectosexternos.proyectos.denominacion.toLowerCase().includes(denominacion.toLowerCase())
      );
      setProyectos(filteredProyectos);
      setFiltro(true)
    }
  }, [denominacion, data]);

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
            Proyectos Externos con Financiamiento
          </Heading>

          <br />

          <Box display="flex" width="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              width="45%"
              marginLeft="2%"
            >
              <InputLabel
                placeholder="Denominación"
                width="15vw"
                onChange={(event) => setDenominacion(event.target.value)}
                value={denominacion}
              />
            </Box>
            {/* <Box display="flex" justifyContent="flex-end" width="55%">
              <Link to={"nuevo"}>
                <Button colorScheme="blue" variant="outline" mr="5">
                  Grupo +
                </Button>
              </Link>
            </Box> */}
          </Box>
          <br />
          <Tabla
            columnas={['Año de Linea', 'Denominación', 'Empresa/Institución', 'Regional', 'Estado', 'Ver Más']}
            datos={proyectos?.map((item, index) => {
              const fechaAnioLinea = new Date(item?.proyectosexternos?.anioLinea);
              return [
                fechaAnioLinea?.getUTCFullYear(),
                item.proyectosexternos?.proyectos?.denominacion,
                item.proyectosexternos?.empresaInstitucion,
                item.proyectosexternos?.proyectos?.regional,
                item.proyectosexternos?.proyectos?.estado,
                /* <Link to={`/proyectos-pid/${item.idProyectoPid}`} > */
                <PlusSquareIcon _hover={{ cursor: "pointer" }} onClick={() => alert(`Detalle del proyecto ${item.proyectosexternos.proyectos.denominacion}`)} />
                /* </Link> */
              ]
            })}
            filtro={filtro}
          />

        </Box>
      </CardBody>
    </Card>
  );
}
