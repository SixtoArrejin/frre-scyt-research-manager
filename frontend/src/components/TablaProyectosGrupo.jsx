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

export default function TablaProyectosGrupo({ investigadores }) {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual
  const [selectedInvestigadores, setSelectedInvestigadores] = useState([]);

  const totalPages = Math.ceil(investigadores?.length / ITEMS_PER_PAGE);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

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

  return (
    <Card width="100%">
      <CardBody>
        <TableContainer>
          <Table size="sm" variant="striped" colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th textAlign="center">
                  <Text fontSize="md">Fecha Inicio</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Tipo</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Director</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Codirector</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Denominación</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Estado</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Ver mas</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {investigadores
                ?.slice(
                  currentPage * ITEMS_PER_PAGE,
                  (currentPage + 1) * ITEMS_PER_PAGE
                )
                .map((item, index) => (
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
                      <Text fontSize="md">
                        {item.activo ? "Activo" : "Inactivo"}
                      </Text>
                    </Td>
                    <Td textAlign="center">
                      <Text fontSize="md">{}</Text>
                    </Td>
                    <Td textAlign="center">
                      <Link></Link>
                    </Td>
                    <Td textAlign="center">
                      <Link to={`/investigadores/${item.idPersona}`}>
                        <PlusSquareIcon />
                      </Link>
                    </Td>
                  </Tr>
                ))}
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
                currentPage ===
                Math.ceil(investigadores?.length / ITEMS_PER_PAGE) - 1
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
