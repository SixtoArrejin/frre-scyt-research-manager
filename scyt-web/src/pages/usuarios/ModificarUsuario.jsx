import { useContext, useEffect } from 'react';
import {
  Card,
  CardBody,
  Heading,
  Box,
  Button,
  VStack,
  HStack,
  useToast,
  FormControl,
  FormLabel,
  Switch,
  Spinner,
} from '@chakra-ui/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getAllUsuarios, updateUsuario, getRoles } from '../../utils/api/usuariosApi';
import { UserContext } from '../../context/UserContext';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import BackButton from '../../components/BackButton';

export default function ModificarUsuario() {
  const { usuario: usuarioParam } = useParams();
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      activo: true,
      rol: 'viewer',
    },
  });

  // Obtener datos del usuario actual
  const { data: usuariosData, isLoading: loadingUsuarios } = useQuery('usuarios', getAllUsuarios);
  const { data: rolesData } = useQuery('roles', getRoles);

  const updateUsuarioMutation = useMutation(
    (data) => updateUsuario(usuarioParam, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('usuarios');
        toast({
          title: 'Usuario actualizado',
          description: `Usuario "${usuarioParam}" actualizado exitosamente`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/usuarios');
      },
      onError: (error) => {
        toast({
          title: 'Error',
          description: error.message || 'Error al actualizar el usuario',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      },
    },
  );

  // Encontrar el usuario a editar
  const usuarioToEdit = usuariosData?.usuarios?.find(u => u.usuario === usuarioParam);

  // Llenar el formulario con los datos del usuario
  useEffect(() => {
    if (usuarioToEdit) {
      setValue('rol', usuarioToEdit.rol);
      setValue('activo', usuarioToEdit.activo);
    }
  }, [usuarioToEdit, setValue]);

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

  const onSubmit = (data) => {
    // No incluir contraseña vacía en la actualización
    const updateData = { ...data };

    if (!updateData.contrasena || updateData.contrasena.trim() === '') {
      delete updateData.contrasena;
    } else if (updateData.contrasena.length < 6) {
      toast({
        title: 'Error de validación',
        description: 'La contraseña debe tener al menos 6 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    updateUsuarioMutation.mutate(updateData);
  };

  const rolesOptions = rolesData?.roles?.map(role => ({
    value: role,
    label: role.toUpperCase(),
  })) || [];

  if (loadingUsuarios) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  if (!usuarioToEdit) {
    return (
      <Card>
        <CardBody>
          <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
            <Heading as='h2' size='xl' textAlign='center' color='red.500'>
              Usuario no encontrado
            </Heading>
          </Box>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <HStack width='100%' justifyContent='space-between' mb={6}>
            <BackButton to='/usuarios' />
            <Heading as='h2' size='xl' textAlign='center'>
              Modificar Usuario: {usuarioParam}
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>

          <Box width='100%' maxWidth='600px'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6} align='stretch'>

                {/* Usuario - Solo lectura */}
                <FormControl>
                  <FormLabel>Usuario</FormLabel>
                  <Box
                    p={3}
                    borderWidth='1px'
                    borderRadius='md'
                    bg='gray.50'
                    color='gray.600'
                  >
                    {usuarioParam}
                  </Box>
                  <Box mt={1} fontSize='sm' color='gray.500'>
                    El nombre de usuario no se puede modificar
                  </Box>
                </FormControl>

                {/* Nueva Contraseña - Opcional */}
                <GenericInput
                  name='contrasena'
                  placeholder='Nueva contraseña (dejar vacío para mantener actual)'
                  type='password'
                  register={register}
                  label='Nueva Contraseña'
                  helperText='Mínimo 6 caracteres. Dejar vacío para mantener la actual'
                />

                {/* Rol */}
                <GenericSelect
                  name='rol'
                  placeholder='Seleccionar rol'
                  register={register}
                  options={rolesOptions}
                  isRequired
                  label='Rol'
                  helperText='Define los permisos que tendrá el usuario'
                  defaultValue={usuarioToEdit.rol}
                />

                {/* Estado Activo */}
                <FormControl>
                  <FormLabel>Estado del Usuario</FormLabel>
                  <Switch
                    {...register('activo')}
                    isChecked={watch('activo')}
                    colorScheme='green'
                    size='lg'
                    isDisabled={usuarioParam === currentUser.usuario}
                  />
                  <Box mt={2} fontSize='sm' color='gray.600'>
                    {usuarioParam === currentUser.usuario
                      ? 'No puedes desactivar tu propio usuario'
                      : (watch('activo') ? 'Usuario activo' : 'Usuario inactivo')
                    }
                  </Box>
                </FormControl>

                {/* Información adicional */}
                <Box p={4} bg='gray.50' borderRadius='md'>
                  <VStack align='start' spacing={2}>
                    <Box><strong>Creado:</strong> {new Date(usuarioToEdit.creadoEn).toLocaleDateString('es-ES')}</Box>
                    <Box><strong>Creado por:</strong> {usuarioToEdit.creadoPor || 'Sistema'}</Box>
                  </VStack>
                </Box>

                {/* Botones */}
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  mt="2%"
                >
                  <Button
                    as={Link}
                    to='/usuarios'
                    colorScheme="gray"
                    variant="outline"
                    mr="5%"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='submit'
                    colorScheme="blue"
                    variant="outline"
                    ml="5%"
                    isLoading={updateUsuarioMutation.isLoading}
                    loadingText='Actualizando...'
                  >
                    Actualizar
                  </Button>
                </Box>
              </VStack>
            </form>
          </Box>
        </Box>
      </CardBody>
    </Card>
  );
}
