import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  VStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Logo from '../img/SCyT-SinFondo.png';
import { UserContext } from '../context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { logInUser } from '../utils/api/logInApi';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  usuario: yup.string().required('Usuario requerido'),
  contrasena: yup.string().required('Contraseña requerida').min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

// Claves para localStorage
const REMEMBER_USER_KEY = 'scyt_remember_user';
const REMEMBERED_USERNAME_KEY = 'scyt_remembered_username';

export default function LogIn() {
  const toast = useToast();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      usuario: '',
      contrasena: '',
    },
    resolver: yupResolver(schema),
  });

  // Cargar usuario recordado al montar el componente
  useEffect(() => {
    const shouldRemember = localStorage.getItem(REMEMBER_USER_KEY) === 'true';
    const rememberedUsername = localStorage.getItem(REMEMBERED_USERNAME_KEY);

    if (shouldRemember && rememberedUsername) {
      setRememberMe(true);
      setValue('usuario', rememberedUsername);
    }
  }, [setValue]);

  const { login } = useContext(UserContext);

  const { mutate, isLoading } = useMutation((formData) => logInUser(formData), {
    // onSuccess se ejecutará cuando la llamada sea exitosa
    onSuccess: (data) => {
      if (data.token && data.usuario) {
        login(data.token, data.usuario);

        // Manejar funcionalidad "Recuérdame"
        if (rememberMe) {
          localStorage.setItem(REMEMBER_USER_KEY, 'true');
          localStorage.setItem(REMEMBERED_USERNAME_KEY, data.usuario.usuario);
        } else {
          localStorage.removeItem(REMEMBER_USER_KEY);
          localStorage.removeItem(REMEMBERED_USERNAME_KEY);
        }
      }
      toast({
        title: 'Inicio de sesión',
        description: 'Ha iniciado sesión exitosamente.',
        status: 'success',
        isClosable: true,
      });
      navigate('/');
    },
    onError: (data) => {
      toast({
        title: 'Inicio de sesión',
        description: 'Usuario o contraseña incorrectos.',
        status: 'error',
        isClosable: true,
      });
    },
  });

  const onSubmit = (dataForm) => {
    mutate(dataForm);
  };

  return (
    <Container
      maxW='lg'
      py={{
        base: '12',
        md: '24',
      }}
      px={{
        base: '0',
        sm: '8',
      }}
    >
      <Stack spacing='8'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing='6'>
            <Image src={Logo} width='100px' />
            <Stack
              spacing={{
                base: '2',
                md: '3',
              }}
              textAlign='center'
            >
              <Heading
                size={{
                  base: 'xs',
                  md: 'sm',
                }}
              >
                Ingrese a su cuenta
              </Heading>
            </Stack>
          </VStack>
          <Box
            py={{
              base: '0',
              sm: '8',
            }}
            px={{
              base: '4',
              sm: '10',
            }}
            bg={{
              base: 'transparent',
              sm: 'bg.surface',
            }}
            boxShadow={{
              base: 'none',
              sm: 'md',
            }}
            borderRadius={{
              base: 'none',
              sm: 'xl',
            }}
          >
            <Stack spacing='6'>
              <Stack spacing='5'>
                <FormControl>
                  <FormLabel htmlFor='usuario'>Usuario</FormLabel>
                  <Input type='text' name='usuario' {...register('usuario')} />
                  <Text fontSize='md' color='red'>
                    {errors.usuario?.message}
                  </Text>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor='pass'>Contraseña</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name='contrasena'
                      {...register('contrasena')}
                    />
                    <InputRightElement h='100%'>
                      <IconButton
                        variant='ghost'
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={toggleShowPassword}
                        size='sm'
                      />
                    </InputRightElement>
                  </InputGroup>
                  <Text fontSize='md' color='red'>
                    {errors.contrasena?.message}
                  </Text>
                </FormControl>
              </Stack>
              <HStack justify='space-between'>
                <Checkbox
                  isChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Recuérdame
                </Checkbox>
                <Button variant='text' size='sm'>
                  ¿Olvidaste tu contraseña?
                </Button>
              </HStack>
              <Stack spacing='6'>
                <Button type='submit' isLoading={isLoading}>
                  Iniciar sesión
                </Button>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Container>
  );
}
