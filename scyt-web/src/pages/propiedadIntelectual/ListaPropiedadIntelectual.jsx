import React, { useState, useEffect } from 'react';
import { Card, CardBody, Heading, Box, Button, Spinner } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import Tabla from '../../components/Tabla';
import { getPropiedadIntelectual } from '../../utils/api/propiedadIntelectualApi';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import ImgDefault from '../../components/ImgDefault';
import NoData from '../../img/no-data.png';
import PermissionGate from '../../components/PermissionGate';

const tiposPI = ['Derecho de Autor', 'Modelo de Utilidad', 'Modelo Industrial', 'Patente', 'Otros'];
const columnas = ['Tipo', 'Número de Expediente', 'Proyecto', 'Ver Más'];

export default function ListaPropiedadIntelectual() {
  const [numeroExpedienteFiltro, setNumeroExpedienteFiltro] = useState('');
  const [tipoPIFiltro, setTipoPIFiltro] = useState('');
  const [filtro, setFiltro] = useState(false);

  const { data: dataPIs, isLoading } = useQuery('propiedadIntelectual', () => getPropiedadIntelectual());
  const [propiedadIntelectual, setPropiedadIntelectual] = useState(dataPIs?.propiedadIntelectual);

  useEffect(() => {
    setPropiedadIntelectual(dataPIs?.propiedadIntelectual);
  }, [dataPIs]);

  const filas = propiedadIntelectual?.map((item) => {
    const proyectoDenominacion =
      item.proyectos?.denominacion?.length > 50
        ? `${item.proyectos.denominacion.substring(0, 50)}...`
        : item.proyectos?.denominacion || '-';

    return [
      item.tipoPI,
      item.numeroExpediente || '-',
      proyectoDenominacion,
      <Link key={item.idPI} to={`${item.idPI}`}>
        <PlusSquareIcon />
      </Link>,
    ];
  });

  useEffect(() => {
    if (numeroExpedienteFiltro === '' && tipoPIFiltro === '') {
      setPropiedadIntelectual(dataPIs?.propiedadIntelectual || []);
      setFiltro(false);
    } else {
      const filteredPIs = dataPIs?.propiedadIntelectual?.filter(
        (item) =>
          (item.numeroExpediente || '').toLowerCase().includes(numeroExpedienteFiltro.toLowerCase()) &&
          (tipoPIFiltro === '' || item.tipoPI === tipoPIFiltro)
      );
      setPropiedadIntelectual(filteredPIs);
      setFiltro(true);
    }
  }, [numeroExpedienteFiltro, tipoPIFiltro, dataPIs]);

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
            Propiedad Intelectual
          </Heading>

          <br />

          <Box display='flex' width='100%'>
            <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
              <GenericInput
                placeholder='Número de Expediente'
                label='Número de Expediente'
                width='15vw'
                value={numeroExpedienteFiltro}
                onChange={(event) => setNumeroExpedienteFiltro(event.target.value)}
              />
              <GenericSelect
                label='Tipo de PI'
                placeholder='Tipo de PI'
                width={{ base: '100%', md: '50%' }}
                options={tiposPI?.map((tipo) => ({
                  value: tipo,
                  label: tipo,
                }))}
                onChange={(event) => setTipoPIFiltro(event.target.value)}
              />
            </Box>
            <Box display='flex' justifyContent='flex-end' width='55%'>
              <PermissionGate module='propiedadIntelectual' action='create'>
                <Link to='nueva'>
                  <Button colorScheme='blue' variant='outline' mr='5'>
                    Nueva PI +
                  </Button>
                </Link>
              </PermissionGate>
            </Box>
          </Box>

          <br />

          {filas && filas.length > 0 ? (
            <Tabla columnas={columnas} datos={filas} filtro={filtro} checkbox={true} />
          ) : (
            <ImgDefault src={NoData} alt='No Data' width='30%' text='No hay propiedad intelectual para mostrar.' />
          )}

          <br />

          <Box display='flex' justifyContent='flex-end' width='100%'>
            <Button colorScheme='blue' variant='outline'>
              Imprimir
            </Button>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}
