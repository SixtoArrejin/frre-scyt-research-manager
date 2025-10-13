import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { getGrupoById } from '../../utils/api/gruposApi';
import { useQuery } from 'react-query';
import { formatoFechaISOaDDMMAAAA, getCategoriaMasActual } from '../../utils/general';
import { getProyectosByIdGrupo } from '../../utils/api/proyectosApi';
import Tabla from '../../components/Tabla';
import NoData from '../../img/no-data.png';
import NoData2 from '../../img/no-data-2.png';
import ImgDefault from '../../components/ImgDefault';
import DisplayField from '../../components/DisplayField';

export default function DetalleGrupo() {
  const { idGrupoInvestigacion } = useParams();

  const { data, isLoading } = useQuery(['grupo'], () => getGrupoById(idGrupoInvestigacion));

  const { data: dataProyectos } = useQuery(['proyectosGrupo'], () => getProyectosByIdGrupo(idGrupoInvestigacion));

  const [sortedInvestigadores, setSortedInvestigadores] = useState([]);

  const [proyectos, setProyectos] = useState([]);

  // Este efecto se ejecutará cada vez que `data` cambie
  useEffect(() => {
    if (data && data.grupo && data.grupo.personas) {
      // Cuando tengas los datos de `grupo`, actualiza `sortedInvestigadores`

      const sorted = [...data.grupo.personas].sort((a, b) => {
        const apellidoA = a.apellido.toLowerCase();
        const apellidoB = b.apellido.toLowerCase();
        return apellidoA.localeCompare(apellidoB);
      });

      setSortedInvestigadores(sorted);
    }

    if (dataProyectos && dataProyectos.proyectos) {
      setProyectos(dataProyectos.proyectos);
    }
  }, [data, dataProyectos]);

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
            Grupo de Investigación{data?.grupo.siglas ? `: ${data?.grupo.siglas}` : ''}
          </Heading>

          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos del grupo</Text>
              <br />
              <Box display='flex' width='100%' alignItems='flex-start' justifyContent='flex-start' flexDirection='column'>
                <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} alignItems='flex-start' justifyContent='space-between' width='100%'>
                  <DisplayField
                    label='Nombre'
                    value={data?.grupo?.nombre || ''}
                    width={{ base: '100%', md: '30%' }}
                    mb={4}
                  />

                  <DisplayField
                    label='Siglas'
                    value={data?.grupo?.siglas || ''}
                    width={{ base: '100%', md: '20%' }}
                    mb={4}
                  />

                  <DisplayField
                    label='Resolución'
                    value={data?.grupo?.resolucion || ''}
                    width={{ base: '100%', md: '20%' }}
                    mb={4}
                  />

                  <DisplayField
                    label='Fecha'
                    value={formatoFechaISOaDDMMAAAA(data?.grupo?.fechaCreacion) || ''}
                    width={{ base: '100%', md: '20%' }}
                    mb={4}
                  />
                </Box>
                <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                  <Link to={'modificar'}>
                    <Button colorScheme='blue' variant='outline'>
                      Modificar
                    </Button>
                  </Link>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Integrantes</Text>
              <br />
              {sortedInvestigadores?.length > 0 ? (
                <Tabla
                  columnas={['DNI', 'Apellido y Nombre', 'Estado', 'Fecha Ingreso', 'Categoría', 'Ver Más']}
                  datos={sortedInvestigadores?.map((item) => {
                    const categoriaMIN = getCategoriaMasActual(item.categorias, 'ministerio');
                    return [
                      item.dni,
                      item.apellido + ' ' + item.nombre,
                      item.activo ? 'Activo' : 'Inactivo',
                      formatoFechaISOaDDMMAAAA(item.fechaIngresoGrupo),
                      categoriaMIN?.categoria ? categoriaMIN?.categoria : '-',
                      <Link key={item.idPersona} to={`/investigadores/${item.idPersona}`}>
                        <PlusSquareIcon />
                      </Link>,
                    ];
                  })}
                />
              ) : (
                <ImgDefault src={NoData} alt='No Data' width='30%' text='Este grupo aún no tiene integrantes' />
              )}
            </CardBody>
          </Card>

          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Proyectos</Text>
              <br />
              {proyectos?.length > 0 ? (
                <Tabla
                  columnas={['Fecha Inicio', 'Tipo Act.', 'Director', 'Codirector', 'Denom.', 'Estado', 'Ver Más']}
                  datos={proyectos?.map((item) => {
                    return [
                      formatoFechaISOaDDMMAAAA(item.fechaInicio),
                      item.tipoActividad,
                      item.director
                        ? `${item.director.apellido} ${item.director.nombre}`
                        : 'No asignado',
                      item.codirector
                        ? `${item.codirector.apellido} ${item.codirector.nombre}`
                        : 'No asignado',
                      item.denominacion,
                      item.estado,
                      <Link key={item.idProyecto} to={`/proyectos/${item.idProyecto}`}>
                        <PlusSquareIcon />
                      </Link>,
                    ];
                  })}
                />
              ) : (
                <ImgDefault src={NoData2} alt='No Data' width='30%' text='Este grupo aún no tiene proyectos' />
              )}
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
