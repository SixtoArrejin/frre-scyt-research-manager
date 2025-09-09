import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner } from '@chakra-ui/react';
import { DeleteIcon, PlusSquareIcon, EditIcon } from '@chakra-ui/icons';
import { Link, useParams } from 'react-router-dom';
import { getPersonaById } from '../../utils/api/personasApi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { formatoFechaISOaDDMMAAAA } from '../../utils/general';
import { deleteCategoriaById } from '../../utils/api/categoriasApi';
import { getProyectosByPersonaId } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput';
import Tabla from '../../components/Tabla';
import NoData from '../../img/no-data.png';
import NoData2 from '../../img/no-data-2.png';
import NoData3 from '../../img/no-data-3.png';
import ImgDefault from '../../components/ImgDefault';
import EditCategoriaModal from './EditCategoriaModal';

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

  const { data, isLoading, error } = useQuery(['persona'], () => getPersonaById(idPersona));
  const { data: dataProyectos } = useQuery(['proyectos', idPersona], () => getProyectosByPersonaId(idPersona));
  const ayn = data?.persona.apellido + ' ' + data?.persona.nombre;

  const toast = useToast();

  useEffect(() => {
    if (dataProyectos){
      console.log(dataProyectos)
    }

  }, [dataProyectos])

  const categoriasUTN = data?.persona.categorias.filter((categoria) => categoria.tipo === 'utn');
  const categoriasMIN = data?.persona.categorias.filter((categoria) => categoria.tipo === 'ministerio');
  categoriasUTN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  categoriasMIN?.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (idCategoria) => deleteCategoriaById(idCategoria),
    onSuccess: () => {
      toast({
        title: 'Eliminar categoria',
        description: `Se ha eliminado la categoria exitosamente`,
        status: 'info',
        isClosable: true,
      });
      queryClient.refetchQueries(['persona']);
    },
    onError: () => {
      toast({
        title: 'Eliminar categoria',
        description: `Intente de nuevo.`,
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
            DETALLES INVESTIGADOR
          </Heading>

          <br />
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Datos del investigador</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} alignItems='center' justifyContent='space-between'>
                  <GenericInput label='Apellido y Nombre' width={{ base: '100%', md: '30%' }} value={data ? ayn : ''} disabled mb='5vh' />

                  <GenericInput label='DNI' width={{ base: '100%', md: '20%' }} value={data?.persona?.dni || ''} disabled mb='5vh' />

                  <GenericInput
                    label='Estado'
                    width={{ base: '100%', md: '15%' }}
                    value={data ? (data.persona.activo ? 'Activo' : 'Inactivo') : ''}
                    disabled
                    mb='5vh'
                  />

                  <GenericInput
                    label='Grupo'
                    width={{ base: '100%', md: '15%' }}
                    value={data?.persona?.gruposinvestigacion?.siglas || ''}
                    disabled
                    mb='5vh'
                  />
                </Box>
                <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end'>
                  <Link to={`modificar`}>
                    <Button colorScheme='blue' variant='outline'>
                      Modificar
                    </Button>
                  </Link>
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
                    <Link key={item.idCategoria}>
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
                    </Link>,
                    <Link key={item.idCategoria}>
                      <EditIcon onClick={() => openModalEdit(item)} />
                      <EditCategoriaModal
                        key={item.idCategoria}
                        categoria={selectedCategoria}
                        isOpen={isOpenEdit}
                        onClose={closeModalEdit}
                        guardar={true}
                        title='Editar categoria'
                      />
                    </Link>,
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
                    <Link key={item.idCategoria}>
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
                    </Link>,
                    <Link key={item.idCategoria}>
                      <EditIcon onClick={() => openModalEdit(item)} />
                      <EditCategoriaModal
                        key={item.idCategoria}
                        categoria={selectedCategoria}
                        isOpen={isOpenEdit}
                        onClose={closeModalEdit}
                        guardar={true}
                        title='Editar categoria'
                      />
                    </Link>,
                  ])}
                  paginado={false}
                />
              ) : (
                <ImgDefault src={NoData2} alt='No Data' width='30%' text='No hay categorías UTN para mostrar.' />
              )}
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                <Link to={`nueva-categoria`}>
                  <Button colorScheme='blue' variant='outline'>
                    Nueva Categoría
                  </Button>
                </Link>
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
                    <Link to={`/proyectos/${item.idProyecto}`}>
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
