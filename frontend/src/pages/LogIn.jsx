import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  VStack,
  Image,
  Input,
  Link,
  Stack,
  Text,
  useCounter,
  useToast,
} from '@chakra-ui/react'
import Logo from '../img/SCyT.jpg'
import { UserContext } from '../context/UserContext';
import { useContext } from "react";
import { useEffect } from 'react';
import { logInUser } from '../utils/api/logInApi';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
//   import { OAuthButtonGroup } from './OAuthButtonGroup'
//   import { PasswordField } from './PasswordField'
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object({
  usuario: yup.string().required("Usuario requerido"),
  contrasena: yup.
    string()
    .required("Contraseña requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
});

export default function LogIn() {
  const toast = useToast()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      usuario: "",
      contrasena: ""
    },
    resolver: yupResolver(schema)
  }
  );

  const { login, currentUser } = useContext(UserContext);

  const { mutate, isLoading } = useMutation((formData) => logInUser(formData), {
    // onSuccess se ejecutará cuando la llamada sea exitosa
    onSuccess: (data) => {
      console.log("Respuesta de la solicitud:", data);
      if (data.token && data.usuario) {
        login(data.token, data.usuario);
      }
      toast({
        title: "Inicio de sesión",
        description: `Ha iniciado sesión exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate('/');
    },
    onError: (data) => {
      console.log('Ocurrio un error intente nuevamente', data)
    }
  });

  const onSubmit = (dataForm) => {
    console.log(dataForm)
    mutate(dataForm);
  }

  return (
    <Container
      maxW="lg"
      py={{
        base: '12',
        md: '24',
      }}
      px={{
        base: '0',
        sm: '8',
      }}
    >
      <Stack spacing="8">
        <form onSubmit={handleSubmit(onSubmit)} >
          <VStack spacing="6">
            <Image src={Logo} width='100px' />
            <Stack
              spacing={{
                base: '2',
                md: '3',
              }}
              textAlign="center"
            >
              <Heading
                size={{
                  base: 'xs',
                  md: 'sm',
                }}
              >
                Ingrese a su cuenta
              </Heading>
              {/* <Text color="fg.muted">
                Don't have an account? <Link href="#">Sign up</Link>
              </Text> */}
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
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="usuario">Usuario</FormLabel>
                  {/* <Input type="text" name='usuario' value={dataForm.usuario} onChange={handleChangeUsuario} /> */}
                  <Input type="text" name='usuario' {...register('usuario')} />
                  <Text fontSize="md" color='red'>{errors.usuario?.message}</Text>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="pass">Contraseña</FormLabel>
                  {/* <Input type="password" name='contrasena' value={dataForm.contrasena} onChange={handleChangeContrasena} /> */}
                  <Input type="password" name='contrasena' {...register('contrasena')} />
                  <Text fontSize="md" color='red'>{errors.contrasena?.message}</Text>
                </FormControl>
                {/* <PasswordField /> */}
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Recuerdame</Checkbox>
                <Button variant="text" size="sm">
                  ¿Olvidaste tu contraseña?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button type='submit' isLoading={isLoading} >Iniciar sesión</Button>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Container>
  );
}