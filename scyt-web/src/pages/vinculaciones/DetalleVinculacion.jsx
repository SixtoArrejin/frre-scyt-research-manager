import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, Spinner, HStack, useToast } from '@chakra-ui/react';
import { DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { convertirFechaDDMMAAAAaDate, formatoFechaISOaDDMMAAAA, sumarMeses } from '../../utils/general';
import { deleteConvenioById, getVinculacionById } from '../../utils/api/vinculacionesApi';
import DisplayField from '../../components/DisplayField';
import Tabla from '../../components/Tabla';
import ImgDefault from '../../components/ImgDefault';
import PermissionGate from '../../components/PermissionGate';
import CustomModal from '../../components/CustomModal';
import NoData from '../../img/no-data.png';
import NoData1 from '../../img/no-data-2.png';
import NuevoConvenioModal from './NuevoConvenioModal';
import BackButton from '../../components/BackButton';

export default function DetalleVinculacion() {
  const [Financiamiento, setFinanciamiento] = useState();
  const [isOpenModalConvenio, setIsOpenModalConvenio] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [convenioAEliminar, setConvenioAEliminar] = useState(null);
  const toast = useToast();

  const openModal = () => {
    setIsOpenModalConvenio(true);
  };

  const closeModal = () => {
    setIsOpenModalConvenio(false);
  };

  const openDeleteModal = (idConvenio) => {
    setConvenioAEliminar(idConvenio);
    setIsOpenDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setIsOpenDeleteModal(false);
    setConvenioAEliminar(null);
  };

  const { idVinculacion } = useParams();

  const { data, isLoading, refetch } = useQuery(['vinculacion-mod', idVinculacion], () => getVinculacionById(idVinculacion));

  useEffect(() => {
    if (!data || !data.vinculacion || data.vinculacion.vinculacionesconfinanciamiento == null) {
      setFinanciamiento(false);
    } else {
      setFinanciamiento(true);
    }
  }, [data]);

  const onDeleted = async() => {
    try {
      await deleteConvenioById(Number(convenioAEliminar));
      await refetch();
      closeDeleteModal();
      toast({
        title: 'Convenio eliminado',
        description: 'El convenio se ha eliminado exitosamente.',
        status: 'info',
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al eliminar convenio:', error);
    }
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
          <HStack width='100%' justifyContent='space-between' mb={6}>
            <BackButton to='/vinculaciones' />
            <Heading as='h2' size='xl' textAlign='center'>
              Detalles de vinculación
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md' fontWeight='bold'>Datos de vinculación</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  {/* Primera fila: Empresa y Responsable */}
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <DisplayField
                      label='Empresa/Institución'
                      width={{ base: '100%', md: '47.5%' }}
                      value={data?.vinculacion?.empresaInstitucion}
                      mb={4}
                    />
                    <DisplayField
                      label='Responsable'
                      width={{ base: '100%', md: '47.5%' }}
                      value={data?.vinculacion?.responsable ? `${data.vinculacion.responsable.apellido}, ${data.vinculacion.responsable.nombre}` : 'Sin responsable asignado'}
                      mb={4}
                    />
                  </Box>
                  {/* Segunda fila: Proyecto */}
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <DisplayField
                      label='Proyecto'
                      width={{ base: '100%', md: '100%' }}
                      value={data?.vinculacion?.proyectos?.denominacion}
                      mb={4}
                    />
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
                        <DisplayField
                          label='Título'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.titulo}
                          mb={4}
                        />
                        <DisplayField
                          label='Nombre del beneficiario'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.nombreBeneficiario}
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
                          label='Monto ($)'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.monto}
                          mb={4}
                        />
                        <DisplayField
                          label='Cantidad de desembolsos'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.cantidadDesembolsos}
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
                          label='Fecha de presentación'
                          width={{ base: '100%', md: '47.5%' }}
                          value={formatoFechaISOaDDMMAAAA(data?.vinculacion?.vinculacionesconfinanciamiento?.fechaPresentacion)}
                          mb={4}
                        />
                        <DisplayField
                          label='Fecha de adjudicación'
                          width={{ base: '100%', md: '47.5%' }}
                          value={formatoFechaISOaDDMMAAAA(data?.vinculacion?.vinculacionesconfinanciamiento?.fechaAdjudicacion)}
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
                          label='Plazo de ejecución (meses)'
                          width={{ base: '100%', md: '100%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.plazoEjecucion}
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
                          label='Estado'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.estado}
                          mb={4}
                        />
                        <DisplayField
                          label='Motivo desistido'
                          width={{ base: '100%', md: '47.5%' }}
                          value={data?.vinculacion?.vinculacionesconfinanciamiento?.motivoEstado || '-'}
                          mb={4}
                        />
                      </Box>
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
                        <DisplayField
                          label='Fecha de inicio'
                          width={{ base: '100%', md: '47.5%' }}
                          value={formatoFechaISOaDDMMAAAA(data?.vinculacion?.vinculacionessinfinanciamiento?.fechaInicio)}
                          mb={4}
                        />
                        <DisplayField
                          label='Fecha de cierre'
                          width={{ base: '100%', md: '47.5%' }}
                          value={formatoFechaISOaDDMMAAAA(data?.vinculacion?.vinculacionessinfinanciamiento?.fechaCierre)}
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
                          value={data?.vinculacion?.vinculacionessinfinanciamiento?.descripcion}
                          mb={4}
                        />
                      </Box>
                    </Box>
                  )}
                  <PermissionGate module="vinculaciones" action="edit">
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
              <Text fontSize='md' fontWeight='bold'>Convenio</Text>
              <br />
              {data?.vinculacion?.convenios?.length > 0 ? (
                <Tabla
                  columnas={['Tipo', 'Número', 'Eliminar']}
                  datos={data?.vinculacion?.convenios?.map((convenio) => {
                    return [
                      convenio.tipo,
                      convenio.numero,
                      <PermissionGate key={convenio.idConvenio} module="convenios" action="delete">
                        <Link>
                          <DeleteIcon onClick={() => openDeleteModal(convenio.idConvenio)} cursor='pointer' />
                        </Link>
                      </PermissionGate>,
                    ];
                  })}
                  paginado={false}
                />
              ) : (
                <ImgDefault src={NoData} alt='No Data' width='30%' text='No hay convenios para mostrar.' />
              )}
              <br />
              <PermissionGate module="convenios" action="create">
                <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                  <Link>
                    <Button colorScheme='blue' variant='outline' onClick={() => openModal()}>
                      Agregar Convenio
                    </Button>
                  </Link>
                  <NuevoConvenioModal
                    isOpen={isOpenModalConvenio}
                    onClose={closeModal}
                    guardar={true}
                    title='Nuevo Convenio'
                    onConvenioAdded={() => refetch()}
                  />
                </Box>
              </PermissionGate>

              <CustomModal
                isOpen={isOpenDeleteModal}
                onClose={closeDeleteModal}
                eliminar={true}
                title='Eliminar Convenio'
                content='¿Estás seguro de que deseas eliminar este convenio?'
                onSave={onDeleted}
              />
              <br />
            </CardBody>
          </Card>

          <br />
          {Financiamiento && (
            <Card width='100%'>
              <CardBody>
                <Text fontSize='md' fontWeight='bold'>Desembolsos</Text>
                <br />
                {data?.vinculacion?.vinculacionesconfinanciamiento?.desembolsos?.length > 0 ? (
                  <Tabla
                    columnas={['Nro.', 'Fecha desembolso', 'Monto desmbolsado ($)', 'Monto rendido ($)', 'Estado', 'Ver más']}
                    datos={data?.vinculacion?.vinculacionesconfinanciamiento?.desembolsos?.map((item, index) => {

                      const fechaActual = formatoFechaISOaDDMMAAAA(new Date());
                      const fechaRendicion = formatoFechaISOaDDMMAAAA(sumarMeses(item.fechaDesembolso, item.plazoEtapa));

                      const estadoFueraDePlazo = convertirFechaDDMMAAAAaDate(fechaActual) > convertirFechaDDMMAAAAaDate(fechaRendicion) &&
                        item.estado === 'En ejecución';
                      const estadoTexto = convertirFechaDDMMAAAAaDate(fechaActual) > convertirFechaDDMMAAAAaDate(fechaRendicion)
                        ? item.estado == 'En ejecución'
                          ? 'En ejecución - Fuera de plazo'
                          : item.estado || '-'
                        : item.estado || '-';

                      return [
                        index + 1,
                        formatoFechaISOaDDMMAAAA(item.fechaDesembolso),
                        item.montoDesembolsado,
                        item.montoRendido ? (
                          <Text color={item.montoRendido < item.montoDesembolsado ? 'red' : 'inherit'}>
                            {item.montoRendido}
                          </Text>
                        ) : (
                          '-'
                        ),
                        <Text key={`estado-${item.idDesembolso}`} color={estadoFueraDePlazo ? 'red' : 'inherit'}>
                          {estadoTexto}
                        </Text>,
                        <Link key={`link-${item.idDesembolso}`} to={`desembolso/${item.idDesembolso}`}>
                          <PlusSquareIcon />
                        </Link>,
                      ];
                    })}
                    paginado={false}
                  />
                ) : (
                  <ImgDefault src={NoData1} alt='No Data' width='30%' text='Aún no hay desembolsos para mostrar.' />
                )}
                <br/>
                <Box
                  display='flex'
                  width='100%'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <DisplayField
                    label='Saldo ($)'
                    width={{ base: '100%', md: '20%' }}
                    value={
                      data?.vinculacion?.vinculacionesconfinanciamiento?.monto -
                      data?.vinculacion?.vinculacionesconfinanciamiento?.desembolsos?.reduce(
                        (total, desembolso) => total + (desembolso.montoRendido || 0),
                        0,
                      )
                    }
                    mb={4}
                    mt={9}
                  />
                  {data?.vinculacion?.vinculacionesconfinanciamiento?.desembolsos?.length <
                    data?.vinculacion?.vinculacionesconfinanciamiento?.cantidadDesembolsos && (
                    <PermissionGate module="desembolsos" action="create">
                      <Link to={'nuevo-desembolso'}>
                        <Button colorScheme='blue' variant='outline'>
                            Agregar Desembolso
                        </Button>
                      </Link>
                    </PermissionGate>
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
