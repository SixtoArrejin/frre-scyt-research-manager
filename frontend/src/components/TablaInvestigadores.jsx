import { ChevronLeftIcon, ChevronRightIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Card, CardBody, TableContainer, Table, Thead, Tr, Th, Checkbox, Text, Tbody, Td, HStack, IconButton, Input } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 4; // Define el número de elementos por página

export default function TablaInvestigadores({ investigadores, searchNombre, searchGrupo }) {

  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual
  const [investigadoresFiltrados, setInvestigadoresFiltrados] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState(false);
  const [selectedInvestigadores, setSelectedInvestigadores] = useState([]);

  const totalPages = Math.ceil(
    ((filtroActivo ? investigadoresFiltrados : investigadores))?.length /
    ITEMS_PER_PAGE
  );

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

  const handleInvestigadorSelection = (investigadorId) => {
    setSelectedInvestigadores((prevSelected) => {
      if (prevSelected.includes(investigadorId)) {
        return prevSelected.filter((id) => id !== investigadorId);
      } else {
        return [...prevSelected, investigadorId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allInvestigadoresIds = investigadores.map((item) => item.idPersona);
      setSelectedInvestigadores(allInvestigadoresIds);
    } else {
      setSelectedInvestigadores([]);
    }
  };

  useEffect(() => {
    console.log("Investigadores seleccionados:", selectedInvestigadores);
  }, [selectedInvestigadores]);

  useEffect(() => {
    if (searchNombre === "" && searchGrupo === "") {
      setInvestigadoresFiltrados([]);
      setFiltroActivo(false);
    } else {
      const filteredInvestigadores = investigadores?.filter(
        (item) =>
          // (item.apellido.toLowerCase().includes(nombre.toLowerCase()) ||
          // item.nombre.toLowerCase().includes(nombre.toLowerCase()))
          ((item.apellido.toLowerCase() + ' ' + item.nombre.toLowerCase()).includes(searchNombre.toLowerCase())
            || (item.nombre.toLowerCase() + ' ' + item.apellido.toLowerCase()).includes(searchNombre.toLowerCase()))
          &&
          item.gruposinvestigacion.siglas.toLowerCase().includes(searchGrupo?.toLowerCase())
      );
      setInvestigadoresFiltrados(filteredInvestigadores);
      setFiltroActivo(true);
    }
    setCurrentPage(0)
  }, [searchNombre, searchGrupo]);

  const isAllSelected = selectedInvestigadores.length === investigadores.length;

  function getCategoriaMasActual(categorias, tipo) {
    // Filtrar solo las categorías del tipo deseado
    const categoriasUTN = categorias.filter((categoria) => categoria.tipo === tipo);

    // Encontrar la categoría con la fecha más actual
    const categoriaMasActual = categoriasUTN.reduce((actual, categoria) => {
      if (!actual) {
        return categoria;
      } else {
        const fechaActual = new Date(actual.fecha);
        const fechaCategoria = new Date(categoria.fecha);
        return fechaCategoria > fechaActual ? categoria : actual;
      }
    }, null);

    return categoriaMasActual;
  }


  return (
    <Card width='100%'>
      <CardBody>
        <TableContainer>
          <Table size="sm" variant="striped" colorScheme="blackAlpha">
            <Thead>
              <Tr>
                <Th textAlign="center">
                  <Checkbox
                    border="gray"
                    isChecked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Apellido y Nombre</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Estado</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Grupo</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Cat. UTN</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Cat. Min.</Text>
                </Th>
                <Th textAlign="center">
                  <Text fontSize="md">Ver más</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {(filtroActivo ? investigadoresFiltrados : investigadores)
                ?.slice(
                  currentPage * ITEMS_PER_PAGE,
                  (currentPage + 1) * ITEMS_PER_PAGE
                )
                .map((item, index) => {
                  const categoriaUTN = getCategoriaMasActual(item.categorias, "utn");
                  const categoriaMIN = getCategoriaMasActual(item.categorias, "ministerio");
                  return (
                    < Tr key={index} >
                      <Td textAlign="center">
                        <Checkbox
                          border="gray"
                          isChecked={selectedInvestigadores.includes(item.idPersona)}
                          onChange={() => handleInvestigadorSelection(item.idPersona)}
                        />
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="md">{item.apellido} {item.nombre}</Text>
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="md">{item.activo ? 'Activo' : 'Inactivo'}</Text>
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="md">{item.gruposinvestigacion.siglas}</Text>
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="md">{categoriaUTN ? categoriaUTN.categoria : "-"}</Text>
                      </Td>
                      <Td textAlign="center">
                        <Text fontSize="md">{categoriaMIN ? categoriaMIN.categoria : "-"}</Text>
                      </Td>
                      <Td textAlign="center">
                        <Link to={`/investigadores/${item.idPersona}`}><PlusSquareIcon /></Link>
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
                currentPage ===
                Math.ceil(
                  (filtroActivo
                    ? investigadoresFiltrados
                    : investigadores
                  )?.length / ITEMS_PER_PAGE
                ) - 1
              }
              icon={<ChevronRightIcon />}
              onClick={() => {
                handlePageChange(currentPage + 1);
              }}
            />
          </HStack>
        </TableContainer>
      </CardBody>
    </Card >
  );
}