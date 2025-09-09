import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner, Image } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { getGrupoById } from '../../utils/api/gruposApi';
import { useQuery } from 'react-query';
import { formatoFechaISOaDDMMAAAA, getCategoriaMasActual } from '../../utils/general';
import { getProyectosByIdGrupo } from '../../utils/api/proyectosApi';
import Tabla from '../../components/Tabla';
import GenericInput from '../../components/formControls/GenericInput';
import NoData from '../../img/no-data.png';
import NoData2 from '../../img/no-data-2.png';
import ImgDefault from '../../components/ImgDefault';

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
            DETALLES GRUPO
          </Heading>

          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos del grupo</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} alignItems='center' justifyContent='space-between'>
                  <GenericInput name='nombre' label='Nombre' width={{ base: '100%', md: '30%' }} value={data?.grupo.nombre} isDisabled mb='5vh' />

                  <GenericInput name='siglas' label='Siglas' width={{ base: '100%', md: '20%' }} value={data?.grupo.siglas} isDisabled mb='5vh' />

                  <GenericInput
                    name='resolucion'
                    label='Resolución'
                    width={{ base: '100%', md: '15%' }}
                    value={data?.grupo.resolucion}
                    isDisabled
                    mb='5vh'
                  />

                  <GenericInput
                    name='fechaCreacion'
                    label='Fecha'
                    width={{ base: '100%', md: '15%' }}
                    value={formatoFechaISOaDDMMAAAA(data?.grupo.fechaCreacion) || ''}
                    isDisabled
                    mb='5vh'
                  />
                </Box>
                <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end'>
                  <Link to={`modificar`}>
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
                      formatoFechaISOaDDMMAAAA(item.fechaIngreso),
                      categoriaMIN?.categoria ? categoriaMIN?.categoria : '-',
                      <Link to={`/investigadores/${item.idPersona}`}>
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
                  datos={proyectos?.map((item, index) => {
                    return [
                      formatoFechaISOaDDMMAAAA(item.fechaInicio),
                      item.tipoActividad,
                      item.director
                        ? `${item.director.apellido} ${item.director.nombre}`
                        : "No asignado",
                      item.codirector
                        ? `${item.codirector.apellido} ${item.codirector.nombre}`
                        : "No asignado",
                      item.denominacion,
                      item.estado,
                      <Link to={`/proyectos/${item.idProyecto}`}>
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
