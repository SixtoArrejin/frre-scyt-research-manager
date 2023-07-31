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
} from '@chakra-ui/react'
import Logo from '../img/SCyT.jpg'
import { UserContext } from '../context/UserContext';
import { useContext } from "react";
import { useEffect } from 'react';
import { logInUser } from '../utils/api/logInApi';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//   import { OAuthButtonGroup } from './OAuthButtonGroup'
//   import { PasswordField } from './PasswordField'

export default function LogIn(){
  const navigate = useNavigate()
  const { login, currentUser } = useContext(UserContext);
  const [dataForm, setDataForm] = useState({
    usuario: "",
    contrasena: ""
  });

  const { mutate, isLoading } = useMutation((formData) => logInUser(formData), {
    // onSuccess se ejecutará cuando la llamada sea exitosa
    onSuccess: (data) => {
      // Aquí puedes ver la respuesta por consola
      console.log("Respuesta de la solicitud:", data);

      // Si la respuesta contiene el token o datos de usuario, puedes usarlos para actualizar el contexto de usuario
      if (data.token && data.usuario) {
        login(data.token, data.usuario);
      }
      navigate(`/investigadores`)
    },
  });

  const handleChangeUsuario = (event) => {
    setDataForm({
      ...dataForm,
      usuario: event.target.value,
    });
  }

  const handleChangeContrasena = (event) => {
    setDataForm({
      ...dataForm,
      contrasena: event.target.value,
    });
  }

  const handleSubmit = () => {
    // const fixedUserData = {
    //   usuario: 'chano',
    //   contrasena: '12345678',
    // };
    // Realizamos la llamada a la función logInUser
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
        <VStack spacing="6">
          <Image src={Logo} width='100px'/>
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
              Log in to your account
            </Heading>
            <Text color="fg.muted">
              Don't have an account? <Link href="#">Sign up</Link>
            </Text>
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
                <Input id="usuario" type="text" value={dataForm.usuario} onChange={handleChangeUsuario} />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="pass">Contraseña</FormLabel>
                <Input id="pass" type="password" value={dataForm.contrasena} onChange={handleChangeContrasena} />
              </FormControl>
              {/* <PasswordField /> */}
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>Remember me</Checkbox>
              <Button variant="text" size="sm">
                Forgot password?
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button onClick={handleSubmit}>Sign in</Button>
              <HStack>
                <Divider />
                <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
              {/* <OAuthButtonGroup /> */}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}