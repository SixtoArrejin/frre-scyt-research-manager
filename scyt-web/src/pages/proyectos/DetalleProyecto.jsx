import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Text,
  Heading,
  Box,
  Button,
  Spinner,
  HStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  SimpleGrid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import {
  PlusSquareIcon,
  SmallCloseIcon,
  ViewIcon,
  InfoOutlineIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';

const ThreeDotsIcon = (props) => (
  <Icon viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="12" cy="12" r="2.2" />
    <circle cx="12" cy="19" r="2.2" />
  </Icon>
);
import { Link, useParams } from 'react-router-dom';
import { tipoProyectosInterinstitucionales } from '../../hooks/forms/useNuevoProyectoForm';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  formatoFechaISOaDDMMAAAA,
  getCategoriaMasActual,
} from '../../utils/general';
import { getProyectoById, bajaInvestigador } from '../../utils/api/proyectosApi';
import { getVinculacionByIdProyecto } from '../../utils/api/vinculacionesApi';
import { getPropiedadIntelectualByIdProyecto } from '../../utils/api/propiedadIntelectualApi';
import DisplayField from '../../components/DisplayField';
import Tabla from '../../components/Tabla';
import ImgDefault from '../../components/ImgDefault';
import PermissionGate from '../../components/PermissionGate';
import NoData from '../../img/no-data.png';
import NoData2 from '../../img/no-data-2.png';
import NoData3 from '../../img/no-data-3.png';
import BackButton from '../../components/BackButton';

