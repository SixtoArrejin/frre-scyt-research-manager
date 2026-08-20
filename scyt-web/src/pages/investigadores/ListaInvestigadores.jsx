import React, { useState, useEffect } from 'react';
import { Card, CardBody, Heading, Box, Button, Spinner, Badge, useDisclosure, useToast } from '@chakra-ui/react';
import { PlusSquareIcon, DownloadIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { getAllPersonas } from '../../utils/api/personasApi';
import { useQuery } from 'react-query';
import Tabla from '../../components/Tabla';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { getCategoriaMasActual } from '../../utils/general';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import ImgDefault from '../../components/ImgDefault';
import NoData from '../../img/no-data.png';
import PermissionGate from '../../components/PermissionGate';
import ExportModal from '../../components/ExportModal';
import { useExcelExport } from '../../hooks/useExcelExport';
import {
  getInvestigadoresExportConfig,
  filterInvestigadores,
  prepareInvestigadoresForExport,
} from '../../utils/exportUtils/investigadoresExport';

const columnas = ['Apellido y Nombre', 'Estado', 'Grupo', 'Cat. UTN', 'Cat. Min.', 'Ver Más'];

export default function ListaInvestigadores() {
  const [nombre, setNombre] = useState('');
  const [grupo, setGrupo] = useState('');
  const [filtro, setFiltro] = useState(false);

  const { data, isLoading } = useQuery('personas', () => getAllPersonas());
  const { data: dataGrupos } = useQuery(['grupoFiltro'], () => getAllGrupos());
  const [investigadores, setInvestigadores] = useState(data?.personas || []);
  
  // Hook y estado para el modal de exportación
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { exportToExcel } = useExcelExport();
  const toast = useToast();

  const sortedInvestigadores = [...investigadores]?.sort((a, b) => {
    const apellidoA = a.apellido.toLowerCase();
    const apellidoB = b.apellido.toLowerCase();
    return apellidoA.localeCompare(apellidoB);
  });

  const filas = sortedInvestigadores?.map((item) => {
    const categoriaUTN = getCategoriaMasActual(item.categorias, 'utn');
    const categoriaMIN = getCategoriaMasActual(item.categorias, 'ministerio');
    return [
      item.apellido + ' ' + item.nombre,
      <Badge colorScheme={item.activo ? 'green' : 'red'} key={`status-${item.idPersona}`}>
        {item.activo ? 'Activo' : 'Inactivo'}
      </Badge>,
      item.gruposinvestigacion.siglas,
      categoriaUTN ? categoriaUTN.categoria : '-',
      categoriaMIN ? categoriaMIN.categoria : '-',
      <PermissionGate key={item.idPersona} module='investigadores' action='view'>
        <Link to={`/investigadores/${item.idPersona}`}>
          <PlusSquareIcon />
        </Link>
      </PermissionGate>,
    ];
  });

  useEffect(() => {
    if (nombre === '' && grupo === '') {
      // Si no se está filtrando nada, utiliza los datos originales data?.personas
      setInvestigadores(data?.personas || []);
      setFiltro(false);
    } else {
      const filteredInvestigadores = data?.personas.filter(
        (item) =>
          ((item.apellido.toLowerCase() + ' ' + item.nombre.toLowerCase()).includes(nombre.toLowerCase()) ||
            (item.nombre.toLowerCase() + ' ' + item.apellido.toLowerCase()).includes(nombre.toLowerCase())) &&
          item.gruposinvestigacion.siglas.toLowerCase().includes(grupo?.toLowerCase()),
      );
      setInvestigadores(filteredInvestigadores);
      setFiltro(true);
    }
  }, [nombre, grupo, data]);

  // Función para manejar la exportación
  const handleExport = ({ filters, columns }) => {
    try {
      // Filtrar investigadores según los filtros seleccionados
      const filteredData = filterInvestigadores(data?.personas || [], filters);

      if (filteredData.length === 0) {
        toast({
          title: 'Sin datos',
          description: 'No hay investigadores que coincidan con los filtros seleccionados.',
          status: 'warning',
          isClosable: true,
        });
        return;
      }

      // Preparar datos para exportación
      const exportData = prepareInvestigadoresForExport(filteredData, columns);

      // Exportar a Excel
      const success = exportToExcel(exportData, 'Investigadores', 'Investigadores');

      if (success) {
        toast({
          title: 'Exportar a Excel',
          description: `Se exportaron ${filteredData.length} investigador(es) correctamente.`,
          status: 'success',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Exportar a Excel',
          description: 'Hubo un problema al exportar los datos.',
          status: 'error',
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error en la exportación:', error);
      toast({
        title: 'Exportar a Excel',
        description: 'Hubo un problema al exportar los datos.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  // Configuración de filtros para el modal
  const exportConfig = getInvestigadoresExportConfig(dataGrupos?.grupos || []);

  if (isLoading) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Investigadores
          </Heading>

          <br />

          <Box display='flex' width='100%'>
            <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
              <GenericInput label='Nombre' width='15vw' onChange={(event) => setNombre(event.target.value)} value={nombre} />
              <GenericSelect
                label='Grupo'
                placeholder='Todos'
                width={{ base: '100%', md: '50%' }}
                options={dataGrupos?.grupos?.map((grupo) => ({
                  value: grupo.siglas,
                  label: grupo.siglas,
                }))}
                onChange={(event) => setGrupo(event.target.value)}
              />
            </Box>
            <Box display='flex' justifyContent='flex-end' width='55%'>
              <PermissionGate module='investigadores' action='create'>
                <Link to={'nuevo'}>
                  <Button colorScheme='blue' variant='outline' mr='5'>
                    Investigador +
                  </Button>
                </Link>
              </PermissionGate>
            </Box>
          </Box>

          <br />

          {investigadores?.length > 0 ? (
            <Tabla columnas={columnas} datos={filas} filtro={filtro} checkbox={false} />
          ) : (
            <ImgDefault src={NoData} alt='No Data' width='30%' text='No hay investigadores para mostrar' />
          )}

          <br />

          <Box display='flex' justifyContent='flex-end' width='100%'>
            <Button colorScheme='green' variant='outline' leftIcon={<DownloadIcon />} onClick={onOpen}>
              Exportar a Excel
            </Button>
          </Box>
        </Box>
      </CardBody>

      {/* Modal de exportación */}
      <ExportModal
        isOpen={isOpen}
        onClose={onClose}
        onExport={handleExport}
        filterConfig={exportConfig}
        title='Exportar Investigadores a Excel'
      />
    </Card>
  );
}
