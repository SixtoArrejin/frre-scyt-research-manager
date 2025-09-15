import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Text,
  Heading,
  Box,
  Button,
  Spinner,
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
import GenericInput from '../../components/formControls/GenericInput';
import Tabla from '../../components/Tabla';
import ImgDefault from '../../components/ImgDefault';
import NoData from '../../img/no-data.png';
import NoData2 from '../../img/no-data-2.png';
import NoData3 from '../../img/no-data-3.png';

export default function DetalleProyectoPid() {
  const { idProyecto } = useParams();

  const { data, isLoading } = useQuery(['proyecto', idProyecto], () =>
    getProyectoById(Number(idProyecto)),
  );
  const [integrantes, setIntegrantes] = useState(data?.proyecto?.participa);
  const [grupos, setGrupos] = useState(data?.proyecto?.tiene);
  const [regionales, setRegionales] = useState(
    data?.proyecto?.regionalesAsociadas,
  );
  const [esPid, setEsPId] = useState(false);

  useEffect(() => {
    setIntegrantes(data?.proyecto?.participa);
    setGrupos(data?.proyecto?.tiene);
    setRegionales(data?.proyecto?.regionalesAsociadas);
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
    console.log(dataVinculaciones);
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
          <Heading as="h2" size="xl" textAlign="center">
            Detalles del proyecto
          </Heading>
          <br />

          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Datos del proyecto</Text>
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
                      <GenericInput
                        label="Código PID"
                        width={{ base: '100%', md: '30%' }}
                        value={data?.proyecto?.codPid}
                        isDisabled
                        mb="5vh"
                      />
                    )}
                    <GenericInput
                      label="Regional asociada"
                      width={{
                        base: '100%',
                        md: esPid === true ? '65%' : '100%',
                      }}
                      value={data?.proyecto?.regional}
                      isDisabled
                      mb="5vh"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <GenericInput
                      textArea
                      label="Denominación"
                      width={{ base: '100%', md: '100%' }}
                      value={data?.proyecto?.denominacion}
                      isDisabled
                      mb="5vh"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <GenericInput
                      label="Director"
                      width={{ base: '100%', md: '47.5%' }}
                      value={
                        data?.proyecto?.director?.apellido +
                        ', ' +
                        data?.proyecto?.director?.nombre
                      }
                      isDisabled
                      mb="5vh"
                    />
                    <GenericInput
                      label="Codirector"
                      width={{ base: '100%', md: '47.5%' }}
                      value={
                        data?.proyecto?.codirector
                          ? data?.proyecto?.codirector?.apellido +
                            ', ' +
                            data?.proyecto?.codirector?.nombre
                          : '-'
                      }
                      isDisabled
                      mb="5vh"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <GenericInput
                      label="Fecha Inicio"
                      width={{ base: '100%', md: '47.5%' }}
                      value={
                        data?.proyecto?.fechaInicio
                          ? formatoFechaISOaDDMMAAAA(
                            data?.proyecto?.fechaInicio,
                          )
                          : 'No cargado'
                      }
                      isDisabled
                      mb="5vh"
                    />
                    <GenericInput
                      label="Fecha Fin"
                      width={{ base: '100%', md: '47.5%' }}
                      value={
                        data?.proyecto?.fechaFin
                          ? formatoFechaISOaDDMMAAAA(data?.proyecto?.fechaFin)
                          : 'No cargado'
                      }
                      isDisabled
                      mb="5vh"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={{ base: 'column', md: 'row' }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <GenericInput
                      label="Programa"
                      width={{ base: '100%', md: '47.5%' }}
                      value={data?.proyecto?.programa}
                      isDisabled
                      mb="5vh"
                    />
                    <GenericInput
                      label="Tipo de proyecto"
                      width={{ base: '100%', md: '47.5%' }}
                      value={data?.proyecto?.tipoProyecto}
                      isDisabled
                      mb="5vh"
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
                      <GenericInput
                        label="Tipo Actividad"
                        width={{ base: '100%', md: '30%' }}
                        value={data?.proyecto?.tipoActividad}
                        isDisabled
                        mb="5vh"
                      />
                      <GenericInput
                        label="Estado"
                        width={{
                          base: '100%',
                          md:
                            data?.proyecto?.estado === 'HOMOLOGADO'
                              ? '30%'
                              : '65%',
                        }}
                        value={data?.proyecto?.estado}
                        isDisabled
                        mb="5vh"
                      />
                      {data?.proyecto?.estado === 'HOMOLOGADO' && (
                        <GenericInput
                          label="Disposición"
                          width={{ base: '100%', md: '30%' }}
                          value={data?.proyecto?.disposicion}
                          isDisabled
                          mb="5vh"
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
                    <GenericInput
                      label="Convocatoria"
                      width={{ base: '100%', md: '47.5%' }}
                      value={data?.proyecto?.convocatoria}
                      isDisabled
                      mb="5vh"
                    />
                    {esPid && (
                      <GenericInput
                        label="Prorroga"
                        width={{ base: '100%', md: '47.5%' }}
                        value={data?.proyecto?.prorrogado ? 'Si' : 'No'}
                        isDisabled
                        mb="5vh"
                      />
                    )}
                    {!esPid && (
                      <GenericInput
                        label="Empresa/Institución"
                        width={{ base: '100%', md: '47.5%' }}
                        value={data?.proyecto?.empresaInstitucion}
                        isDisabled
                        mb="5vh"
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
                      <GenericInput
                        label="Nueva Fecha Fin"
                        width={{ base: '100%', md: '47.5%' }}
                        value={formatoFechaISOaDDMMAAAA(data?.proyecto?.nuevaFechaFin)}
                        isDisabled
                        mb="5vh"
                      />
                      {data?.proyecto?.estado === 'HOMOLOGADO' && (
                        <GenericInput
                          label="Disposición"
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.proyecto?.disposicion}
                          isDisabled
                          mb="5vh"
                        />
                      )}
                    </Box>
                  )}
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
                </Box>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Integrantes del proyecto</Text>
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
            </CardBody>
          </Card>

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Grupos</Text>
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
            </CardBody>
          </Card>

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Regionales</Text>
              <br />

              {regionales?.length > 0 ? (
                <Tabla
                  columnas={['Nombre']}
                  datos={regionales?.map((item) => [item.nombreRegional])}
                  paginado={false}
                />
              ) : (
                <ImgDefault
                  src={NoData}
                  alt="No Data"
                  width="30%"
                  text="Este proyecto aún no tiene regionales."
                />
              )}
              <br />
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Link to={'agregar-regional'}>
                  <Button colorScheme="blue" variant="outline">
                    Agregar Regional
                  </Button>
                </Link>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Vinculaciones</Text>
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
