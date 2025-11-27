import { useContext, useState, useEffect } from 'react';
import { Card, CardBody, Heading, Box, Avatar, Text, Button, VStack, Spinner, Divider } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import GenericInput from '../../components/formControls/GenericInput';
import ThemeSelector from '../../components/ThemeSelector';

export default function Perfil() {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  // Función para obtener las iniciales del usuario
  const getInitials = (user) => {
    if (!user) return '';

    if (typeof user === 'string') {
      return user.charAt(0).toUpperCase();
    }

    if (typeof user === 'object') {
      const nombre = user.nombre || '';
      const apellido = user.apellido || '';
      const usuario = user.usuario || '';

      if (nombre && apellido) {
        return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase();
      } else if (nombre) {
        return nombre.charAt(0).toUpperCase();
      } else if (usuario) {
        return usuario.charAt(0).toUpperCase();
      }
    }

    return '';
  };

  useEffect(() => {
    // Normalizar currentUser (puede ser string o objeto)
    if (!currentUser) {
      setForm({});
      setLoading(false);
      return;
    }

    if (typeof currentUser === 'string') {
      setForm({ usuario: currentUser });
    } else if (typeof currentUser === 'object') {
      setForm(currentUser);
    } else {
      setForm({});
    }
    setLoading(false);
  }, [currentUser]);

  if (loading) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' alignItems='center' width='100%'>
          <Heading as='h2' size='xl' mb={4} textAlign='center'>
            Perfil de Usuario
          </Heading>

          <br />

          <Card width='100%'>
            <CardBody>
              <VStack spacing={6} width='100%' mb={6}>
                <Avatar
                  size='2xl'
                  src={form?.avatar || ''}
                  name={getInitials(form)}
                  bg={!form?.avatar ? 'blue.500' : undefined}
                  color={!form?.avatar ? 'white' : undefined}
                />
              </VStack>
              <Text fontSize='md' fontWeight='bold' mb={4}>
                Datos del perfil
              </Text>

              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box
                  display='flex'
                  flexDirection={{ base: 'column', md: 'row' }}
                  alignItems='center'
                  justifyContent='space-between'
                  width='100%'
                  gap={4}
                >
                  <GenericInput label='Nombre' width={{ base: '100%', md: '30%' }} value={form?.nombre || form?.usuario || '-'} disabled mb='5vh' />

                  <GenericInput label='Apellido' width={{ base: '100%', md: '30%' }} value={form?.apellido || '-'} disabled mb='5vh' />

                  <GenericInput label='Email' width={{ base: '100%', md: '30%' }} value={form?.email || '-'} disabled mb='5vh' />
                </Box>

                <Box
                  display='flex'
                  flexDirection={{ base: 'column', md: 'row' }}
                  alignItems='center'
                  justifyContent='space-between'
                  width='100%'
                  gap={4}
                >
                  <GenericInput
                    label='Rol / Observación'
                    width={{ base: '100%', md: '48%' }}
                    value={currentUser?.rol.charAt(0).toUpperCase() + currentUser?.rol.slice(1) || '-'}
                    disabled
                    mb='5vh'
                  />
                </Box>

                <Box display='flex' width='100%' alignItems='center' justifyContent='flex-end'>
                  <Link to={'/perfil/editar'}>
                    <Button colorScheme='blue' variant='outline'>
                      Editar Perfil
                    </Button>
                  </Link>
                </Box>
              </Box>
            </CardBody>
          </Card>

          {/* Sección de Configuración */}
          <Card width='100%' mt={6}>
            <CardBody>
              <Text fontSize='md' fontWeight='bold' mb={4}>
                Configuración
              </Text>
              <Divider mb={4} />
              <ThemeSelector />
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}
