import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProyectos } from '../../utils/api/proyectosApi';
import Tabla from '../../components/Tabla';
import { formatoFechaISOaDDMMAAAA } from '../../utils/general';
import GenericInput from '../../components/formControls/GenericInput';

export default function ProyectosPid() {
  const [codPID, setCodPID] = useState('');
  const [denominacion, setDenominacion] = useState('');
  const [filtro, setFiltro] = useState(false);

  const { data, isLoading, error } = useQuery('proyectos', () => getProyectos());
  const [proyectos, setProyectos] = useState(data?.proyectos || []);
  
  useEffect(() => {
    if (codPID === '' && denominacion === '') {
      // Si no se está filtrando nada, utiliza los datos originales data?.personas
      setProyectos(data?.proyectos || []);
      setFiltro(false);
    } else {
      const filteredProyectos = data?.proyectos.filter(
        (item) => item.codPid.toLowerCase().includes(codPID.toLowerCase()) && item.denominacion.toLowerCase().includes(denominacion.toLowerCase())
      );
      setProyectos(filteredProyectos);
      setFiltro(true);
    }
  }, [codPID, denominacion, data]);

  if (isLoading) {
    return <Text fontSize='md'>Cargando...</Text>;
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
            <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
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
            </Box>
            <Box display='flex' justifyContent='flex-end' width='55%'>
              <Link to={'nuevo'}>
                <Button colorScheme='blue' variant='outline' mr='5'>
                  Proyecto PID +
                </Button>
              </Link>
            </Box>
          </Box>

          <br />
          <Tabla
            columnas={['Cod. PID', 'Fecha Inicio', 'Denominación', 'Regional', 'Estado', 'Ver Más']}
            datos={proyectos?.map((item, index) => {
              const denominacion =
                item?.denominacion === item?.denominacion.substring(0, 40) ? item?.denominacion : item?.denominacion.substring(0, 40) + '...';
              var regional = item?.regional;
              if (item?.regional.startsWith('Facultad Regional')) {
                var regional = 'F.R.' + regional.substring('Facultad Regional'.length);
              }

              return [
                item.codPid,
                formatoFechaISOaDDMMAAAA(item?.fechaInicio),
                denominacion,
                regional,
                item?.estado.charAt(0).toUpperCase() + item?.estado.toLowerCase().substring(1),
                <Link to={`/proyectos/${item.idProyecto}`}>
                  <PlusSquareIcon />
                </Link>,
              ];
            })}
            filtro={filtro}
          />
        </Box>
      </CardBody>
    </Card>
  );
}
