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
  FormControl,
  FormLabel,
  Select,
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
import { Link } from "react-router-dom";
import { getAllPersonas } from "../../utils/api/personasApi";
import { useQuery } from "react-query";
import Tabla from "../../components/Tabla";
import { getAllGrupos } from "../../utils/api/gruposApi";
import { getCategoriaMasActual } from "../../utils/general";
import { getVinculaciones } from "../../utils/api/vinculacionesApi";
// import VinculacionesData from "../../utils/data/vinculaciones.json";

const financiamientos = ["SF", "CF"];
const columnas = [
  "Empresa/Institución",
  "Nro. Marco",
  "Financiamiento",
  "Ver Más",
];

export default function ListaInvestigadores() {
  const [empresainstitucionFiltro, setEmpresaInstitucionFiltro] = useState("");
  const [financiamientoFiltro, setFinanciamientoFiltro] = useState("");
  const [filtro, setFiltro] = useState(false);

  const { data: dataVinculaciones, isLoading, error } = useQuery("vinculaciones", () =>
    getVinculaciones()
  );
  const [vinculaciones, setVinculaciones] = useState(dataVinculaciones?.vinculaciones);
  useEffect(() => {
    setVinculaciones(dataVinculaciones?.vinculaciones)
  }, [dataVinculaciones])

  const filas = vinculaciones?.map((item, index) => {
    return [
      item.empresaInstitucion,
      item.numeroMarco,
      // item.financiamiento,
      (item.vinculacionesconfinanciamiento ? "Con financiamiento" : "Sin financiamiento"),
      <Link to={`${item.idVinculacion}`}>
        <PlusSquareIcon />
      </Link>,
    ];
  });

  useEffect(() => {
    if (empresainstitucionFiltro === "" && financiamientoFiltro === "") {
      // Si no se está filtrando nada, utiliza los datos originales VinculacionesData
      setVinculaciones(dataVinculaciones?.vinculaciones || []);
      setFiltro(false);
    } else {
      const filteredVinculaciones = dataVinculaciones?.vinculaciones?.filter(
        (item) =>
        (
          item.empresaInstitucion.toLowerCase().includes(empresainstitucionFiltro.toLowerCase()) &&
          (
            financiamientoFiltro == (item.vinculacionesconfinanciamiento ? "CF" : "SF") ||
            (financiamientoFiltro != "CF" && financiamientoFiltro != "SF" )
          )
        )
      );
      setVinculaciones(filteredVinculaciones);
      setFiltro(true);
    }
  }, [empresainstitucionFiltro, financiamientoFiltro]);

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
            Vinculaciones
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
                placeholder="Empresa/Institucion"
                id="EI"
                width="15vw"
                onChange={(event) => setEmpresaInstitucionFiltro(event.target.value)}
                value={empresainstitucionFiltro}
              />
              <FormControl variant="floating" id="financiamiento" width="15vw">
                <Select
                  placeholder="Financiamiento"
                  onChange={(event) => setFinanciamientoFiltro(event.target.value)}
                >
                  {financiamientos?.map((financiamiento, key) => (
                    <option key={key} value={financiamiento}>
                      {financiamiento}
                    </option>
                  ))}
                </Select>
                <FormLabel>Financiamiento</FormLabel>
              </FormControl>
            </Box>
           {/*  <Box display="flex" justifyContent="flex-end" width="55%">
              <Link to={"nuevo"}>
                <Button colorScheme="blue" variant="outline" mr="5">
                  Vinculación +
                </Button>
              </Link>
            </Box> */}
          </Box>

          <br />

          {vinculaciones && (
            <Tabla
              columnas={columnas}
              datos={filas}
              filtro={filtro}
              checkbox={true}
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
