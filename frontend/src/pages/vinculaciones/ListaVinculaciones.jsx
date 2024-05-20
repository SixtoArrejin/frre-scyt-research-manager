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
import VinculacionesData from "../../utils/data/vinculaciones.json";

const financiamientos = ["SF", "CF"];
const columnas = [
  "Empresa/Institución",
  "Nro. Marco",
  "Financiamiento",
  "Ver Más",
];

export default function ListaInvestigadores() {
  const [empresainstitucion, setEmpresaInstitucion] = useState("");
  const [financiamiento, setFinanciamiento] = useState("");
  const [filtro, setFiltro] = useState(false);

/*   const { data, isLoading, error } = useQuery("personas", () =>
    getAllPersonas()
  ); */
  const [vinculaciones, setVinculaciones] = useState(VinculacionesData || []);

  const filas = vinculaciones?.map((item, index) => {
    return [
      item.empresainstitucion,
      item.nromarco,
      item.financiamiento,
      <Link to={`/home`}>
        <PlusSquareIcon />
      </Link>,
    ];
  });

   useEffect(() => {
    if (empresainstitucion === "" && financiamiento === "") {
      // Si no se está filtrando nada, utiliza los datos originales VinculacionesData
      setVinculaciones(VinculacionesData || []);
      setFiltro(false);
    } else {
      const filteredVinculaciones = VinculacionesData.filter(
        (item) =>
          ((
            item.empresainstitucion.toLowerCase()
          ).includes(empresainstitucion.toLowerCase()) ||
            (
              item.empresainstitucion.toLowerCase()
            ).includes(empresainstitucion.toLowerCase())) &&
          item.financiamiento.includes(financiamiento)
      );
      setVinculaciones(filteredVinculaciones);
      setFiltro(true);
    }
  }, [empresainstitucion, financiamiento]); 

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
                onChange={(event) => setEmpresaInstitucion(event.target.value)}
                value={empresainstitucion}
              />
              <FormControl variant="floating" id="financiamiento" width="15vw">
                <Select
                  placeholder="Financiamiento"
                  onChange={(event) => setFinanciamiento(event.target.value)}
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
            <Box display="flex" justifyContent="flex-end" width="55%">
              <Link to={"nuevo"}>
                <Button colorScheme="blue" variant="outline" mr="5">
                  Vinculación +
                </Button>
              </Link>
            </Box>
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
