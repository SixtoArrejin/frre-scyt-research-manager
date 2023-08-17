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
import TablaGrupos from "../../components/TablaGrupos";

export default function ListaGrupos() {
  const [siglas, setSiglas] = useState("");
  const [filtro, setFiltro] = useState(false);

  const { data, isLoading, error } = useQuery("grupos", () => getAllGrupos());
  const [grupos, setGrupos] = useState(data?.grupos || []);

  useEffect(() => {
    if (siglas === "") {
      // Si no se está filtrando nada, utiliza los datos originales data?.personas
      setGrupos(data?.grupos || []);
      setFiltro(false);
    } else {
      const filteredGrupos = data?.grupos.filter((item) =>
        item.siglas.toLowerCase().includes(siglas?.toLowerCase())
      );
      setGrupos(filteredGrupos);
      setFiltro(true);
    }
  }, [siglas, data]);

  if (isLoading) {
    return <Text fontSize="md">Cargando...</Text>;
  }

  const sortedGrupos = [...grupos]?.sort((a, b) => {
    const siglasA = a.siglas.toLowerCase();
    const siglasB = b.siglas.toLowerCase();
    return siglasA.localeCompare(siglasB);
  });

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
            GRUPOS
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
                placeholder="Siglas"
                id="Siglas"
                width="15vw"
                onChange={(event) => setSiglas(event.target.value)}
                value={siglas}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" width="55%">
              <Link to={"nuevo"}>
                <Button colorScheme="blue" variant="outline" mr="5">
                  Grupo +
                </Button>
              </Link>
            </Box>
          </Box>

          <br />

          {grupos && <TablaGrupos grupos={sortedGrupos} filtro={filtro} />}

          <br />

        </Box>
      </CardBody>
    </Card>
  );
}
