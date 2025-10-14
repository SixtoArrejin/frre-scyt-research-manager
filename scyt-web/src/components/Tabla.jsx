import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Card, CardBody, TableContainer, Table, Thead, Tr, Th, Checkbox, Text, Tbody, Td, HStack, IconButton, Input } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useState } from 'react';

export default function Tabla({ columnas = [], datos = [], filtro = false, checkbox = false, paginado = true, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual

  const [selectedData, setSelectedData] = useState([]);

  const totalPages = Math.ceil(datos?.length / itemsPerPage);

  const handleSelectPage = (event) => {
    if (parseInt(event.target.value, 10) > totalPages) {
      handlePageChange(0);
    } else {
      if (parseInt(event.target.value, 10) !== '') {
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

  const handleDataSelection = (fila) => {
    setSelectedData((prevSelected) => {
      const isFilaSelected = prevSelected.some((selectedFila) => selectedFila === fila);

      if (isFilaSelected) {
        // Si la fila ya estaba seleccionada, se eliminamos del estado
        return prevSelected.filter((selectedFila) => selectedFila !== fila);
      } else {
        // Si la fila no estaba seleccionada, la agregamos al estado
        return [...prevSelected, fila];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedData(datos);
    } else {
      setSelectedData([]);
    }
  };

  const isAllSelected = selectedData.length === datos.length;

  const displayedData = paginado ? datos?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) : datos;

  return (
    <Card width='100%'>
      <CardBody>
        <TableContainer>
          <Table size='sm' variant='striped' colorScheme='blackAlpha'>
            <Thead>
              <Tr>
                {checkbox && (
                  <Th textAlign='center'>
                    <Checkbox border='gray' isChecked={isAllSelected} onChange={handleSelectAll} />
                  </Th>
                )}
                {columnas.map((column) => (
                  <Th key={column} textAlign='center'>
                    <Text fontSize='md'>{column}</Text>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {displayedData?.map((fila, filaIndex) => (
                <Tr key={filaIndex}>
                  {checkbox && (
                    <Td textAlign='center'>
                      <Checkbox border='gray' isChecked={selectedData.includes(fila)} onChange={() => handleDataSelection(fila)} />
                    </Td>
                  )}
                  {columnas.map((columna, colIndex) => (
                    <Td key={colIndex} textAlign='center'>
                      <Text fontSize='md'>{fila[colIndex]}</Text>
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
          {paginado && (
            <HStack spacing={4} mt={4} justify='center'>
              <IconButton
                isDisabled={currentPage === 0}
                icon={<ChevronLeftIcon />}
                onClick={() => {
                  handlePageChange(currentPage - 1);
                }}
              />

              <Input type='number' value={currentPage + 1} onChange={handleSelectPage} style={{ width: '50px', textAlign: 'center' }} />

              <Text>de {totalPages}</Text>

              <IconButton
                isDisabled={currentPage === Math.ceil(datos?.length / itemsPerPage) - 1}
                icon={<ChevronRightIcon />}
                onClick={() => {
                  handlePageChange(currentPage + 1);
                }}
              />
            </HStack>
          )}
        </TableContainer>
      </CardBody>
    </Card>
  );
}
