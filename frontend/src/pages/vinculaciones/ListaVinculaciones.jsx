import React, { useState, useEffect } from 'react';
import { Card, CardBody, Heading, Box, Button } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import Tabla from '../../components/Tabla';
import { getVinculaciones } from '../../utils/api/vinculacionesApi';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';

const financiamientos = ['Sin financiamiento', 'Con financiamiento'];
const columnas = ['Empresa/Institución', 'Nro. Marco', 'Financiamiento', 'Ver Más'];

export default function ListaInvestigadores() {
  const [empresainstitucionFiltro, setEmpresaInstitucionFiltro] = useState('');
  const [financiamientoFiltro, setFinanciamientoFiltro] = useState('');
  const [filtro, setFiltro] = useState(false);

  const { data: dataVinculaciones, isLoading, error } = useQuery('vinculaciones', () => getVinculaciones());
  const [vinculaciones, setVinculaciones] = useState(dataVinculaciones?.vinculaciones);
  useEffect(() => {
    setVinculaciones(dataVinculaciones?.vinculaciones);
  }, [dataVinculaciones]);

  const filas = vinculaciones?.map((item, index) => {
    return [
      item.empresaInstitucion,
      item.numeroMarco,
      // item.financiamiento,
      item.vinculacionesconfinanciamiento ? 'Con financiamiento' : 'Sin financiamiento',
      <Link to={`${item.idVinculacion}`}>
        <PlusSquareIcon />
      </Link>,
    ];
  });

  useEffect(() => {
    if (empresainstitucionFiltro === '' && financiamientoFiltro === '') {
      // Si no se está filtrando nada, utiliza los datos originales VinculacionesData
      setVinculaciones(dataVinculaciones?.vinculaciones || []);
      setFiltro(false);
    } else {
      const filteredVinculaciones = dataVinculaciones?.vinculaciones?.filter(
        (item) =>
          item.empresaInstitucion.toLowerCase().includes(empresainstitucionFiltro.toLowerCase()) &&
          (financiamientoFiltro == (item.vinculacionesconfinanciamiento ? 'Con financiamiento' : 'Sin financiamiento') ||
            (financiamientoFiltro != 'Con financiamiento' && financiamientoFiltro != 'Sin financiamiento'))
      );
      setVinculaciones(filteredVinculaciones);
      setFiltro(true);
    }
  }, [empresainstitucionFiltro, financiamientoFiltro]);

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Vinculaciones
          </Heading>

          <br />

          <Box display='flex' width='100%'>
            <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
              <GenericInput
                placeholder='Empresa/Institucion'
                label='Empresa/Institucion'
                width='15vw'
                value={empresainstitucionFiltro}
                onChange={(event) => setEmpresaInstitucionFiltro(event.target.value)}
              />
              <GenericSelect
                label='Financiamiento'
                placeholder='Financiamiento'
                width={{ base: '100%', md: '50%' }}
                options={financiamientos?.map((financiamiento) => ({
                  value: financiamiento,
                  label: financiamiento,
                }))}
                onChange={(event) => setFinanciamientoFiltro(event.target.value)}
              />
            </Box>
          </Box>

          <br />

          {vinculaciones && <Tabla columnas={columnas} datos={filas} filtro={filtro} checkbox={true} />}

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
