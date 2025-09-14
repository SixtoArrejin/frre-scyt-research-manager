import React, { useState, useContext, useEffect } from 'react';
import {
  Card,
  CardBody,
  Heading,
  Box,
  Button,
  Spinner,
  useToast,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  HStack,
} from '@chakra-ui/react';
import { PlusSquareIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsuarios, deleteUsuario } from '../../utils/api/usuariosApi';
import { useQuery, useQueryClient } from 'react-query';
import Tabla from '../../components/Tabla';
import { UserContext } from '../../context/UserContext';
import ImgDefault from '../../components/ImgDefault';
import NoData from '../../img/no-data.png';

const columnas = ['Usuario', 'Rol', 'Estado', 'Fecha Creación', 'Creado Por', 'Acciones'];

export default function ListaUsuarios() {
  const { currentUser } = useContext(UserContext);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery('usuarios', () => getAllUsuarios());
  const [usuarios, setUsuarios] = useState(data?.usuarios || []);

  // useEffect para actualizar usuarios cuando lleguen los datos
  useEffect(() => {
    setUsuarios(data?.usuarios || []);
  }, [data]);

  // Verificar si el usuario es admin
  if (currentUser?.rol !== 'admin') {
    return (
      <Card>
        <CardBody>
          <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
            <Heading as='h2' size='xl' textAlign='center' color='red.500'>
              Acceso Denegado
            </Heading>
          </Box>
        </CardBody>
      </Card>
    );
  }

  const handleDeleteClick = (usuario) => {
    // Prevenir eliminar al usuario actual
    if (usuario === currentUser.usuario) {
      toast({
        title: 'Error',
        description: 'No puedes eliminar tu propio usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setUsuarioToDelete(usuario);
    onOpen();
  };

  const handleDeleteConfirm = async() => {
    try {
      await deleteUsuario(usuarioToDelete);
      // Actualizar el estado local inmediatamente
      setUsuarios(usuarios.filter(u => u.usuario !== usuarioToDelete));
      queryClient.invalidateQueries('usuarios');
      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido eliminado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setUsuarioToDelete(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Error al eliminar el usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'red',
      pid: 'blue',
      rrhh: 'green',
      uvt: 'purple',
      viewer: 'gray',
    };
    return colors[role] || 'gray';
  };

  const filas = usuarios?.map((usuario) => [
    usuario.usuario,
    <Badge colorScheme={getRoleBadgeColor(usuario.rol)} key={usuario.usuario}>
      {usuario.rol.toUpperCase()}
    </Badge>,
    <Badge colorScheme={usuario.activo ? 'green' : 'red'} key={`status-${usuario.usuario}`}>
      {usuario.activo ? 'Activo' : 'Inactivo'}
    </Badge>,
    formatDate(usuario.creadoEn),
    usuario.creadoPor || '-',
    <HStack spacing={2} key={`actions-${usuario.usuario}`}>
      <Button
        as={Link}
        to={`/usuarios/${usuario.usuario}/modificar`}
        size="sm"
        colorScheme="blue"
        leftIcon={<EditIcon />}
      >
        Editar
      </Button>
      <Button
        size="sm"
        colorScheme="red"
        leftIcon={<DeleteIcon />}
        onClick={() => handleDeleteClick(usuario.usuario)}
        isDisabled={usuario.usuario === currentUser.usuario}
      >
        Eliminar
      </Button>
    </HStack>,
  ]) || [];

  if (isLoading) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
            <Heading as='h2' size='xl' textAlign='center' color='red.500'>
              Error al cargar usuarios: {error.message}
            </Heading>
          </Box>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardBody>
          <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <Heading as='h2' size='xl' textAlign='center'>
              Administración de Usuarios
            </Heading>

            <br />

            <Box display='flex' width='100%' justifyContent='end' mb={4}>
              <Button as={Link} to='/usuarios/nuevo' colorScheme='blue' leftIcon={<PlusSquareIcon />}>
                Nuevo Usuario
              </Button>
            </Box>

            {filas.length === 0 ? (
              <ImgDefault
                src={NoData}
                text="No hay usuarios registrados"
                colorText="gray.500"
                sizeText="xl"
              />
            ) : (
              <Tabla
                columnas={columnas}
                datos={filas}
                filtro={false}
                checkbox={false}
              />
            )}
          </Box>
        </CardBody>
      </Card>

      {/* Alert Dialog para confirmar eliminación */}
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Eliminar Usuario
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Estás seguro de que deseas eliminar el usuario "{usuarioToDelete}"?
              Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme='red' onClick={handleDeleteConfirm} ml={3}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
