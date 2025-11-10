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
} from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  formatoFechaISOaDDMMAAAA,
  getCategoriaMasActual,
} from '../../utils/general';
import { getProyectoById } from '../../utils/api/proyectosApi';
import { getVinculacionByIdProyecto } from '../../utils/api/vinculacionesApi';
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

  const { data, isLoading } = useQuery(['proyecto', idProyecto], () =>
    getProyectoById(Number(idProyecto)),
  );
  const [integrantes, setIntegrantes] = useState(data?.proyecto?.participa);
  const [grupos, setGrupos] = useState(data?.proyecto?.tiene);
  const [esPid, setEsPId] = useState(false);

  useEffect(() => {
    setIntegrantes(data?.proyecto?.participa);
    setGrupos(data?.proyecto?.tiene);
    if (data?.proyecto?.codPid) {
      setEsPId(true);
    }
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
                  width="70%"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    {esPid && (
                      <DisplayField
                        label="Código PID"
                        width={{ base: '100%', md: '30%' }}
                        value={data?.proyecto?.codPid}
                        mb={4}
                      />
                    )}
                    <DisplayField
                      label="Regional asociada"
                      width={{
                        base: '100%',
                        md: esPid === true ? '65%' : '100%',
                      }}
                      value={data?.proyecto?.regional}
                      mb={4}
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <DisplayField
                      label="Denominación"
                      width={{ base: '100%', md: '100%' }}
                      value={data?.proyecto?.denominacion}
                      mb={4}
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <DisplayField
                      label="Director"
                      width={{ base: '100%', md: '47.5%' }}
                      value={
                        data?.proyecto?.director?.apellido +
                        ', ' +
                        data?.proyecto?.director?.nombre
                      }
                      mb={4}
                    />
                    <DisplayField
                      label="Codirector"
                      width={{ base: '100%', md: '47.5%' }}
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
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <DisplayField
                      label="Fecha Inicio"
                      width={{ base: '100%', md: '47.5%' }}
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
                      width={{ base: '100%', md: '47.5%' }}
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
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <DisplayField
                      label="Programa"
                      width={{ base: '100%', md: '47.5%' }}
                      value={data?.proyecto?.programa}
                      mb={4}
                    />
                    <DisplayField
                      label="Tipo de proyecto"
                      width={{ base: '100%', md: '47.5%' }}
                      value={data?.proyecto?.tipoProyecto}
                      mb={4}
                    />
                  </Box>
                  {esPid && (
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <DisplayField
                        label="Tipo Actividad"
                        width={{ base: '100%', md: '30%' }}
                        value={data?.proyecto?.tipoActividad}
                        mb={4}
                      />
                      <DisplayField
                        label="Estado"
                        width={{
                          base: '100%',
                          md:
                            data?.proyecto?.estado === 'HOMOLOGADO'
                              ? '30%'
                              : '65%',
                        }}
                        value={data?.proyecto?.estado}
                        mb={4}
                      />
                      {data?.proyecto?.estado === 'HOMOLOGADO' && (
                        <DisplayField
                          label="Disposición"
                          width={{ base: '100%', md: '30%' }}
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
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <DisplayField
                      label="Convocatoria"
                      width={{ base: '100%', md: '47.5%' }}
                      value={data?.proyecto?.convocatoria}
                      mb={4}
                    />
                    {esPid && (
                      <DisplayField
                        label="Prorroga"
                        width={{ base: '100%', md: '47.5%' }}
                        value={data?.proyecto?.prorrogado ? 'Si' : 'No'}
                        mb={4}
                      />
                    )}
                    {!esPid && (
                      <DisplayField
                        label="Empresa/Institución"
                        width={{ base: '100%', md: '47.5%' }}
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
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <DisplayField
                        label="Nueva Fecha Fin"
                        width={{ base: '100%', md: '47.5%' }}
                        value={formatoFechaISOaDDMMAAAA(data?.proyecto?.nuevaFechaFin)}
                        mb={4}
                      />
                      {data?.proyecto?.estado === 'HOMOLOGADO' && (
                        <DisplayField
                          label="Disposición"
                          width={{ base: '100%', md: '47.5%' }}
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
                    'Estado',
                    'Fecha Ingreso',
                    'Cat. UTN',
                    'Cat. MIN.',
                    'Más',
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
                    return [
                      item.rol,
                      ayn,
                      item.personas.activo ? 'Activo' : 'Inactivo',
                      data?.proyecto?.participa[index]?.fechaInicio
                        ? formatoFechaISOaDDMMAAAA(
                          data.proyecto.participa[index].fechaInicio,
                        )
                        : '-',
                      catUTN ? catUTN.categoria : '-',
                      catMIN ? catMIN.categoria : '-',
                      <Link key={item.idPersona} to={`/investigadores/${item.idPersona}`}>
                        <PlusSquareIcon />
                      </Link>,
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
      </CardBody>
    </Card>
  );
}
