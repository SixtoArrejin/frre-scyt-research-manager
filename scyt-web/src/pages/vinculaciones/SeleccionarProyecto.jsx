import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Box } from '@chakra-ui/react';
import { PlusSquareIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';
import Tabla from '../../components/Tabla';
import GenericInput from '../../components/formControls/GenericInput';
import { getProyectos } from '../../utils/api/proyectosApi';

const columnas = ['Cod. PID', 'Denominación', 'Director', 'Tipo', 'Seleccionar'];

export default function SeleccionarProyecto({ onProyectoSelected }) {
  const [denominacionFiltro, setDenominacionFiltro] = useState('');
  const [codPIDFiltro, setCodPIDFiltro] = useState('');
  const { data: dataProyectos, isLoading } = useQuery('proyectos', () => getProyectos());
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    setProyectos(dataProyectos?.proyectos || []);
  }, [dataProyectos]);

  useEffect(() => {
    if (denominacionFiltro === '' && codPIDFiltro === '') {
      setProyectos(dataProyectos?.proyectos || []);
    } else {
      const filteredProyectos = dataProyectos?.proyectos?.filter((item) => {
        const matchesDenominacion = denominacionFiltro
          ? (item.denominacion || '').toLowerCase().includes(denominacionFiltro.toLowerCase())
          : true;
        const matchesCodPID = codPIDFiltro
          ? (item.codPid || '').toLowerCase().includes(codPIDFiltro.toLowerCase())
          : true;
        return matchesDenominacion && matchesCodPID;
      });
      setProyectos(filteredProyectos);
    }
  }, [denominacionFiltro, codPIDFiltro, dataProyectos]);

  const filas = proyectos?.map((item) => {
    const denominacionCorta = item.denominacion?.length > 40
      ? `${item.denominacion.substring(0, 40)}...`
      : item.denominacion;

    const tipoCorto = item.tipoProyecto?.length > 15
      ? `${item.tipoProyecto.substring(0, 15)}...`
      : item.tipoProyecto || '-';

    return [
      item.codPid || '-',
      denominacionCorta,
      item.director ? `${item.director.apellido}, ${item.director.nombre}` : '-',
      tipoCorto,
      <PlusSquareIcon
        key={item.idProyecto}
        cursor='pointer'
        onClick={() => onProyectoSelected(item)}
      />,
    ];
  });

  return (
    <Card width='100%'>
      <CardBody>
        <Text fontSize='md'>Seleccione el proyecto para la vinculación</Text>
        <br />
        <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
          <Box display='flex' width='100%' marginBottom='20px'>
            <Box display='flex' justifyContent='space-between' width='60%' marginLeft='2%'>
              <GenericInput
                placeholder='Buscar por código PID...'
                label='Código PID'
                width='48%'
                value={codPIDFiltro}
                onChange={(event) => setCodPIDFiltro(event.target.value)}
              />
              <GenericInput
                placeholder='Buscar por denominación...'
                label='Denominación del proyecto'
                width='48%'
                value={denominacionFiltro}
                onChange={(event) => setDenominacionFiltro(event.target.value)}
              />
            </Box>
          </Box>

          {isLoading ? (
            <Text>Cargando proyectos...</Text>
          ) : filas && filas.length > 0 ? (
            <Tabla columnas={columnas} datos={filas} paginado={true} />
          ) : (
            <Text>No hay proyectos disponibles</Text>
          )}
        </Box>
      </CardBody>
    </Card>
  );
}
