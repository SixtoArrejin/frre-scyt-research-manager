import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Heading,
  Box,
  Button,
  Spinner,
  Tooltip,
  Badge,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { PlusSquareIcon, DownloadIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProyectos } from '../../utils/api/proyectosApi';
import { getAllTiposProyectos } from '../../utils/api/tiposProyectosApi';
import Tabla from '../../components/Tabla';
import { formatoFechaISOaDDMMAAAA } from '../../utils/general';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import ImgDefault from '../../components/ImgDefault';
import NoData from '../../img/no-data-2.png';
import PermissionGate from '../../components/PermissionGate';
import ExportModal from '../../components/ExportModal';
import { useExcelExport } from '../../hooks/useExcelExport';
import {
  getProyectosExportConfig,
  filterProyectos,
  prepareProyectosForExport,
} from '../../utils/exportUtils/proyectosExport';

export default function ProyectosPid() {
  const [codPID, setCodPID] = useState('');
  const [denominacion, setDenominacion] = useState('');
  const [filtro, setFiltro] = useState(false);
  const [pidExterno, setPidExterno] = useState('todos');

  const { data, isLoading } = useQuery('proyectos', () =>
    getProyectos(),
  );
  const { data: dataTiposProyectos } = useQuery('tiposProyectos', () =>
    getAllTiposProyectos(),
  );
  const [proyectos, setProyectos] = useState([]);

  // Hook y estado para el modal de exportación
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { exportToExcel } = useExcelExport();
  const toast = useToast();

  useEffect(() => {
    if (data?.proyectos) {
      let filteredProyectos = [...data.proyectos];

      // Aplicar filtros
      if (codPID || denominacion || pidExterno !== 'todos') {
        filteredProyectos = filteredProyectos.filter((item) => {
          const matchesCodPID = codPID
            ? item.codPid &&
            item.codPid.toLowerCase().includes(codPID.toLowerCase())
            : true;
          const matchesDenominacion = denominacion
            ? item.denominacion
              .toLowerCase()
              .includes(denominacion.toLowerCase())
            : true;
          const matchesPIDExterno =
            pidExterno === 'pid'
              ? item.codPid
              : pidExterno === 'externos'
                ? !item.codPid
                : true;
          return matchesCodPID && matchesDenominacion && matchesPIDExterno;
        });
        setFiltro(true);
      } else {
        setFiltro(false);
      }

      // Ordenar por fechaInicio (de más nuevo a más viejo)
      const proyectosOrdenados = filteredProyectos.sort((a, b) => {
        const fechaA = a.fechaInicio ? new Date(a.fechaInicio) : new Date(0);
        const fechaB = b.fechaInicio ? new Date(b.fechaInicio) : new Date(0);
        return fechaB - fechaA;
      });

      setProyectos(proyectosOrdenados);
    }
  }, [data, codPID, denominacion, pidExterno]);

  // Función para manejar la exportación mediante el modal
  const handleExport = ({ filters, columns }) => {
    try {
      // Filtrar proyectos según los criterios del modal
      const filteredData = filterProyectos(data?.proyectos || [], filters);

      if (filteredData.length === 0) {
        toast({
          title: 'Sin datos',
          description: 'No hay proyectos que coincidan con los filtros seleccionados.',
          status: 'warning',
          isClosable: true,
        });
        return;
      }

      // Preparar datos para la hoja Excel
      const exportData = prepareProyectosForExport(filteredData, columns);

      // Descargar archivo Excel
      const success = exportToExcel(exportData, 'Proyectos', 'Proyectos');

      if (success) {
        toast({
          title: 'Exportar a Excel',
          description: `Se exportaron ${filteredData.length} proyecto(s) correctamente.`,
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

  const exportConfig = getProyectosExportConfig(dataTiposProyectos?.tiposProyectos || []);

  if (isLoading) {
    return (
      <Box
        display="flex"
        height="calc(100vh - 80px - 16px - 1px - 16px)"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  }

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
            Proyectos
          </Heading>

          <br />

          <Box display="flex" width="100%">
            <Box
              display="flex"
              justifyContent="space-between"
              width="85%"
              marginLeft="2%"
            >
              <GenericInput
                label="Código PID"
                width="15vw"
                value={codPID}
                onChange={(event) => setCodPID(event.target.value)}
              />
              <GenericInput
                label="Denominación"
                width="15vw"
                value={denominacion}
                onChange={(event) => setDenominacion(event.target.value)}
              />
              <GenericSelect
                name="pidExterno"
                label='Tipo Proyecto'
                width="15vw"
                options={[
                  { value: 'todos', label: 'Todos' },
                  { value: 'pid', label: 'PID' },
                  { value: 'externos', label: 'Externos' },
                ]}
                value={pidExterno}
                onChange={(event) => setPidExterno(event.target.value)}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end" width="55%">
              <PermissionGate module='proyectos' action='create'>
                <Link to={'nuevo'}>
                  <Button colorScheme="blue" variant="outline" mr="5">
                    Proyecto +
                  </Button>
                </Link>
              </PermissionGate>
            </Box>
          </Box>

          <br />
          {proyectos?.length > 0 ? (
            <Tabla
              columnas={[
                'Tipo',
                'Cod. PID',
                'Fecha Inicio',
                'Denominación',
                'TRL',
                'Estado',
                'Ver Más',
              ]}
              datos={proyectos?.map((item) => {
                const denominacion =
                  item?.denominacion === item?.denominacion.substring(0, 40)
                    ? item?.denominacion
                    : item?.denominacion.substring(0, 40) + '...';
                const externo = item?.codPid ? (
                  <Tooltip
                    openDelay={100}
                    hasArrow
                    label="Proyecto PID"
                    bg="green.500"
                    color="white"
                  >
                    <Badge colorScheme="green">
                      PID
                    </Badge>
                  </Tooltip>
                ) : (
                  <Tooltip
                    openDelay={100}
                    hasArrow
                    label="Proyecto Externo"
                    bg="blue.500"
                    color="white"
                  >
                    <Badge colorScheme="purple">
                      EXTERNO
                    </Badge>
                  </Tooltip>
                );
                const fechaInicio = item?.fechaInicio
                  ? formatoFechaISOaDDMMAAAA(item.fechaInicio)
                  : '-';
                return [
                  externo,
                  item.codPid ? item.codPid : '-',
                  fechaInicio,
                  denominacion,
                  item.trl || '-',
                  item?.estado
                    ? item?.estado.charAt(0).toUpperCase() +
                    item?.estado.toLowerCase().substring(1)
                    : '-',
                  <PermissionGate key={item.idProyecto} module='proyectos' action='view'>
                    <Link to={`/proyectos/${item.idProyecto}`}>
                      <PlusSquareIcon />
                    </Link>
                  </PermissionGate>,
                ];
              })}
              filtro={filtro}
            />
          ) : (
            <ImgDefault
              src={NoData}
              alt="No Data"
              width="30%"
              text="No hay proyectos para mostrar."
            />
          )}

          <br />

          <Box display="flex" justifyContent="flex-end" width="100%">
            <Button
              colorScheme="green"
              variant="outline"
              leftIcon={<DownloadIcon />}
              onClick={onOpen}
            >
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
        title="Exportar Proyectos a Excel"
      />
    </Card>
  );
}
