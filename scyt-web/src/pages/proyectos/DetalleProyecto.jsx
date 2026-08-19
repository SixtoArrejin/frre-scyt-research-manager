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
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { PlusSquareIcon, SmallCloseIcon } from '@chakra-ui/icons';
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

  const { data, isLoading } = useQuery(['proyecto', idProyecto], () =>
    getProyectoById(Number(idProyecto)),
  );
  const [integrantes, setIntegrantes] = useState(data?.proyecto?.participa);
  const [grupos, setGrupos] = useState(data?.proyecto?.tiene);
  const esPid = Boolean(data?.proyecto?.codPid);

  const { mutate: handleBajaInvestigador, isLoading: isBajaLoading } = useMutation({
    mutationFn: () => bajaInvestigador(idProyecto, selectedInvestigadorBaja.idPersona, fechaBaja),
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
          <br />

          <Card width="100%">
            <CardBody>
              <Text fontSize="md" fontWeight="bold">Datos del proyecto</Text>
              <br />
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                >
                  {esPid && (
                    <DisplayField
                      label="Código PID"
                      width={{ base: '100%', md: '50%' }}
                      value={data?.proyecto?.codPid}
                      mb={4}
                    />
                  )}
                  <DisplayField
                    label="Regional asociada"
                    width={{
                      base: '100%',
                      md: esPid === true ? '50%' : '100%',
                    }}
                    value={data?.proyecto?.regional}
                    mb={4}
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                >
                  <DisplayField
                    label="Denominación"
                    width={{ base: '100%', md: '100%' }}
                    value={data?.proyecto?.denominacion}
                    mb={4}
                  />
                </Box>
                {data?.proyecto?.descripcionBreve && (
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    gap={4}
                  >
                    <DisplayField
                      label="Descripción Breve"
                      width={{ base: '100%', md: '100%' }}
                      value={data?.proyecto?.descripcionBreve}
                      mb={4}
                    />
                  </Box>
                )}
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                >
                  <DisplayField
                    label="Director"
                    width={{ base: '100%', md: '50%' }}
                    value={
                      data?.proyecto?.director?.apellido +
                        ', ' +
                        data?.proyecto?.director?.nombre
                    }
                    mb={4}
                  />
                  <DisplayField
                    label="Codirector"
                    width={{ base: '100%', md: '50%' }}
                    value={
                      data?.proyecto?.codirector
                        ? data?.proyecto?.codirector?.apellido +
                            ', ' +
                            data?.proyecto?.codirector?.nombre
                        : '-'
                    }
                    mb={4}
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                >
                  <DisplayField
                    label="Fecha Inicio"
                    width={{ base: '100%', md: '50%' }}
                    value={
                      data?.proyecto?.fechaInicio
                        ? formatoFechaISOaDDMMAAAA(
                          data?.proyecto?.fechaInicio,
                        )
                        : 'No cargado'
                    }
                    mb={4}
                  />
                  <DisplayField
                    label="Fecha Fin"
                    width={{ base: '100%', md: '50%' }}
                    value={
                      data?.proyecto?.fechaFin
                        ? formatoFechaISOaDDMMAAAA(data?.proyecto?.fechaFin)
                        : 'No cargado'
                    }
                    mb={4}
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                >
                  <DisplayField
                    label="Programa"
                    width={{ base: '100%', md: '33.33%' }}
                    value={data?.proyecto?.programa}
                    mb={4}
                  />
                  <DisplayField
                    label="Tipo de proyecto"
                    width={{ base: '100%', md: '33.33%' }}
                    value={data?.proyecto?.tipoProyecto || 'No especificado'}
                    mb={4}
                  />
                  <DisplayField
                    label="Nivel TRL"
                    width={{ base: '100%', md: '33.33%' }}
                    value={data?.proyecto?.trl || '-'}
                    mb={4}
                  />
                </Box>
                {esPid && (
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    gap={4}
                  >
                    <DisplayField
                      label="Tipo Actividad"
                      width={{ base: '100%', md: '33.33%' }}
                      value={data?.proyecto?.tipoActividad}
                      mb={4}
                    />
                    <DisplayField
                      label="Estado"
                      width={{
                        base: '100%',
                        md: '33.33%',
                      }}
                      value={data?.proyecto?.estado}
                      mb={4}
                    />
                    {data?.proyecto?.estado === 'HOMOLOGADO' && (
                      <DisplayField
                        label="Disposición"
                        width={{ base: '100%', md: '33.33%' }}
                        value={data?.proyecto?.disposicion}
                        mb={4}
                      />
                    )}
                  </Box>
                )}
                <Box
                  display="flex"
                  flexDirection={{ base: 'column', md: 'row' }}
                  width="100%"
                  gap={4}
                >
                  <DisplayField
                    label="Convocatoria"
                    width={{ base: '100%', md: '50%' }}
                    value={data?.proyecto?.convocatoria}
                    mb={4}
                  />
                  {esPid && (
                    <DisplayField
                      label="Prorroga"
                      width={{ base: '100%', md: '50%' }}
                      value={data?.proyecto?.prorrogado ? 'Si' : 'No'}
                      mb={4}
                    />
                  )}
                  {!esPid && (
                    <DisplayField
                      label="Empresa/Institución"
                      width={{ base: '100%', md: '50%' }}
                      value={data?.proyecto?.empresaInstitucion}
                      mb={4}
                    />
                  )}
                </Box>
                {esPid && data?.proyecto?.prorrogado && (
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    gap={4}
                  >
                    <DisplayField
                      label="Nueva Fecha Fin"
                      width={{ base: '100%', md: '50%' }}
                      value={formatoFechaISOaDDMMAAAA(data?.proyecto?.nuevaFechaFin)}
                      mb={4}
                    />
                    {data?.proyecto?.estado === 'HOMOLOGADO' && (
                      <DisplayField
                        label="Disposición"
                        width={{ base: '100%', md: '50%' }}
                        value={data?.proyecto?.disposicion}
                        mb={4}
                      />
                    )}
                  </Box>
                )}
                <PermissionGate module="proyectos" action="edit">
                  <Box
                    display="flex"
                    width="100%"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Link to={'modificar'}>
                      <Button colorScheme="blue" variant="outline">
                          Modificar
                      </Button>
                    </Link>
                  </Box>
                </PermissionGate>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md" fontWeight="bold">Integrantes del proyecto</Text>
              <br />

              {integrantes?.length > 0 ? (
                <Tabla
                  columnas={[
                    'Rol',
                    'Apellido y Nombre',
                    'Estado En Proy.',
                    'Fecha Ingreso',
                    'Fecha Baja',
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
                    const fechaFin = data?.proyecto?.participa[index]?.fechaFin
                      ? formatoFechaISOaDDMMAAAA(
                        data.proyecto.participa[index].fechaFin,
                      )
                      : '-';
                    const estadoParticipante = item.fechaFin ? (
                      <Badge colorScheme="red">Dado de baja</Badge>
                    ) : (
                      <Badge colorScheme="green">Activo</Badge>
                    );

                    return [
                      item.rol,
                      ayn,
                      estadoParticipante,
                      fechaInicio,
                      fechaFin,
                      catUTN ? catUTN.categoria : '-',
                      catMIN ? catMIN.categoria : '-',
                      <HStack key={item.idPersona} spacing={2}>
                        <PermissionGate module="proyectos" action="view">
                          <Link to={`/investigadores/${item.idPersona}`} title="Ver perfil">
                            <PlusSquareIcon />
                          </Link>
                        </PermissionGate>
                        {!item.fechaFin && (
                          <PermissionGate module="proyectos" action="edit">
                            <Button
                              size="xs"
                              colorScheme="red"
                              variant="outline"
                              leftIcon={<SmallCloseIcon />}
                              onClick={() => openBajaModal(item)}
                            >
                              Baja
                            </Button>
                          </PermissionGate>
                        )}
                      </HStack>,
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

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md" fontWeight="bold">Grupos</Text>
              <br />

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
              <br />
              <PermissionGate module="proyectos" action="edit">
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Link to={'agregar-grupo'}>
                    <Button colorScheme="blue" variant="outline">
                      Agregar Grupo
                    </Button>
                  </Link>
                </Box>
              </PermissionGate>
            </CardBody>
          </Card>

          {(tipoProyectosInterinstitucionales?.includes(data?.proyecto?.tipoProyecto) ||
            data?.proyecto?.institucionesAsociadas?.length > 0) && (
            <>
              <br />
              <Card width="100%">
                <CardBody>
                  <Text fontSize="md" fontWeight="bold">Instituciones Asociadas</Text>
                  <br />

                  {data?.proyecto?.institucionesAsociadas?.length > 0 ? (
                    <Tabla
                      columnas={['Institución']}
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
                      text="Este proyecto no tiene instituciones asociadas."
                    />
                  )}
                </CardBody>
              </Card>
            </>
          )}

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md" fontWeight="bold">Vinculaciones</Text>
              <br />
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
              <br />
              <PermissionGate module="vinculaciones" action="create">
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Link to={'nueva-vinculacion'}>
                    <Button colorScheme="blue" variant="outline">
                        Nueva vinculación
                    </Button>
                  </Link>
                </Box>
              </PermissionGate>
            </CardBody>
          </Card>
          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md" fontWeight="bold">Propiedad Intelectual</Text>
              <br />
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
              <br />
              <PermissionGate module="propiedadIntelectual" action="create">
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Link to={'nueva-propiedad-intelectual'}>
                    <Button colorScheme="blue" variant="outline">
                        Nueva PI
                    </Button>
                  </Link>
                </Box>
              </PermissionGate>
            </CardBody>
          </Card>
          <br />
          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="flex-end"
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
        <Modal isOpen={isBajaModalOpen} onClose={() => setIsBajaModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Registrar Baja de Investigador</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>
                Registrar la desvinculación de <strong>{selectedInvestigadorBaja?.personas?.apellido} {selectedInvestigadorBaja?.personas?.nombre}</strong> de este proyecto. El historial conservará su registro previo.
              </Text>
              <FormControl isRequired>
                <FormLabel>Fecha de Baja</FormLabel>
                <Input
                  type="date"
                  value={fechaBaja}
                  onChange={(e) => setFechaBaja(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => setIsBajaModalOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" isLoading={isBajaLoading} onClick={() => handleBajaInvestigador()}>
                Confirmar Baja
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
}
