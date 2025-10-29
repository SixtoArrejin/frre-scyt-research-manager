import React, { useContext } from 'react';
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
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { createUsuario, getRoles } from '../../utils/api/usuariosApi';
import { UserContext } from '../../context/UserContext';
import GenericInput from '../../components/formControls/GenericInput';
import GenericSelect from '../../components/formControls/GenericSelect';
import BackButton from '../../components/BackButton';

export default function NuevoUsuario() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      activo: true,
      rol: 'viewer',
    },
  });

  // Obtener roles disponibles
  const { data: rolesData } = useQuery('roles', getRoles);

  const createUsuarioMutation = useMutation(createUsuario, {
    onSuccess: (data) => {
      toast({
        title: 'Usuario creado',
        description: `Usuario "${data.newUser.usuario}" creado exitosamente`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/usuarios');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Error al crear el usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const onSubmit = (data) => {
    // Validaciones básicas
    if (!data.usuario || data.usuario.length < 3) {
      toast({
        title: 'Error de validación',
        description: 'El nombre de usuario debe tener al menos 3 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!data.contrasena || data.contrasena.length < 6) {
      toast({
        title: 'Error de validación',
        description: 'La contraseña debe tener al menos 6 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    createUsuarioMutation.mutate(data);
  };

  const rolesOptions = rolesData?.roles?.map(role => ({
    value: role,
    label: role.toUpperCase(),
  })) || [];

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

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <HStack width='100%' justifyContent='space-between' mb={6}>
            <BackButton to='/usuarios' />
            <Heading as='h2' size='xl' textAlign='center'>
              Nuevo Usuario
            </Heading>
            <Box /> {/* Spacer para centrar el título */}
          </HStack>

          <Box width='100%' maxWidth='600px'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={6} align='stretch'>

                {/* Usuario */}
                <GenericInput
                  name='usuario'
                  placeholder='Usuario'
                  type='text'
                  register={register}
                  isRequired
                  label='Usuario'
                  helperText='Mínimo 3 caracteres, será único en el sistema'
                />

                {/* Contraseña */}
                <GenericInput
                  name='contrasena'
                  placeholder='Contraseña'
                  type='password'
                  register={register}
                  isRequired
                  label='Contraseña'
                  helperText='Mínimo 6 caracteres'
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
                />

                {/* Estado Activo */}
                <FormControl>
                  <FormLabel>Estado del Usuario</FormLabel>
                  <Switch
                    {...register('activo')}
                    defaultChecked={true}
                    colorScheme='green'
                    size='lg'
                  />
                  <Box mt={2} fontSize='sm' color='gray.600'>
                    {watch('activo') ? 'Usuario activo' : 'Usuario inactivo'}
                  </Box>
                </FormControl>

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
                    isLoading={createUsuarioMutation.isLoading}
                    loadingText='Creando...'
                  >
                    Crear Usuario
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
