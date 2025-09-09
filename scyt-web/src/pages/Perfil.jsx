import React, { useContext, useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Heading,
  Box,
  Avatar,
  Text,
  Button,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { UserContext } from '../context/UserContext';

export default function Perfil() {
  const { currentUser, login } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const toast = useToast();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSave = () => {
    // Guardado local: actualizamos el contexto y localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      toast({ title: 'No autenticado', status: 'error', isClosable: true });
      return;
    }

    // Aquí no llamamos a la API (no especificado). Actualizamos localStorage y contexto.
    localStorage.setItem('usuario', JSON.stringify(form));
    login(token, form);
    setEditMode(false);
    toast({ title: 'Perfil actualizado', status: 'success', isClosable: true });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        height="calc(100vh - 80px - 16px - 1px - 16px)"
        width="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
      </Box>
    );
  }

  return (
    <Card>
      <CardBody>
        <Box display="flex" flexDirection="column" alignItems="center" width="100%">
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Perfil
          </Heading>

          <VStack spacing={6} width={{ base: '100%', md: '60%' }}>
            <Avatar size="2xl" src={form?.avatar || ''} />

            {!editMode ? (
              <Box width="100%">
                <Text fontSize="lg">
                  <strong>Nombre:</strong> {form?.nombre || form?.usuario || '-'}
                </Text>
                <Text fontSize="lg">
                  <strong>Apellido:</strong> {form?.apellido || '-'}
                </Text>
                <Text fontSize="lg">
                  <strong>Email:</strong> {form?.email || '-'}
                </Text>
                <Text fontSize="lg">
                  <strong>Rol / Observación:</strong> {form?.rol || form?.cargo || 'Admin'}
                </Text>
              </Box>
            ) : (
              <Box width="100%">
                <FormControl mb={3}>
                  <FormLabel>Nombre</FormLabel>
                  <Input name="nombre" value={form?.nombre || ''} onChange={handleChange} />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Apellido</FormLabel>
                  <Input name="apellido" value={form?.apellido || ''} onChange={handleChange} />
                </FormControl>
                <FormControl mb={3}>
                  <FormLabel>Email</FormLabel>
                  <Input name="email" value={form?.email || ''} onChange={handleChange} />
                </FormControl>
              </Box>
            )}

            <HStack>
              {editMode ? (
                <>
                  <Button colorScheme="blue" onClick={onSave}>
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={() => setEditMode(false)}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button colorScheme="blue" onClick={() => setEditMode(true)}>
                  Editar Perfil
                </Button>
              )}
            </HStack>
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
}
