import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner } from '@chakra-ui/react';
import { DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { convertirFechaDDMMAAAAaDate, formatoFechaISOaDDMMAAAA, sumarMeses } from '../../utils/general';
import { deleteConvenioById, getVinculacionById } from '../../utils/api/vinculacionesApi';
import GenericInput from '../../components/formControls/GenericInput';
import Tabla from '../../components/Tabla';
import ImgDefault from '../../components/ImgDefault';
import NoData from '../../img/no-data.png';
import NoData1 from '../../img/no-data-2.png';
import NuevoConvenioModal from './NuevoConvenioModal';

export default function DetalleVinculacion() {
  const [Financiamiento, setFinanciamiento] = useState();

  const [isOpenModalConvenio, setIsOpenModalConvenio] = useState(false);

  const openModal = () => {
    setIsOpenModalConvenio(true);
  };

  const closeModal = () => {
    setIsOpenModalConvenio(false);
  };

  const { idVinculacion } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(['vinculacion-mod', idVinculacion], () => getVinculacionById(idVinculacion));

  useEffect(() => {
    if (!data || !data.vinculacion || data.vinculacion.vinculacionesconfinanciamiento == null) {
      setFinanciamiento(false);
    } else {
      setFinanciamiento(true);
    }
  }, [data]);

  //PARA LA PÁGINA DE MODIFICAR SE VA
  const onDeleted = async (idConvenio) => {
    await deleteConvenioById(Number(idConvenio));
    queryClient.invalidateQueries(['vinculacion', idVinculacion]);
    queryClient.refetchQueries(['vinculacion', idVinculacion]);
  };

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
            Detalles de vinculación
          </Heading>
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos de vinculación</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <GenericInput
                      label='Empresa/Institución'
                      width={{ base: '100%', md: '30%' }}
                      value={data?.vinculacion?.empresaInstitucion}
                      isDisabled
                      mb='5vh'
                    />
                    <GenericInput label='Nro Marco' width={{ base: '100%', md: '30%' }} value={data?.vinculacion?.numeroMarco} isDisabled mb='5vh' />
                    <GenericInput label='Proyecto' width={{ base: '100%', md: '30%' }} defaultValue={data?.vinculacion?.proyectos?.denominacion} isDisabled mb='5vh' />
                  </Box>
                  {Financiamiento && (
                    <Box width='100%'>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Título'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.titulo}
                          isDisabled
                          mb='5vh'
                        />
                        <GenericInput
                          label='Nombre del beneficiario'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.nombreBeneficiario}
                          isDisabled
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Monto'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.monto}
                          isDisabled
                          mb='5vh'
                        />
                        <GenericInput
                          label='Cantidad de desembolsos'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.cantidadDesembolsos}
                          isDisabled
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Fecha de presentación'
                          width={{ base: '100%', md: '47.5%' }}
                          value={formatoFechaISOaDDMMAAAA(data?.vinculacion?.vinculacionesconfinanciamiento?.fechaPresentacion)}
                          isDisabled
                          mb='5vh'
                        />
                        <GenericInput
                          label='Fecha de adjudicación'
                          width={{ base: '100%', md: '47.5%' }}
                          value={formatoFechaISOaDDMMAAAA(data?.vinculacion?.vinculacionesconfinanciamiento?.fechaAdjudicacion)}
                          isDisabled
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Plazo de ejecución (meses)'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.plazoEjecucion}
                          isDisabled
                          mb='5vh'
                        />
                        <GenericInput
                          label='Línea'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.nombreLinea}
                          isDisabled
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Estado'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.estado}
                          isDisabled
                          mb='5vh'
                        />
                        <GenericInput
                          label='Motivo desistido'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.motivoEstado}
                          isDisabled
                          mb='5vh'
                        />
                      </Box>{' '}
                    </Box>
                  )}
                  {!Financiamiento && (
                    <Box width='100%'>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          label='Fecha de inicio'
                          width={{ base: '100%', md: '47.5%' }}
                          value={formatoFechaISOaDDMMAAAA(data?.vinculacion?.vinculacionessinfinanciamiento?.fechaInicio)}
                          isDisabled
                          mb='5vh'
                        />
                        <GenericInput
                          label='Fecha de cierre'
                          width={{ base: '100%', md: '47.5%' }}
                          value={formatoFechaISOaDDMMAAAA(data?.vinculacion?.vinculacionessinfinanciamiento?.fechaCierre)}
                          isDisabled
                          mb='5vh'
                        />
                      </Box>
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericInput
                          textArea
                          label='Descripción'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionessinfinanciamiento?.descripcion}
                          isDisabled
                          mb='5vh'
                        />
                      </Box>
                    </Box>
                  )}
                  <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                    <Link to={`modificar`}>
                      <Button colorScheme='blue' variant='outline'>
                        Modificar
                      </Button>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Convenio</Text>
              <br />
              {data?.vinculacion?.convenios?.length > 0 ? (
                <Tabla
                  columnas={['Tipo', 'Número', 'Eliminar']}
                  datos={data?.vinculacion?.convenios?.map((convenio) => {
                    return [
                      convenio.tipo,
                      convenio.numero,
                      <Link>
                        <DeleteIcon onClick={() => onDeleted(convenio.idConvenio)} />
                      </Link>,
                    ];
                  })}
                  paginado={false}
                />
              ) : (
                <ImgDefault src={NoData} alt='No Data' width='30%' text='No hay convenios para mostrar.' />
              )}
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                <Link>
                  <Button colorScheme='blue' variant='outline' onClick={() => openModal()}>
                    Agregar Convenio
                  </Button>
                </Link>
                <NuevoConvenioModal
                  // key={item.idCategoria}
                  isOpen={isOpenModalConvenio}
                  onClose={closeModal}
                  guardar={true}
                  title='Nuevo Convenio'
                />
              </Box>
              <br />
            </CardBody>
          </Card>

          <br />
          {Financiamiento && (
            <Card width='100%'>
              <CardBody>
                <Text fontSize='md'>Desembolsos</Text>
                <br />
                {data?.vinculacion?.vinculacionesconfinanciamiento?.desembolsos?.length > 0 ? (
                  <Tabla
                    columnas={['Nro. Desembolso', 'Fecha de desembolso', 'Monto desmbolsado ($)', 'Monto rendido ($)', 'Estado', 'Ver más']}
                    datos={data?.vinculacion?.vinculacionesconfinanciamiento?.desembolsos?.map((item, index) => {

                      const fechaActual = formatoFechaISOaDDMMAAAA(new Date());
                      const fechaRendicion = formatoFechaISOaDDMMAAAA(sumarMeses(item.fechaDesembolso, item.plazoEtapa));

                      return [
                        index + 1,
                        formatoFechaISOaDDMMAAAA(item.fechaDesembolso),
                        item.montoDesembolsado,
                        item.montoRendido ? item.montoRendido : '-',
                        convertirFechaDDMMAAAAaDate(fechaActual) > convertirFechaDDMMAAAAaDate(fechaRendicion)
                          ? item.estado == 'En ejecución'
                            ? 'En ejecución - Fuera de plazo'
                            : item.estado || '-'
                          : item.estado || '-',
                        <Link to={`desembolso/${item.idDesembolso}`}>
                          <PlusSquareIcon />
                        </Link>,
                      ];
                    })}
                    paginado={false}
                  />
                ) : (
                  <ImgDefault src={NoData1} alt='No Data' width='30%' text='Aún no hay desembolsos para mostrar.' />
                )}
                <Box
                  display='flex'
                  width='100%'
                  alignItems='center'
                  justifyContent='space-between' // Cambiado de "flex-end" a "space-between"
                >
                  <GenericInput
                    label='Saldo ($)'
                    width={{ base: '100%', md: '47.5%' }}
                    value={
                      data?.vinculacion?.vinculacionesconfinanciamiento?.monto -
                      data?.vinculacion?.vinculacionesconfinanciamiento?.desembolsos?.reduce(
                        (total, desembolso) => total + (desembolso.montoRendido || 0),
                        0
                      )
                    }
                    isDisabled
                    mb='5vh'
                    mt='9'
                  />
                  {data?.vinculacion?.vinculacionesconfinanciamiento?.desembolsos?.length <
                    data?.vinculacion?.vinculacionesconfinanciamiento?.cantidadDesembolsos && (
                      <Link to={`nuevo-desembolso`}>
                        <Button colorScheme='blue' variant='outline'>
                          Agregar Desembolso
                        </Button>
                      </Link>
                    )}
                </Box>
                <br />
              </CardBody>
            </Card>
          )}
        </Box>
      </CardBody>
    </Card>
  );
}
