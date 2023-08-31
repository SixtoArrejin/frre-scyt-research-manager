import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Checkbox,
  Text,
  Tbody,
  Td,
  HStack,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatoFechaISOaDDMMAAAA } from "../utils/general";

const ITEMS_PER_PAGE = 10; // Define el número de elementos por página

export default function TablaGrupos({ grupos, filtro = false }) {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual

  const totalPages = Math.ceil(grupos?.length / ITEMS_PER_PAGE);

  const handleSelectPage = (event) => {
    if (parseInt(event.target.value, 10) > totalPages) {
      handlePageChange(0);
    } else {
      if (parseInt(event.target.value, 10) !== "") {
        const selectedPage = parseInt(event.target.value, 10);
        setCurrentPage(selectedPage - 1);
      } else {
        handlePageChange(0);
      }
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [filtro]);

  return (
    <Card width="100%">
      <CardBody>
        <TableContainer>
          <Table size="sm" variant="striped" colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th textAlign="center">
                  <Text fontSize="md">Grupo</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Resolución</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Fecha creación</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Ver más</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {grupos
                ?.slice(
                  currentPage * ITEMS_PER_PAGE,
                  (currentPage + 1) * ITEMS_PER_PAGE
                )
                .map((item, index) => {
                  return (
                    <Tr key={index}>
                      <Td textAlign="center">
                        <Text fontSize="md">{item.siglas}</Text>
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="md">{item.resolucion}</Text>
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="md">
                          {formatoFechaISOaDDMMAAAA(item.fechaCreacion)}
                        </Text>
                      </Td>
                      <Td textAlign="center">
                        <Link
                          to={`/grupos-investigacion/${item.idGrupoInvestigacion}`}
                        >
                          <PlusSquareIcon />
                        </Link>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
          <HStack spacing={4} mt={4} justify="center">
            <IconButton
              isDisabled={currentPage === 0}
              icon={<ChevronLeftIcon />}
              onClick={() => {
                handlePageChange(currentPage - 1);
              }}
            />

            <Input
              type="number"
              value={currentPage + 1}
              onChange={handleSelectPage}
              style={{ width: "50px", textAlign: "center" }}
            />

            <Text>de {totalPages}</Text>

            <IconButton
              isDisabled={
                currentPage === Math.ceil(grupos?.length / ITEMS_PER_PAGE) - 1
              }
              icon={<ChevronRightIcon />}
              onClick={() => {
                handlePageChange(currentPage + 1);
              }}
            />
          </HStack>
        </TableContainer>
      </CardBody>
    </Card>
  );
}
