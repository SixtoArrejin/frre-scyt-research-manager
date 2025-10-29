import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
  Text,
  Box,
} from '@chakra-ui/react';

/**
 * Componente modal reutilizable para configurar filtros de exportación
 * @param {boolean} isOpen - Estado del modal
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} onExport - Función que se ejecuta al confirmar la exportación
 * @param {Object} filterConfig - Configuración de filtros disponibles
 * @param {string} title - Título del modal
 */
export default function ExportModal({ isOpen, onClose, onExport, filterConfig = {}, title = 'Exportar a Excel' }) {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedColumns, setSelectedColumns] = useState([]);

  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const handleColumnToggle = (columns) => {
    setSelectedColumns(columns);
  };

  const handleExport = () => {
    onExport({
      filters: selectedFilters,
      columns: selectedColumns.length > 0 ? selectedColumns : filterConfig.columns?.map((col) => col.key),
    });
    handleClose();
  };

  const handleClose = () => {
    setSelectedFilters({});
    setSelectedColumns([]);
    onClose();
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={handleClose} size='xl' scrollBehavior='inside'>
      <ModalOverlay
        bg="blackAlpha.400"
        backdropFilter="blur(2px) hue-rotate(90deg)"
      />
      <ModalContent maxH="80vh">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton onClick={handleClose} />
        <ModalBody>
          <VStack spacing={6} align='stretch'>
            {/* Sección de Filtros */}
            {filterConfig.filters && filterConfig.filters.length > 0 && (
              <Box>
                <Text fontSize='lg' fontWeight='bold' mb={3}>
                  Filtros
                </Text>
                {filterConfig.filters.map((filter) => (
                  <FormControl key={filter.key} mb={4}>
                    <FormLabel>{filter.label}</FormLabel>
                    {filter.type === 'select' && (
                      <select
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '4px',
                          border: '1px solid #E2E8F0',
                        }}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                        value={selectedFilters[filter.key] || ''}
                      >
                        <option value=''>Todos</option>
                        {filter.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {filter.type === 'checkbox' && (
                      <Checkbox
                        isChecked={selectedFilters[filter.key] || false}
                        onChange={(e) => handleFilterChange(filter.key, e.target.checked)}
                      >
                        {filter.checkboxLabel}
                      </Checkbox>
                    )}
                    {filter.type === 'radio' && (
                      <Stack>
                        {filter.options?.map((option) => (
                          <Checkbox
                            key={option.value}
                            isChecked={selectedFilters[filter.key] === option.value}
                            onChange={() => handleFilterChange(filter.key, option.value)}
                          >
                            {option.label}
                          </Checkbox>
                        ))}
                      </Stack>
                    )}
                  </FormControl>
                ))}
              </Box>
            )}

            {/* Divider */}
            {filterConfig.filters && filterConfig.filters.length > 0 && filterConfig.columns && filterConfig.columns.length > 0 && (
              <Divider />
            )}

            {/* Sección de Columnas */}
            {filterConfig.columns && filterConfig.columns.length > 0 && (
              <Box>
                <Text fontSize='lg' fontWeight='bold' mb={3}>
                  Columnas a exportar
                </Text>
                <CheckboxGroup value={selectedColumns} onChange={handleColumnToggle}>
                  <Stack spacing={2}>
                    {filterConfig.columns.map((column) => (
                      <Checkbox key={column.key} value={column.key}>
                        {column.label}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
                <Text fontSize='sm' color='gray.500' mt={2}>
                  {selectedColumns.length === 0 ? 'Si no seleccionas ninguna, se exportarán todas' : `${selectedColumns.length} columna(s) seleccionada(s)`}
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button ml={2} colorScheme='blue' onClick={handleExport}>
            Exportar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
