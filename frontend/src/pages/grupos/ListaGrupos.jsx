import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { useQuery } from 'react-query';
import Tabla from '../../components/Tabla';
import { formatoFechaISOaDDMMAAAA } from '../../utils/general';
import GenericInput from '../../components/formControls/GenericInput';

export default function ListaGrupos() {
  const [siglas, setSiglas] = useState('');
  const [filtro, setFiltro] = useState(false);

  const { data, isLoading, error } = useQuery('grupos', () => getAllGrupos());
  const [grupos, setGrupos] = useState(data?.grupos || []);

  //Esto ya pertenece a lo de grupos

  useEffect(() => {
    if (siglas === '') {
      // Si no se está filtrando nada, utiliza los datos originales data?.personas
      setGrupos(data?.grupos || []);
      setFiltro(false);
    } else {
      const filteredGrupos = data?.grupos.filter((item) => item.siglas.toLowerCase().includes(siglas?.toLowerCase()));
      setGrupos(filteredGrupos);
      setFiltro(true);
    }
  }, [siglas, data]);

  if (isLoading) {
    return <Text fontSize='md'>Cargando...</Text>;
  }

  const sortedGrupos = [...grupos]?.sort((a, b) => {
    const siglasA = a.siglas.toLowerCase();
    const siglasB = b.siglas.toLowerCase();
    return siglasA.localeCompare(siglasB);
  });

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Grupos de Investigación
          </Heading>

          <br />

          <Box display='flex' width='100%'>
            <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
              <GenericInput
                label='Siglas'
                placeholder='Siglas'
                width='15vw'
                value={siglas}
                onChange={(event) => setSiglas(event.target.value)}
                mb='0'
              />
            </Box>
            <Box display='flex' justifyContent='flex-end' width='55%'>
              <Link to={'nuevo'}>
                <Button colorScheme='blue' variant='outline' mr='5'>
                  Grupo +
                </Button>
              </Link>
            </Box>
          </Box>

          <br />

          {grupos && (
            <Tabla
              columnas={['Grupo', 'Resolución', 'Fecha Creación', 'Ver Más']}
              datos={sortedGrupos?.map((item) => {
                return [
                  item.siglas,
                  item.resolucion,
                  formatoFechaISOaDDMMAAAA(item.fechaCreacion),
                  <Link to={`/grupos-investigacion/${item.idGrupoInvestigacion}`}>
                    <PlusSquareIcon />
                  </Link>,
                ];
              })}
              filtro={filtro}
            />
          )}

          <br />
        </Box>
      </CardBody>
    </Card>
  );
}
