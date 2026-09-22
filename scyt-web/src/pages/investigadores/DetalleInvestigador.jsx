import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner, Badge, HStack } from '@chakra-ui/react';
import { DeleteIcon, PlusSquareIcon, EditIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { getPersonaById } from '../../utils/api/personasApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { formatoFechaISOaDDMMAAAA } from '../../utils/general';
import { deleteCategoriaById } from '../../utils/api/categoriasApi';
import { getProyectosByPersonaId } from '../../utils/api/proyectosApi';
import { getPropiedadIntelectualByIdPersona } from '../../utils/api/propiedadIntelectualApi';
import CustomModal from '../../components/CustomModal';
import Tabla from '../../components/Tabla';
import NoData from '../../img/no-data.png';
import NoData2 from '../../img/no-data-2.png';
import NoData3 from '../../img/no-data-3.png';
import ImgDefault from '../../components/ImgDefault';
import EditCategoriaModal from './EditCategoriaModal';
import PermissionGate from '../../components/PermissionGate';
import DisplayField from '../../components/DisplayField';
import BackButton from '../../components/BackButton';

export default function DetalleInvestigador() {
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const openModal = (categoria) => {
    setSelectedCategoria(categoria);
    setIsOpen(true);
  };

  const openModalEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setIsOpenEdit(true);
  };

  const closeModal = () => {
    setSelectedCategoria(null);
    setIsOpen(false);
  };

  const closeModalEdit = () => {
    setSelectedCategoria(null);
    setIsOpenEdit(false);
  };

  const { idPersona } = useParams();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(['persona', idPersona], () => getPersonaById(idPersona));
  const { data: dataProyectos } = useQuery(['proyectos', idPersona], () => getProyectosByPersonaId(idPersona));
  const { data: dataPropiedadIntelectual } = useQuery(['propiedadIntelectual', idPersona], () => getPropiedadIntelectualByIdPersona(idPersona));

  const toast = useToast();

  const categoriasUTN = data?.persona?.categorias?.filter((categoria) => categoria.tipo === 'utn');
  const categoriasMIN = data?.persona?.categorias?.filter((categoria) => categoria.tipo === 'ministerio');
  categoriasUTN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  categoriasMIN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const { mutate } = useMutation({
    mutationFn: (idCategoria) => deleteCategoriaById(idCategoria),
    onSuccess: () => {
      toast({
        title: 'Eliminar categoria',
        description: 'Se ha eliminado la categoria exitosamente',
        status: 'info',
        isClosable: true,
      });
      queryClient.refetchQueries(['persona', idPersona]);
    },
    onError: () => {
      toast({
        title: 'Eliminar categoria',
        description: 'Intente de nuevo.',
        status: 'error',
        isClosable: true,
      });
    },
  });

  if (isLoading) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  const persona = data?.persona;
  const esBecario = persona?.esBecario;
  const tienePosgrado = persona?.tienePosgrado;

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          {/* Cabecera superior con botón de regreso y título */}
          <HStack width='100%' justifyContent='space-between' mb={6}>
            <BackButton to='/investigadores' />
            <Heading as='h2' size='xl' textAlign='center'>
              Detalles del Investigador
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>

          {/* Tarjeta 1: Datos del Investigador */}
          <Card width='100%' mb={6}>
            <CardBody>
              {/* Encabezado con título original y badges solicitados */}
              <Box
                display='flex'
                flexDirection={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                justifyContent='space-between'
                width='100%'
                mb={4}
              >
                <Box display='flex' alignItems='center' flexWrap='wrap' gap={3}>
                  <Text fontSize='md' fontWeight='bold'>
                    Datos del investigador
                  </Text>
                  <Badge
                    colorScheme={persona?.activo ? 'green' : 'red'}
                    borderRadius='md'
                  >
                    {persona?.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                  <Badge
                    colorScheme={esBecario ? 'purple' : 'blue'}
                    borderRadius='md'
                  >
                    {esBecario
                      ? persona?.tipoBecario
                        ? `Becario (${persona.tipoBecario})`
                        : 'Becario'
                      : 'Investigador'}
                  </Badge>
                </Box>

                <PermissionGate module='investigadores' action='edit'>
                  <Link to={'modificar'}>
                    <Button colorScheme='blue' variant='outline' size='sm'>
                      Modificar
                    </Button>
                  </Link>
                </PermissionGate>
              </Box>

              {/* Grilla de campos perfectamente balanceada */}
              <Box display='flex' width='100%' flexDirection='column'>
                {/* Fila 1: Apellido y Nombre */}
                <Box
                  display='flex'
                  flexDirection={{ base: 'column', md: 'row' }}
                  width='100%'
                  gap={4}
                  mb={4}
                >
                  <DisplayField
                    label="Apellido"
                    value={persona?.apellido || '-'}
                    width={{ base: '100%', md: '50%' }}
                    mb={0}
                  />
                  <DisplayField
                    label="Nombre"
                    value={persona?.nombre || '-'}
                    width={{ base: '100%', md: '50%' }}
                    mb={0}
                  />
                </Box>

                {/* Fila 2: DNI y Legajo */}
                <Box
                  display='flex'
                  flexDirection={{ base: 'column', md: 'row' }}
                  width='100%'
                  gap={4}
                  mb={4}
                >
                  <DisplayField
                    label="DNI"
                    value={persona?.dni || '-'}
                    width={{ base: '100%', md: '50%' }}
                    mb={0}
                  />
                  <DisplayField
                    label="Legajo"
                    value={persona?.legajo || '-'}
                    width={{ base: '100%', md: '50%' }}
                    mb={0}
                  />
                </Box>

                {/* Fila 3: Siglas del Grupo y Fecha de Ingreso al Grupo */}
                <Box
                  display='flex'
                  flexDirection={{ base: 'column', md: 'row' }}
                  width='100%'
                  gap={4}
                  mb={4}
                >
                  <DisplayField
                    label="Siglas del Grupo"
                    value={persona?.gruposinvestigacion?.siglas || '-'}
                    width={{ base: '100%', md: '50%' }}
                    mb={0}
                  />
                  <DisplayField
                    label="Fecha de Ingreso al Grupo"
                    value={persona?.fechaIngresoGrupo ? formatoFechaISOaDDMMAAAA(persona.fechaIngresoGrupo) : '-'}
                    width={{ base: '100%', md: '50%' }}
                    mb={0}
                  />
                </Box>

                {/* Fila 4: Nombre completo del Grupo */}
                {persona?.gruposinvestigacion?.nombre && (
                  <Box
                    display='flex'
                    flexDirection={{ base: 'column', md: 'row' }}
                    width='100%'
                    gap={4}
                    mb={4}
                  >
                    <DisplayField
                      label="Nombre del Grupo"
                      value={persona.gruposinvestigacion.nombre}
                      width='100%'
                      mb={0}
                    />
                  </Box>
                )}

                {/* Fila 5: ORCID y Estado */}
                <Box
                  display='flex'
                  flexDirection={{ base: 'column', md: 'row' }}
                  width='100%'
                  gap={4}
                  mb={4}
                >
                  <DisplayField
                    label="Número ORCID"
                    value={persona?.orcid || '-'}
                    width={{ base: '100%', md: '50%' }}
                    mb={0}
                  />
                  <DisplayField
                    label="Estado"
                    width={{ base: '100%', md: '50%' }}
                    mb={0}
                    value={
                      <Box display='flex' alignItems='center'>
                        <Box
                          width='8px'
                          height='8px'
                          borderRadius='100%'
                          bg={persona?.activo ? 'green.500' : 'red.500'}
                          mr={2}
                        />
                        <Text fontSize='md' color={persona?.activo ? 'green.600' : 'red.600'}>
                          {persona?.activo ? 'Activo' : 'Inactivo'}
                        </Text>
                      </Box>
                    }
                  />
                </Box>

                {/* Fila 6: Clasificación Académica (Becario o Posgrado) */}
                {esBecario ? (
                  <Box
                    display='flex'
                    flexDirection={{ base: 'column', md: 'row' }}
                    width='100%'
                    gap={4}
                    mb={4}
                  >
                    <DisplayField
                      label="Tipo de Becario"
                      value={persona?.tipoBecario || '-'}
                      width={persona?.resolucionBeca ? { base: '100%', md: '50%' } : '100%'}
                      mb={0}
                    />
                    {persona?.resolucionBeca && (
                      <DisplayField
                        label="Número de Resolución"
                        value={persona.resolucionBeca}
                        width={{ base: '100%', md: '50%' }}
                        mb={0}
                      />
                    )}
                  </Box>
                ) : (
                  <>
                    <Box
                      display='flex'
                      flexDirection={{ base: 'column', md: 'row' }}
                      width='100%'
                      gap={4}
                      mb={4}
                    >
                      <DisplayField
                        label="Tiene Posgrado"
                        value={tienePosgrado ? 'Sí' : 'No'}
                        width={tienePosgrado ? { base: '100%', md: '50%' } : '100%'}
                        mb={0}
                      />
                      {tienePosgrado && (
                        <DisplayField
                          label="Nivel de Posgrado"
                          value={
                            persona?.nivelPosgrado === 'doctorado' ? 'Doctorado' :
                              persona?.nivelPosgrado === 'maestria' ? 'Maestría' :
                                persona?.nivelPosgrado === 'especializacion' ? 'Especialización' :
                                  persona?.nivelPosgrado === 'diplomatura' ? 'Diplomatura' :
                                    persona?.nivelPosgrado === 'otro' ? 'Otro' : '-'
                          }
                          width={{ base: '100%', md: '50%' }}
                          mb={0}
                        />
                      )}
                    </Box>

                    {tienePosgrado && persona?.nivelPosgrado === 'otro' && persona?.otroPosgrado && (
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        gap={4}
                        mb={4}
                      >
                        <DisplayField
                          label="Especificación del Posgrado"
                          value={persona.otroPosgrado}
                          width='100%'
                          mb={0}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </CardBody>
          </Card>

          {/* Tarjeta 2: Categorías (Ministerio y UTN) */}
          <Card width='100%' mb={6}>
            <CardBody>
              {/* Categoría Ministerio */}
              <Text fontSize='md' fontWeight='bold' mb={3}>
                Categoría Ministerio
              </Text>
              {categoriasMIN?.length > 0 ? (
                <Tabla
                  columnas={['Fecha', 'Categoría', 'Resolución', 'Comisión', '', '']}
                  datos={categoriasMIN?.map((item) => [
                    formatoFechaISOaDDMMAAAA(item.fecha),
                    item.categoria,
                    item.normativa,
                    item.comision,
                    <PermissionGate key={`delete-min-${item.idCategoria}`} module='investigadores' action='delete'>
                      <Link>
                        <DeleteIcon onClick={() => openModal(item)} />
                        <CustomModal
                          isOpen={isOpen}
                          onClose={closeModal}
                          eliminar={true}
                          title='Eliminar categoria'
                          content='Se eliminará la categoría de ministerio'
                          onSave={() => {
                            if (selectedCategoria) {
                              mutate(selectedCategoria.idCategoria);
                            }
                          }}
                        />
                      </Link>
                    </PermissionGate>,
                    <PermissionGate key={`edit-min-${item.idCategoria}`} module='investigadores' action='edit'>
                      <Link>
                        <EditIcon onClick={() => openModalEdit(item)} />
                        <EditCategoriaModal
                          key={item.idCategoria}
                          categoria={selectedCategoria}
                          isOpen={isOpenEdit}
                          onClose={closeModalEdit}
                          guardar={true}
                          title='Editar categoria'
                        />
                      </Link>
                    </PermissionGate>,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault src={NoData} alt='No Data' width='25%' text='No hay categorías de ministerio para mostrar.' />
              )}

              <Box my={6} borderBottom='1px' borderColor='gray.200' />

              {/* Categoría UTN */}
              <HStack width='100%' justifyContent='space-between' alignItems='center' mb={3}>
                <Text fontSize='md' fontWeight='bold'>
                  Categoría UTN
                </Text>
                <PermissionGate module='investigadores' action='create'>
                  <Link to={'nueva-categoria'}>
                    <Button colorScheme='blue' variant='outline' size='sm'>
                      Nueva Categoría
                    </Button>
                  </Link>
                </PermissionGate>
              </HStack>

              {categoriasUTN?.length > 0 ? (
                <Tabla
                  columnas={['Fecha', 'Categoría', 'Resolución', 'Equiparación', 'Comisión', '', '']}
                  datos={categoriasUTN?.map((item) => [
                    formatoFechaISOaDDMMAAAA(item.fecha),
                    item.categoria,
                    item.normativa,
                    item.equiparacion ? 'SI' : 'NO',
                    item.comision,
                    <PermissionGate key={`delete-utn-${item.idCategoria}`} module='investigadores' action='delete'>
                      <Link>
                        <DeleteIcon onClick={() => openModal(item)} />
                        <CustomModal
                          isOpen={isOpen}
                          onClose={closeModal}
                          eliminar={true}
                          title='Eliminar categoria'
                          content='Se eliminará la categoría UTN'
                          onSave={() => {
                            if (selectedCategoria) {
                              mutate(selectedCategoria.idCategoria);
                            }
                          }}
                        />
                      </Link>
                    </PermissionGate>,
                    <PermissionGate key={`edit-utn-${item.idCategoria}`} module='investigadores' action='edit'>
                      <Link>
                        <EditIcon onClick={() => openModalEdit(item)} />
                        <EditCategoriaModal
                          key={item.idCategoria}
                          categoria={selectedCategoria}
                          isOpen={isOpenEdit}
                          onClose={closeModalEdit}
                          guardar={true}
                          title='Editar categoria'
                        />
                      </Link>
                    </PermissionGate>,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault src={NoData2} alt='No Data' width='25%' text='No hay categorías UTN para mostrar.' />
              )}
            </CardBody>
          </Card>

          {/* Tarjeta 3: Proyectos */}
          <Card width='100%' mb={6}>
            <CardBody>
              <Text fontSize='md' fontWeight='bold' mb={3}>
                Proyectos
              </Text>
              {dataProyectos?.proyectos?.length > 0 ? (
                <Tabla
                  columnas={['Fec. Inicio', 'Fec. Fin', 'Denominación', 'Tipo Act.', 'Estado', 'Ing. al proyecto', 'Rol', 'Más']}
                  datos={dataProyectos?.proyectos?.map((item) => [
                    formatoFechaISOaDDMMAAAA(item.fechaInicio),
                    formatoFechaISOaDDMMAAAA(item.fechaFin),
                    item.denominacion,
                    item.tipoActividad,
                    item.estado,
                    formatoFechaISOaDDMMAAAA(item.fechaIngreso),
                    item.rol,
                    <Link key={`proyecto-link-${item.idProyecto}`} to={`/proyectos/${item.idProyecto}`}>
                      <PlusSquareIcon />
                    </Link>,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault src={NoData3} alt='No Data' width='25%' text='No hay proyectos para mostrar.' />
              )}
            </CardBody>
          </Card>

          {/* Tarjeta 4: Propiedad Intelectual */}
          <Card width='100%' mb={6}>
            <CardBody>
              <Text fontSize='md' fontWeight='bold' mb={3}>
                Propiedad Intelectual
              </Text>
              {dataPropiedadIntelectual?.propiedadIntelectual?.length > 0 ? (
                <Tabla
                  columnas={['Tipo', 'N° Expediente', 'Proyecto', 'Participación (%)', 'Fec. Inicio', 'Más']}
                  datos={dataPropiedadIntelectual?.propiedadIntelectual?.map((item) => [
                    item.tipoPI,
                    item.numeroExpediente || '-',
                    item.proyectos?.denominacion?.length > 30
                      ? `${item.proyectos.denominacion.substring(0, 30)}...`
                      : item.proyectos?.denominacion || '-',
                    item.porcentajeParticipacion !== null && item.porcentajeParticipacion !== undefined ? `${item.porcentajeParticipacion}%` : '-',
                    formatoFechaISOaDDMMAAAA(item.fechaInicio),
                    <Link key={`pi-link-${item.idPI}`} to={`/proyectos/${item.idProyecto}/propiedad-intelectual/${item.idPI}`}>
                      <PlusSquareIcon />
                    </Link>,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault src={NoData} alt='No Data' width='25%' text='No hay propiedad intelectual para mostrar.' />
              )}
            </CardBody>
          </Card>

          {/* Botón de acción: Reporte */}
          <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end' mb={4}>
            <Button colorScheme='blue' variant='outline' onClick={() => alert('Generar un reporte con los detalles del investigador')}>
              Generar Reporte
            </Button>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}
