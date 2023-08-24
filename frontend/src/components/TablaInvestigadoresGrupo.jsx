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

const ITEMS_PER_PAGE = 4; // Define el número de elementos por página

export default function TablaInvestigadoresGrupo({
  investigadores,
  filtro = false,
}) {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual
  const [selectedInvestigadores, setSelectedInvestigadores] = useState([]);

  const totalPages = Math.ceil(investigadores?.length / ITEMS_PER_PAGE);

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
                  <Text fontSize="md">Rol</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Apellido y Nombre</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Estado</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Fecha ingreso</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Categoría</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Ver mas</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {investigadores?.slice(
                  currentPage * ITEMS_PER_PAGE,
                  (currentPage + 1) * ITEMS_PER_PAGE
                ).map((item, index) => (
                <Tr key={index}>
                  <Td textAlign="center">
                    <Text fontSize="md"></Text>
                  </Td>
                  <Td textAlign="center">
                    <Text fontSize="md">
                      {item.apellido}, {item.nombre}
                    </Text>
                  </Td>
                  <Td textAlign="center">
                    <Text fontSize="md">{}</Text>
                  </Td>
                  <Td textAlign="center">
                    <Link>
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
}
