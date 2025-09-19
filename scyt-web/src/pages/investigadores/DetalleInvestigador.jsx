import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner, Badge } from '@chakra-ui/react';
import { DeleteIcon, PlusSquareIcon, EditIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { getPersonaById } from '../../utils/api/personasApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { formatoFechaISOaDDMMAAAA } from '../../utils/general';
import { deleteCategoriaById } from '../../utils/api/categoriasApi';
import { getProyectosByPersonaId } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import Tabla from '../../components/Tabla';
import NoData from '../../img/no-data.png';
import NoData2 from '../../img/no-data-2.png';
import NoData3 from '../../img/no-data-3.png';
import ImgDefault from '../../components/ImgDefault';
import EditCategoriaModal from './EditCategoriaModal';
import PermissionGate from '../../components/PermissionGate';
import DisplayField from '../../components/DisplayField';

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

  const { data, isLoading } = useQuery(['persona'], () => getPersonaById(idPersona));
  const { data: dataProyectos } = useQuery(['proyectos', idPersona], () => getProyectosByPersonaId(idPersona));
  const ayn = data?.persona.apellido + ' ' + data?.persona.nombre;

  const toast = useToast();

  useEffect(() => {
    if (dataProyectos) {
      console.log(dataProyectos);
    }

  }, [dataProyectos]);

  const categoriasUTN = data?.persona.categorias.filter((categoria) => categoria.tipo === 'utn');
  const categoriasMIN = data?.persona.categorias.filter((categoria) => categoria.tipo === 'ministerio');
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
      queryClient.refetchQueries(['persona']);
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

  useEffect(() => {
    console.log(categoriasUTN);
    console.log(categoriasMIN);
  }, [categoriasUTN, categoriasMIN]);

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
            Detalles del Investigador
          </Heading>

          <br />
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos del investigador</Text>
              <br />
              <Box display='flex' width='100%' alignItems='flex-start' justifyContent='flex-start' flexDirection='column'>
                <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} alignItems='flex-start' justifyContent='space-between' width='100%'>
                  <Box display='flex' flexDirection='column' width={{ base: '100%', md: '15%' }} mb='5vh'>
                    <Text fontSize='sm' fontWeight='medium' color='gray.500' mb={2}>
                      Estado
                    </Text>
                    <Box display='flex' alignItems='center' width='100%'>
                      <Box
                        width='8px'
                        height='8px'
                        borderRadius='100%'
                        bg={data?.persona?.activo ? 'green.500' : 'red.500'}
                        flexShrink={0}
                        mr={2}
                      />
                      <Badge
                        colorScheme={data?.persona?.activo ? 'green' : 'red'}
                        fontSize='md'
                        borderRadius='md'
                        width='100%'
                        textAlign='center'
                        px={2}
                        py={1}
                      >
                        {data?.persona?.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </Box>
                  </Box>

                  <DisplayField
                    label="Apellido y Nombre"
                    value={data ? ayn : ''}
                    width={{ base: '100%', md: '30%' }}
                    mb='5vh'
                  />

                  <DisplayField
                    label="DNI"
                    value={data?.persona?.dni || ''}
                    width={{ base: '100%', md: '20%' }}
                    mb='5vh'
                  />

                  <DisplayField
                    label="Grupo"
                    value={data?.persona?.gruposinvestigacion?.siglas || ''}
                    width={{ base: '100%', md: '20%' }}
                    mb='5vh'
                  />
                </Box>
                <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                  <PermissionGate module='investigadores' action='edit'>
                    <Link to={'modificar'}>
                      <Button colorScheme='blue' variant='outline'>
                        Modificar
                      </Button>
                    </Link>
                  </PermissionGate>
                </Box>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Categoría Ministerio</Text>
              <br />
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
                          content='Se eliminara la categoria UTN'
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
                <ImgDefault src={NoData} alt='No Data' width='30%' text='No hay categorías de ministerio para mostrar.' />
              )}

              <br />
              <Text fontSize='md'>Categoría UTN</Text>
              <br />
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
                          content='Se eliminara la categoria UTN'
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
                <ImgDefault src={NoData2} alt='No Data' width='30%' text='No hay categorías UTN para mostrar.' />
              )}
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                <PermissionGate module='investigadores' action='create'>
                  <Link to={'nueva-categoria'}>
                    <Button colorScheme='blue' variant='outline'>
                      Nueva Categoría
                    </Button>
                  </Link>
                </PermissionGate>
              </Box>
            </CardBody>
          </Card>

          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Proyectos</Text>
              <br />
              {(dataProyectos?.proyectos?.length > 0) ? (
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
                <ImgDefault src={NoData3} alt='No Data' width='30%' text='No hay proyectos para mostrar.' />
              )}
              <br />
            </CardBody>
          </Card>
          <br />
          <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
            <Button colorScheme='blue' variant='outline' onClick={() => alert('Generar un reporte con los detalles del investigador')}>
              Generar Reporte
            </Button>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}
