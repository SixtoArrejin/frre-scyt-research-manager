import React from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner, HStack } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { formatoFechaISOaDDMMAAAA } from '../../utils/general';
import { getPropiedadIntelectualById } from '../../utils/api/propiedadIntelectualApi';
import DisplayField from '../../components/DisplayField';
import Tabla from '../../components/Tabla';
import ImgDefault from '../../components/ImgDefault';
import PermissionGate from '../../components/PermissionGate';
import NoData from '../../img/no-data.png';
import BackButton from '../../components/BackButton';

export default function DetallePropiedadIntelectual() {
  const { idPI } = useParams();

  const { data, isLoading } = useQuery(['propiedadIntelectual', idPI], () =>
    getPropiedadIntelectualById(idPI)
  );

  if (isLoading) {
    return (
      <Box
        display='flex'
        height='calc(100vh - 80px - 16px - 1px - 16px)'
        width='100%'
        alignItems='center'
        justifyContent='center'
      >
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  const pi = data?.propiedadIntelectual;

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <HStack width='100%' justifyContent='space-between' mb={6}>
            <BackButton to={pi?.proyectos ? `/proyectos/${pi.proyectos.idProyecto}` : '/proyectos'} />
            <Heading as='h2' size='xl' textAlign='center'>
              Detalles de Propiedad Intelectual
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md' fontWeight='bold'>
                Datos de la propiedad intelectual
              </Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box
                    display='flex'
                    flexDirection={{ base: 'column', md: 'row' }}
                    width='100%'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <DisplayField
                      label='Tipo de Propiedad Intelectual'
                      width={{ base: '100%', md: '47.5%' }}
                      value={pi?.tipoPI}
                      mb={4}
                    />
                    <DisplayField
                      label='Número de Expediente'
                      width={{ base: '100%', md: '47.5%' }}
                      value={pi?.numeroExpediente || '-'}
                      mb={4}
                    />
                  </Box>

                  <Box
                    display='flex'
                    flexDirection={{ base: 'column', md: 'row' }}
                    width='100%'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <DisplayField
                      label='Fecha de Inicio'
                      width={{ base: '100%', md: '47.5%' }}
                      value={formatoFechaISOaDDMMAAAA(pi?.fechaInicio) || '-'}
                      mb={4}
                    />
                    <DisplayField
                      label='Fecha de Cierre'
                      width={{ base: '100%', md: '47.5%' }}
                      value={formatoFechaISOaDDMMAAAA(pi?.fechaCierre) || '-'}
                      mb={4}
                    />
                  </Box>

                  <Box
                    display='flex'
                    flexDirection={{ base: 'column', md: 'row' }}
                    width='100%'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <DisplayField
                      label='Proyecto'
                      width={{ base: '100%', md: '100%' }}
                      value={pi?.proyectos?.denominacion || '-'}
                      mb={4}
                    />
                  </Box>

                  <Box
                    display='flex'
                    flexDirection={{ base: 'column', md: 'row' }}
                    width='100%'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <DisplayField
                      label='Descripción'
                      width={{ base: '100%', md: '100%' }}
                      value={pi?.descripcion || '-'}
                      mb={4}
                    />
                  </Box>

                  <PermissionGate module='propiedadIntelectual' action='edit'>
                    <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                      <Link to={'modificar'}>
                        <Button colorScheme='blue' variant='outline'>
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
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md' fontWeight='bold'>
                Investigadores Involucrados
              </Text>
              <br />
              {pi?.investigadores?.length > 0 ? (
                <Tabla
                  columnas={['Apellido', 'Nombre', 'Porcentaje de Participación (%)']}
                  datos={pi?.investigadores?.map((inv) => [
                    inv.personas?.apellido,
                    inv.personas?.nombre,
                    inv.porcentajeParticipacion,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault
                  src={NoData}
                  alt='No Data'
                  width='30%'
                  text='No hay investigadores involucrados.'
                />
              )}
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