export default function DetalleProyectoPid() {
  const { idProyecto } = useParams();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isBajaModalOpen, setIsBajaModalOpen] = useState(false);
  const [selectedInvestigadorBaja, setSelectedInvestigadorBaja] = useState(null);
  const [fechaBaja, setFechaBaja] = useState(new Date().toISOString().split('T')[0]);
  const [motivoBaja, setMotivoBaja] = useState('');

  // Estado para el modal de Ver Detalles de Baja
  const [isDetalleBajaModalOpen, setIsDetalleBajaModalOpen] = useState(false);
  const [selectedInvestigadorDetalleBaja, setSelectedInvestigadorDetalleBaja] = useState(null);

  const openDetalleBajaModal = (item) => {
    setSelectedInvestigadorDetalleBaja(item);
    setIsDetalleBajaModalOpen(true);
  };

  const { data, isLoading } = useQuery(['proyecto', idProyecto], () =>
    getProyectoById(Number(idProyecto)),
  );
  const [integrantes, setIntegrantes] = useState(data?.proyecto?.participa);
  const [grupos, setGrupos] = useState(data?.proyecto?.tiene);
  const esPid = Boolean(data?.proyecto?.codPid);

  const { mutate: handleBajaInvestigador, isLoading: isBajaLoading } = useMutation({
    mutationFn: () => bajaInvestigador(idProyecto, selectedInvestigadorBaja.idPersona, fechaBaja, motivoBaja),
    onSuccess: () => {
      toast({
        title: 'Baja registrada',
        description: 'Se ha registrado la baja del investigador en el proyecto correctamente.',
        status: 'success',
        isClosable: true,
      });
      setIsBajaModalOpen(false);
      queryClient.invalidateQueries(['proyecto', idProyecto]);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo registrar la baja.',
        status: 'error',
        isClosable: true,
      });
    },
  });

  const openBajaModal = (item) => {
    setSelectedInvestigadorBaja(item);
    setFechaBaja(new Date().toISOString().split('T')[0]);
    setMotivoBaja('');
    setIsBajaModalOpen(true);
  };

  useEffect(() => {
    setIntegrantes(data?.proyecto?.participa);
    setGrupos(data?.proyecto?.tiene);
  }, [data]);

  const {
    data: dataVinculaciones,
  } = useQuery(['vinculaciones', idProyecto], () =>
    getVinculacionByIdProyecto(Number(idProyecto)),
  );
  const [vinculaciones, setVinculaciones] = useState(
    dataVinculaciones?.vinculaciones,
  );

  useEffect(() => {
    setVinculaciones(dataVinculaciones?.vinculaciones);
  }, [dataVinculaciones]);

  const {
    data: dataPropiedadIntelectual,
  } = useQuery(['propiedadIntelectual', idProyecto], () =>
    getPropiedadIntelectualByIdProyecto(Number(idProyecto)),
  );
  const [propiedadIntelectual, setPropiedadIntelectual] = useState(
    dataPropiedadIntelectual?.propiedadIntelectual,
  );

  useEffect(() => {
    setPropiedadIntelectual(dataPropiedadIntelectual?.propiedadIntelectual);
  }, [dataPropiedadIntelectual]);

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
          <HStack width='100%' justifyContent='space-between' mb={6}>
            <BackButton to='/proyectos' />
            <Heading as="h2" size="xl" textAlign="center">
              Detalles del proyecto
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>

          <Card width="100%" mb={6}>
            <CardBody>
              {/* Encabezado con título, badges informativos y botón de edición */}
              <Box
                display="flex"
                flexDirection={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                width="100%"
                mb={4}
              >
                <Box display="flex" alignItems="center" flexWrap="wrap" gap={3}>
                  <Text fontSize="md" fontWeight="bold">
                    Datos del proyecto
                  </Text>
                  <Badge
                    colorScheme={esPid ? 'green' : 'purple'}
                    borderRadius="md"
                    px={2}
                    py={0.5}
                  >
                    {esPid ? 'PID' : 'Externo'}
                  </Badge>
                  {data?.proyecto?.estado && (
                    <Badge
                      colorScheme={
                        data?.proyecto?.estado === 'HOMOLOGADO'
                          ? 'green'
                          : data?.proyecto?.estado === 'EN TRÁMITE'
                            ? 'orange'
                            : data?.proyecto?.estado === 'CANCELADO'
                              ? 'red'
                              : 'blue'
                      }
                      borderRadius="md"
                      px={2}
                      py={0.5}
                    >
                      {data.proyecto.estado}
                    </Badge>
                  )}
                  {data?.proyecto?.trl && (
                    <Badge
                      colorScheme="teal"
                      borderRadius="md"
                      px={2}
                      py={0.5}
                    >
                      {data.proyecto.trl}
                    </Badge>
                  )}
                </Box>

                <PermissionGate module="proyectos" action="edit">
                  <Link to={'modificar'}>
                    <Button colorScheme="blue" variant="outline" size="sm">
                      Modificar
                    </Button>
                  </Link>
                </PermissionGate>
              </Box>

              {/* Grilla balanceada de datos en 2 columnas simétricas */}
              <Box display="flex" width="100%" flexDirection="column">
                {/* Fila 1: Código PID / Empresa + Regional */}
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                  mb={4}
                >
                  {esPid ? (
                    <DisplayField
                      label="Código PID"
                      width={{ base: '100%', md: '50%' }}
                      value={data?.proyecto?.codPid || '-'}
                      mb={0}
                    />
                  ) : (
                    <DisplayField
                      label="Empresa / Institución"
                      width={{ base: '100%', md: '50%' }}
                      value={data?.proyecto?.empresaInstitucion || '-'}
                      mb={0}
                    />
                  )}
                  <DisplayField
                    label="Regional asociada"
                    width={{ base: '100%', md: '50%' }}
                    value={data?.proyecto?.regional || '-'}
                    mb={0}
                  />
                </Box>

                {/* Fila 2: Denominación a 100% */}
                <Box display="flex" width="100%" mb={4}>
                  <DisplayField
                    label="Denominación"
                    width="100%"
                    value={data?.proyecto?.denominacion || '-'}
                    mb={0}
                  />
                </Box>

                {/* Fila 3: Descripción Breve a 100% (si existe) */}
                {data?.proyecto?.descripcionBreve && (
                  <Box display="flex" width="100%" mb={4}>
                    <DisplayField
                      label="Descripción Breve"
                      width="100%"
                      value={data?.proyecto?.descripcionBreve}
                      mb={0}
                    />
                  </Box>
                )}

                {/* Fila 4: Director y Codirector */}
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                  mb={4}
                >
                  <DisplayField
                    label="Director"
                    width={{ base: '100%', md: '50%' }}
                    value={
                      data?.proyecto?.director
                        ? `${data.proyecto.director.apellido}, ${data.proyecto.director.nombre}`
                        : '-'
                    }
                    mb={0}
                  />
                  <DisplayField
                    label="Codirector"
                    width={{ base: '100%', md: '50%' }}
                    value={
                      data?.proyecto?.codirector
                        ? `${data.proyecto.codirector.apellido}, ${data.proyecto.codirector.nombre}`
                        : '-'
                    }
                    mb={0}
                  />
                </Box>

                {/* Fila 5: Fecha Inicio y Fecha Fin */}
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                  mb={4}
                >
                  <DisplayField
                    label="Fecha Inicio"
                    width={{ base: '100%', md: '50%' }}
                    value={
                      data?.proyecto?.fechaInicio
                        ? formatoFechaISOaDDMMAAAA(data?.proyecto?.fechaInicio)
                        : 'No cargado'
                    }
                    mb={0}
                  />
                  <DisplayField
                    label="Fecha Fin"
                    width={{ base: '100%', md: '50%' }}
                    value={
                      data?.proyecto?.fechaFin
                        ? formatoFechaISOaDDMMAAAA(data?.proyecto?.fechaFin)
                        : 'No cargado'
                    }
                    mb={0}
                  />
                </Box>

                {/* Fila 6: Programa y Tipo de proyecto */}
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                  mb={4}
                >
                  <DisplayField
                    label="Programa"
                    width={{ base: '100%', md: '50%' }}
                    value={data?.proyecto?.programa || '-'}
                    mb={0}
                  />
                  <DisplayField
                    label="Tipo de proyecto"
                    width={{ base: '100%', md: '50%' }}
                    value={data?.proyecto?.tipoProyecto || 'No especificado'}
                    mb={0}
                  />
                </Box>

                {/* Fila 7: Convocatoria y Nivel TRL */}
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                  mb={esPid ? 4 : 0}
                >
                  <DisplayField
                    label="Convocatoria"
                    width={{ base: '100%', md: '50%' }}
                    value={data?.proyecto?.convocatoria || '-'}
                    mb={0}
                  />
                  <DisplayField
                    label="Nivel TRL"
                    width={{ base: '100%', md: '50%' }}
                    value={data?.proyecto?.trl || '-'}
                    mb={0}
                  />
                </Box>

                {/* Filas exclusivas de PID */}
                {esPid && (
                  <>
                    {/* Fila 8: Tipo Actividad y Estado */}
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      gap={4}
                      mb={4}
                    >
                      <DisplayField
                        label="Tipo Actividad"
                        width={{ base: '100%', md: '50%' }}
                        value={data?.proyecto?.tipoActividad || '-'}
                        mb={0}
                      />
                      <DisplayField
                        label="Estado"
                        width={{ base: '100%', md: '50%' }}
                        value={data?.proyecto?.estado || '-'}
                        mb={0}
                      />
                    </Box>

                    {/* Fila 9: Disposición y Prórroga */}
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      gap={4}
                      mb={data?.proyecto?.prorrogado ? 4 : 0}
                    >
                      <DisplayField
                        label="Disposición"
                        width={{ base: '100%', md: '50%' }}
                        value={data?.proyecto?.disposicion || '-'}
                        mb={0}
                      />
                      <DisplayField
                        label="Prórroga"
                        width={{ base: '100%', md: '50%' }}
                        value={data?.proyecto?.prorrogado ? 'Sí' : 'No'}
                        mb={0}
                      />
                    </Box>

                    {/* Fila 10: Datos de Prórroga (si aplica) */}
                    {data?.proyecto?.prorrogado && (
                      <Box
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                        width="100%"
                        gap={4}
                      >
                        <DisplayField
                          label="Nueva Fecha Fin"
                          width={{ base: '100%', md: '50%' }}
                          value={
                            data?.proyecto?.nuevaFechaFin
                              ? formatoFechaISOaDDMMAAAA(data?.proyecto?.nuevaFechaFin)
                              : '-'
                          }
                          mb={0}
                        />
                        <DisplayField
                          label="Nueva Disposición"
                          width={{ base: '100%', md: '50%' }}
                          value={data?.proyecto?.nuevaDisposicion || data?.proyecto?.disposicion || '-'}
                          mb={0}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </CardBody>
          </Card>

          <Card width="100%" mb={6}>
            <CardBody>
              <Text fontSize="md" fontWeight="bold" mb={4}>Integrantes del proyecto</Text>

              {integrantes?.length > 0 ? (
                <Tabla
                  columnas={[
                    'Rol',
                    'Apellido y Nombre',
                    'Estado',
                    'Fecha Ingreso',
                    'Cat. UTN',
                    'Cat. MIN.',
                    'Acciones',
                  ]}
                  datos={integrantes?.map((item, index) => {
                    const ayn =
                      item?.personas.apellido + ' ' + item?.personas.nombre;
                    const catUTN = getCategoriaMasActual(
                      item?.personas.categorias,
                      'utn',
                    );
                    const catMIN = getCategoriaMasActual(
                      item?.personas.categorias,
                      'ministerio',
                    );
                    const fechaInicio = data?.proyecto?.participa[index]?.fechaInicio
                      ? formatoFechaISOaDDMMAAAA(
                        data.proyecto.participa[index].fechaInicio,
                      )
                      : '-';
                    const estadoParticipante = item.fechaFin ? (
                      <Badge colorScheme="red" variant="subtle" px={2.5} py={1} borderRadius="full" fontWeight="bold">Dado de baja</Badge>
                    ) : (
                      <Badge colorScheme="green" variant="subtle" px={2.5} py={1} borderRadius="full" fontWeight="bold">Activo</Badge>
                    );

                    return [
                      item.rol,
                      ayn,
                      estadoParticipante,
                      fechaInicio,
                      catUTN ? catUTN.categoria : '-',
                      catMIN ? catMIN.categoria : '-',
                      <Menu key={item.idPersona} isLazy placement="bottom-end">
                        <MenuButton
                          as={IconButton}
                          aria-label="Opciones de integrante"
                          icon={<ThreeDotsIcon boxSize="18px" />}
                          variant="ghost"
                          size="sm"
                          color="gray.600"
                          borderRadius="full"
                          _hover={{ bg: 'blue.50', color: 'blue.600' }}
                          _active={{ bg: 'blue.100', color: 'blue.700' }}
                        />
                        <MenuList
                          minW="185px"
                          py={1.5}
                          px={1.5}
                          borderRadius="xl"
                          borderColor="gray.100"
                          boxShadow="0px 10px 25px -5px rgba(0, 0, 0, 0.08), 0px 8px 10px -6px rgba(0, 0, 0, 0.04)"
                        >
                          <PermissionGate module="proyectos" action="view">
                            <MenuItem
                              as={Link}
                              to={`/investigadores/${item.idPersona}`}
                              icon={<ViewIcon boxSize="15px" color="blue.500" />}
                              borderRadius="lg"
                              fontSize="sm"
                              fontWeight="500"
                              py={2}
                              px={3}
                              mb={1}
                              _hover={{ bg: 'blue.50', color: 'blue.600' }}
                            >
                              Ver perfil
                            </MenuItem>
                          </PermissionGate>

                          {!item.fechaFin ? (
                            <PermissionGate module="proyectos" action="edit">
                              <MenuItem
                                icon={<SmallCloseIcon boxSize="15px" color="red.500" />}
                                color="red.600"
                                borderRadius="lg"
                                fontSize="sm"
                                fontWeight="500"
                                py={2}
                                px={3}
                                _hover={{ bg: 'red.50', color: 'red.700' }}
                                onClick={() => openBajaModal(item)}
                              >
                                Dar de baja
                              </MenuItem>
                            </PermissionGate>
                          ) : (
                            <MenuItem
                              icon={<InfoOutlineIcon boxSize="15px" color="blue.500" />}
                              color="blue.600"
                              borderRadius="lg"
                              fontSize="sm"
                              fontWeight="500"
                              py={2}
                              px={3}
                              _hover={{ bg: 'blue.50', color: 'blue.700' }}
                              onClick={() => openDetalleBajaModal(item)}
                            >
                              Ver motivo de baja
                            </MenuItem>
                          )}
                        </MenuList>
                      </Menu>,
                    ];
                  })}
                  paginado={false}
                />
              ) : (
                <ImgDefault
                  src={NoData}
                  alt="No Data"
                  width="30%"
                  text="Este proyecto aún no tiene integrantes."
                />
              )}
              <br />
              <PermissionGate module="proyectos" action="edit">
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Link to={'agregar-investigador'}>
                    <Button colorScheme="blue" variant="outline">
                      Agregar Investigador
                    </Button>
                  </Link>
                </Box>
              </PermissionGate>
            </CardBody>
          </Card>

          <Card width="100%" mb={6}>
            <CardBody>
              <Text fontSize="md" fontWeight="bold" mb={4}>Grupos</Text>

              {grupos?.length > 0 ? (
                <Tabla
                  columnas={[
                    'Grupo',
                    'Resolución',
                    'Fecha de creación',
                    'Ver más',
                  ]}
                  datos={grupos?.map((item) => [
                    item.gruposinvestigacion?.siglas,
                    item.gruposinvestigacion?.resolucion,
                    formatoFechaISOaDDMMAAAA(
                      item.gruposinvestigacion?.fechaCreacion,
                    ),
                    <Link
                      key={item.gruposinvestigacion?.idGrupoInvestigacion}
                      to={`/grupos-investigacion/${item.gruposinvestigacion?.idGrupoInvestigacion}`}
                    >
                      <PlusSquareIcon />
                    </Link>,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault
                  src={NoData2}
                  alt="No Data"
                  width="30%"
                  text="Este proyecto aún no tiene grupos."
                />
              )}
              <PermissionGate module="proyectos" action="edit">
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                  mt={4}
                >
                  <Link to={'agregar-grupo'}>
                    <Button colorScheme="blue" variant="outline" size="sm">
                      Agregar Grupo
                    </Button>
                  </Link>
                </Box>
              </PermissionGate>
            </CardBody>
          </Card>

          {(tipoProyectosInterinstitucionales?.includes(data?.proyecto?.tipoProyecto) ||
            data?.proyecto?.institucionesAsociadas?.length > 0) && (
            <Card width="100%" mb={6}>
              <CardBody>
                <Text fontSize="md" fontWeight="bold" mb={4}>
                  {data?.proyecto?.tipoProyecto === 'PID Interfacultad' || data?.proyecto?.tipoProyecto?.includes('Multifacultad')
                    ? 'Facultades Regionales Asociadas'
                    : 'Instituciones Asociadas'}
                </Text>

                {data?.proyecto?.institucionesAsociadas?.length > 0 ? (
                  <Tabla
                    columnas={[
                      data?.proyecto?.tipoProyecto === 'PID Interfacultad' || data?.proyecto?.tipoProyecto?.includes('Multifacultad')
                        ? 'Facultad Regional'
                        : 'Institución',
                    ]}
                    datos={data?.proyecto?.institucionesAsociadas?.map((item) => [
                      item.nombreInstitucion,
                    ])}
                    paginado={false}
                  />
                ) : (
                  <ImgDefault
                    src={NoData}
                    alt="No Data"
                    width="30%"
                    text={
                      data?.proyecto?.tipoProyecto === 'PID Interfacultad' || data?.proyecto?.tipoProyecto?.includes('Multifacultad')
                        ? 'Este proyecto no tiene facultades regionales asociadas.'
                        : 'Este proyecto no tiene instituciones asociadas.'
                    }
                  />
                )}
              </CardBody>
            </Card>
          )}

          <Card width="100%" mb={6}>
            <CardBody>
              <Text fontSize="md" fontWeight="bold" mb={4}>Vinculaciones</Text>
              {vinculaciones?.length > 0 ? (
                <Tabla
                  columnas={[
                    'Empresa/Institución',
                    'Financiamiento',
                    'Marco',
                    'Ver más',
                  ]}
                  datos={vinculaciones?.map((item) => [
                    item.empresaInstitucion,
                    item.vinculacionesconfinanciamiento ? 'Si' : 'No',
                    item.numeroMarco,
                    <Link key={item.idVinculacion} to={`vinculacion/${item.idVinculacion}`}>
                      <PlusSquareIcon />
                    </Link>,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault
                  src={NoData3}
                  alt="No Data"
                  width="30%"
                  text="Este proyecto aún no tiene vinculaciones."
                />
              )}
              <PermissionGate module="vinculaciones" action="create">
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                  mt={4}
                >
                  <Link to={'nueva-vinculacion'}>
                    <Button colorScheme="blue" variant="outline" size="sm">
                      Nueva vinculación
                    </Button>
                  </Link>
                </Box>
              </PermissionGate>
            </CardBody>
          </Card>

          <Card width="100%" mb={6}>
            <CardBody>
              <Text fontSize="md" fontWeight="bold" mb={4}>Propiedad Intelectual</Text>
              {propiedadIntelectual?.length > 0 ? (
                <Tabla
                  columnas={[
                    'Tipo',
                    'Nro. Expediente',
                    'Fecha Inicio',
                    'Ver más',
                  ]}
                  datos={propiedadIntelectual?.map((item) => [
                    item.tipoPI,
                    item.numeroExpediente || '-',
                    formatoFechaISOaDDMMAAAA(item.fechaInicio) || '-',
                    <Link key={item.idPI} to={`propiedad-intelectual/${item.idPI}`}>
                      <PlusSquareIcon />
                    </Link>,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault
                  src={NoData3}
                  alt="No Data"
                  width="30%"
                  text="Este proyecto aún no tiene propiedad intelectual."
                />
              )}
              <PermissionGate module="propiedadIntelectual" action="create">
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                  mt={4}
                >
                  <Link to={'nueva-propiedad-intelectual'}>
                    <Button colorScheme="blue" variant="outline" size="sm">
                      Nueva PI
                    </Button>
                  </Link>
                </Box>
              </PermissionGate>
            </CardBody>
          </Card>

          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="flex-end"
            mb={2}
          >
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() =>
                alert('Generar un reporte con los detalles del proyecto')
              }
            >
              Generar Reporte
            </Button>
          </Box>
        </Box>

        {/* Modal para registrar la baja del investigador */}
        <Modal isOpen={isBajaModalOpen} onClose={() => setIsBajaModalOpen(false)} isCentered size="md">
          <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(2px)" />
          <ModalContent borderRadius="xl">
            <ModalHeader pb={2} borderBottom="1px" borderColor="gray.100" fontSize="lg">
              Registrar Baja de Investigador
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={4}>
              <Text mb={4} fontSize="sm" color="gray.600">
                Registrar la desvinculación de <strong>{selectedInvestigadorBaja?.personas?.apellido} {selectedInvestigadorBaja?.personas?.nombre}</strong> de este proyecto. El historial conservará su registro previo.
              </Text>
              <FormControl isRequired mb={4}>
                <FormLabel fontSize="sm" fontWeight="medium">Fecha de Baja</FormLabel>
                <Input
                  type="date"
                  size="sm"
                  borderRadius="md"
                  value={fechaBaja}
                  onChange={(e) => setFechaBaja(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">Motivo de Baja (Opcional)</FormLabel>
                <Textarea
                  placeholder="Ingrese el motivo o razón de la desvinculación (ej. Renuncia, Cambio de proyecto, Fin de beca...)"
                  value={motivoBaja}
                  onChange={(e) => setMotivoBaja(e.target.value)}
                  rows={3}
                  size="sm"
                  borderRadius="md"
                  resize="vertical"
                />
              </FormControl>
            </ModalBody>
            <ModalFooter pt={2} borderTop="1px" borderColor="gray.100">
              <Button variant="ghost" size="sm" mr={3} onClick={() => setIsBajaModalOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" size="sm" isLoading={isBajaLoading} onClick={() => handleBajaInvestigador()}>
                Confirmar Baja
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal para visualizar los detalles de la baja registrada */}
        <Modal isOpen={isDetalleBajaModalOpen} onClose={() => setIsDetalleBajaModalOpen(false)} isCentered size="md">
          <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(2px)" />
          <ModalContent borderRadius="xl">
            <ModalHeader pb={2} borderBottom="1px" borderColor="gray.100" fontSize="lg">
              Detalles de la Baja
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={4}>
              <Box display="flex" flexDirection="column" gap={3}>
                <DisplayField
                  label="Investigador"
                  value={`${selectedInvestigadorDetalleBaja?.personas?.apellido || ''} ${selectedInvestigadorDetalleBaja?.personas?.nombre || ''}`}
                  mb={0}
                />
                <SimpleGrid columns={2} spacing={3}>
                  <DisplayField
                    label="Rol en el Proyecto"
                    value={selectedInvestigadorDetalleBaja?.rol || '-'}
                    mb={0}
                  />
                  <DisplayField
                    label="Fecha de Ingreso"
                    value={selectedInvestigadorDetalleBaja?.fechaInicio ? formatoFechaISOaDDMMAAAA(selectedInvestigadorDetalleBaja.fechaInicio) : '-'}
                    mb={0}
                  />
                </SimpleGrid>
                <DisplayField
                  label="Fecha de Baja"
                  value={selectedInvestigadorDetalleBaja?.fechaFin ? formatoFechaISOaDDMMAAAA(selectedInvestigadorDetalleBaja.fechaFin) : '-'}
                  mb={0}
                />
                <DisplayField
                  label="Motivo de Baja"
                  value={selectedInvestigadorDetalleBaja?.motivoBaja || 'Sin motivo especificado'}
                  mb={0}
                />
              </Box>
            </ModalBody>
            <ModalFooter pt={2} borderTop="1px" borderColor="gray.100">
              <Button colorScheme="blue" size="sm" onClick={() => setIsDetalleBajaModalOpen(false)}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
}
