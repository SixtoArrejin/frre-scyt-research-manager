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
  Stack,
  Select,
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import {
  Search2Icon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
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
import investigadores from "../Data/investigadores.json";
import InputLabel from "../components/InputLabel";
import { Radio, RadioGroup } from "@chakra-ui/react";

export default function NuevaCategoria() {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [investigadoresFiltrados, setInvestigadoresFiltrados] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState(false);

  //handleFilter
  useEffect(() => {
    if (nombre === "" && grupo === "") {
      setInvestigadoresFiltrados([]);
      setFiltroActivo(false);
    } else {
      const filteredInvestigadores = investigadores.filter(
        (item) =>
          item.apellidoNombre.toLowerCase().includes(nombre.toLowerCase()) &&
          item.grupo.toLowerCase().includes(grupo.toLowerCase())
      );
      setInvestigadoresFiltrados(filteredInvestigadores);
      setFiltroActivo(true);
    }
    setCurrentPage(0);
  }, [nombre, grupo]);

  const [valueCategoria, setValueCategoria] = useState("1");

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
            NUEVA CATEGORIA
          </Heading>

          <br />
          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Datos de categoria</Text>
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
                  width="80%"
                  alignItems="center"
                  justifyContent="space-around"
                >
                  <Box display="flex" alignItems="center">
                    {" "}
                    <Text>Tipo de categoria: </Text>
                    <RadioGroup
                      onChange={setValueCategoria}
                      value={valueCategoria}
                    >
                      <Stack direction="row">
                        <Radio value="1">Ministerio</Radio>
                        <Radio value="2">UTN</Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>

                  <Box display="flex" alignItems="center">
                    {" "}
                    <Text>Categoria: </Text>
                    <Select placeholder="Seleccione categoría">
                      {valueCategoria == 1 ? (
                        // Categorias de Ministerio
                        <option value="1">Opción 1</option>
                      ) : (
                        // Categorias de UTN
                        <option value="2">Opción 2</option>
                      )}
                    </Select>
                  </Box>

                  <Box display="flex" alignItems="center">
                    {" "}
                    <Text>Equiparacion: </Text>
                    <RadioGroup
                      isDisabled={valueCategoria === "1"}
                    >
                      <Stack direction="row">
                        <Radio value="1">Si</Radio>
                        <Radio value="2">No</Radio>
                      </Stack>
                    </RadioGroup>
                  </Box>
                </Box>
                <br />
                <Box
                  display="flex"
                  width="80%"
                  alignItems="center"
                  justifyContent="space-around"
                >
                  <InputLabel
                    placeholder="Resolucion"
                    id="resolucion"
                  />
                </Box>
                <br />
                <Box
                  display="flex"
                  width="80%"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Button colorScheme="blue" variant="outline" mr="5">
                    Modificar
                  </Button>
                </Box>
              </Box>
            </CardBody>
          </Card>
          <br />
          <br />

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
