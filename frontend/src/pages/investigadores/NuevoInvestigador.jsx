import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Box,
  Button,
  Checkbox,
  IconButton,
  RadioGroup,
  Stack,
  Radio,
  Select,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import { Search2Icon, AddIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from '../../utils/data/ListaCategorias.json'
import { Link, useNavigate, useParams } from 'react-router-dom';
import proyectosInv from '../../utils/data/proyectosInv.json';
import { useQuery, useMutation } from "react-query";
import { createGrupo, getAllGrupos } from "../../utils/api/gruposApi";
import { useForm } from 'react-hook-form';
import { createPersona } from "../../utils/api/personasApi";

export default function NuevoInvestigador() {
  const toast = useToast();
  const navigate = useNavigate();

  const [nya, setNya] = useState('');
  const [dni, setDni] = useState('');
  const [estado, setEstado] = useState('')
  const [grupo, setGrupo] = useState('')

  const [gruposExistentes, setGruposExistentes] = useState([{ label: 'CINAPTIasdC' }, { label: 'ACHasdETIQ' }])

  const { data, isLoading: isLoadingGetGrupos, error } = useQuery('grupos', () => getAllGrupos());

  const onClick = async () => {
    toast({
      title: "Nuevo Investigador",
      description: `Se ha creado el investigador exitosamente`,
      status: "success",
      isClosable: true,
      duration: 4000
    });}

    const { mutate, isLoading } = useMutation(
      {
        mutationFn: (formData) => createPersona(formData),
        onSuccess: () => {
          toast({
            title: "Nuevo investigador",
            description: `Se ha creado el nuevo investigador exitosamente`,
            status: "success",
            isClosable: true,
          });
          navigate(-1);
        },
        onError: () => {
          toast({
            title: "Error al cargar el investigador",
            description: `Intente de nuevo.`,
            status: "error",
            isClosable: true,
          });
        },
      }
    );
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: null,
      comision: "",
      idGrupoInvestigacion: null,
      activo: true,
    },
  }
  );

  const onSubmit = (dataForm, event) => {
    console.log(dataForm)
    event.preventDefault()
    mutate(dataForm);
  }

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center' >
          <Heading as="h2" size="xl" textAlign="center">
            NUEVO INVESTIGADOR
          </Heading>

          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize="md">Ingrese los datos del investigador</Text>
              <br />
              <form onSubmit={handleSubmit((values) => mutate(values))} >
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="apellido" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Input name="apellido" placeholder="Apellido" {...register('apellido')}/>
                        <FormLabel>Apellido</FormLabel>
                      </FormControl>
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="nombre" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Input name="nombre" placeholder="Nombre" {...register('nombre')}/>
                        <FormLabel>Nombre</FormLabel>
                      </FormControl>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="dni" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Input name="dni" type='number' placeholder="DNI" {...register('dni', { valueAsNumber: true })}/>
                        <FormLabel>DNI</FormLabel>
                      </FormControl>
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="comision" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Input name="comision" placeholder="Comisión" {...register('comision')}/>
                        <FormLabel>Comisión</FormLabel>
                      </FormControl>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="grupo" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Select placeholder='Grupo...' {...register('idGrupoInvestigacion', { valueAsNumber: true })}>
                          {data?.grupos.map((grupo, key) => (
                            <option key={key} value={grupo.idGrupoInvestigacion}>
                              {grupo.siglas}
                            </option>))
                          }
                        </Select>
                        <FormLabel>Grupo</FormLabel>
                      </FormControl>
                    </Box>
                  </Box>

                  <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end' >
                    <Button colorScheme="gray" variant="outline" onClick={onClick} mr='3%'>
                      Cancelar
                    </Button>
                    <Button type='submit' colorScheme="blue" variant="outline">
                      Guardar
                    </Button>
                  </Box>
                </Box>
              </form>

            </CardBody>
          </Card>

        </Box>
      </CardBody>
    </Card>
  );
}