import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner, Tooltip } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProyectos } from '../../utils/api/proyectosApi';
import Tabla from '../../components/Tabla';
import { formatoFechaISOaDDMMAAAA } from '../../utils/general';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import ImgDefault from '../../components/ImgDefault';
import NoData from '../../img/no-data-2.png';

export default function ProyectosPid() {
  const [codPID, setCodPID] = useState('');
  const [denominacion, setDenominacion] = useState('');
  const [filtro, setFiltro] = useState(false);

  const { data, isLoading, error } = useQuery('proyectos', () => getProyectos());
  const [proyectos, setProyectos] = useState(data?.proyectos || []);
  const [pidExterno, setPidExterno] = useState('todos');

  useEffect(() => {
    if (codPID === '' && denominacion === '' && pidExterno === 'todos') {
      // Mostrar todos los proyectos sin filtrar
      setProyectos(data?.proyectos || []);
      setFiltro(false);
    } else {
      let filteredProyectos;

      // Si hay un valor en codPID, primero filtramos solo aquellos proyectos que tienen codPid
      if (codPID) {
        const proyectosConCodPid = data?.proyectos.filter((item) => item.codPid && item.codPid.toLowerCase().includes(codPID.toLowerCase()));

        // Luego filtramos por denominacion en los que tienen codPid
        filteredProyectos = proyectosConCodPid.filter((item) => item.denominacion.toLowerCase().includes(denominacion.toLowerCase()));
        setPidExterno('pid');
      } else {
        let typeFilter;
        if (pidExterno === 'pid') {
          typeFilter = data?.proyectos.filter((item) => item.codPid && item.codPid.toLowerCase().includes(codPID.toLowerCase()));
        } else if (pidExterno === 'externos') {
          typeFilter = data?.proyectos.filter((item) => !item.codPid);
        } else {
          typeFilter = data?.proyectos || [];
        }
        filteredProyectos = typeFilter.filter((item) => item.denominacion.toLowerCase().includes(denominacion.toLowerCase()));
      }

      setProyectos(filteredProyectos);
      setFiltro(true);
    }
  }, [codPID, denominacion, pidExterno, data]);

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
            Proyectos
          </Heading>

          <br />

          <Box display='flex' width='100%'>
            <Box display='flex' justifyContent='space-between' width='85%' marginLeft='2%'>
              <GenericInput
                placeholder='Código PID'
                label='Código PID'
                width='15vw'
                value={codPID}
                onChange={(event) => setCodPID(event.target.value)}
              />
              <GenericInput
                placeholder='Denominación'
                label='Denominación'
                width='15vw'
                value={denominacion}
                onChange={(event) => setDenominacion(event.target.value)}
              />
              <GenericSelect
                name='pidExterno'
                width='15vw'
                options={[
                  { value: 'todos', label: 'Todos' },
                  { value: 'pid', label: 'PID' },
                  { value: 'externos', label: 'Externos' },
                ]}
                value={pidExterno}
                onChange={(event) => setPidExterno(event.target.value)}
              />
            </Box>
            <Box display='flex' justifyContent='flex-end' width='55%'>
              <Link to={'nuevo'}>
                <Button colorScheme='blue' variant='outline' mr='5'>
                  Proyecto +
                </Button>
              </Link>
            </Box>
          </Box>

          <br />
          {proyectos?.length > 0 ? (<Tabla
            columnas={['Externo','Cod. PID', 'Fecha Inicio', 'Denominación', 'Estado', 'Ver Más']}
            datos={proyectos?.map((item) => {
              const denominacion =
                item?.denominacion === item?.denominacion.substring(0, 40) ? item?.denominacion : item?.denominacion.substring(0, 40) + '...';
                const externo = item.codPid ? (
                  <Tooltip openDelay={100} hasArrow label="Proyecto externo" bg="red.500" color="white">
                    <CloseIcon color="red.500" />
                  </Tooltip>
                ) : (
                  <Tooltip openDelay={100} hasArrow label="Proyecto PID" bg="green.500" color="white">
                    <CheckIcon color="green.500" />
                  </Tooltip>
                );
              return [
                externo,
                item.codPid ? item.codPid : '-',
                formatoFechaISOaDDMMAAAA(item?.fechaInicio),
                denominacion,
                item?.estado ? item?.estado.charAt(0).toUpperCase() + item?.estado.toLowerCase().substring(1) : '-',
                <Link to={`/proyectos/${item.idProyecto}`}>
                  <PlusSquareIcon />
                </Link>,
              ];
            })}
            filtro={filtro}
          />) : (
            <ImgDefault src={NoData} alt='No Data' width='30%' text='No hay proyectos para mostrar.' />
          )}
        </Box>
      </CardBody>
    </Card>
  );
}
