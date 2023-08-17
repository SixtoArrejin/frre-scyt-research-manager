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
  useToast,
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import { Search2Icon, AddIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from '../../utils/data/ListaCategorias.json'
import { Link, useNavigate, useParams } from 'react-router-dom';
import proyectosInv from '../../utils/data/proyectosInv.json';
import { useForm } from "react-hook-form";
import { getPersonaById, updatePersona } from "../../utils/api/personasApi";
import { useMutation, useQuery } from "react-query";
import { getAllGrupos } from "../../utils/api/gruposApi";

export default function ModificarInvestigador() {
  const [nya, setNya] = useState('Un investigador');
  const [dni, setDni] = useState('44652641');
  const [estado, setEstado] = useState(false)
  const [grupo, setGrupo] = useState('CINAPTIC')

  const navigate = useNavigate()
  const toast = useToast()

  const [activoInicial, setActivoInicial] = useState('false');
  const [radio, setRadio] = useState("false")

  const { idPersona } = useParams();

  const { data: investigador, isLoading, error: errorInvestigador } = useQuery(['persona'], () => getPersonaById(idPersona));
  const { data: grupos, isLoading: isLoadingGetGrupos, error: errorGrupos } = useQuery('grupos', () => getAllGrupos());

  useEffect(() => {

    investigador?.persona.activo ? setRadio("true") : setRadio("false")

    setValue("activo", investigador?.persona.activo)
    setValue("nombre", investigador?.persona.nombre)
    setValue("apellido", investigador?.persona.apellido)
    setValue("dni", investigador?.persona.dni)
    setValue("comision", investigador?.persona.comision)
    setValue("idGrupoInvestigacion", investigador?.persona.idGrupoInvestigacion)
  }, [investigador]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      nombre: investigador?.persona?.nombre,
      apellido: investigador?.persona?.apellido,
      dni: investigador?.persona?.dni,
      comision: investigador?.persona?.comision,
      idGrupoInvestigacion: investigador?.persona?.idGrupoInvestigacion,
      activo: investigador?.persona?.activo,
    },
  }
  );

  const { mutate, isLoading: isLoadingMutation } = useMutation(
    {
      mutationFn: (formData) => updatePersona(idPersona, formData),
      onSuccess: () => {
        toast({
          title: "Modificar investigador",
          description: `Se ha modificado el investigador exitosamente`,
          status: "success",
          isClosable: true,
        });
        navigate(-1);
      },
      onError: () => {
        toast({
          title: "Error al modificar los datos del investigador",
          description: `Intente de nuevo.`,
          status: "error",
          isClosable: true,
        });
      },
    }
  );
  
  
  const handleChangeRadio = (value) => {
    if (value=="true") {
      setValue('activo', true);
      setRadio("true");
    } else {
      setValue('activo', false);
      setRadio("false")
    }
  }

  const onSub = (values) => {
    console.log(values);
    mutate(values);
  }

  const [gruposExistentes, setGruposExistentes] = useState(['CINAPTIC', 'ACHETIQ', 'OTROS'])

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center' >
          <Heading as="h2" size="xl" textAlign="center">
            MODIFICAR DATOS DEL INVESTIGADOR
          </Heading>

          <br />
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize="md">Ingrese los datos del investigador</Text>
              <br />
              <form
              onSubmit={handleSubmit((values) => onSub(values))}
              >
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="apellido" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Input name="apellido" placeholder="Apellido" {...register('apellido')} defaultValue={investigador?.persona?.apellido || ''} />
                        <FormLabel>Apellido</FormLabel>
                      </FormControl>
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="nombre" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Input name="nombre" placeholder="Nombre" {...register('nombre')} defaultValue={investigador?.persona?.nombre || ''} />
                        <FormLabel>Nombre</FormLabel>
                      </FormControl>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="dni" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Input name="dni" type='number' placeholder="DNI" {...register('dni', { valueAsNumber: true })} defaultValue={investigador?.persona?.dni || ''} />
                        <FormLabel>DNI</FormLabel>
                      </FormControl>
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="comision" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Input name="comision" placeholder="Comisión" {...register('comision')} defaultValue={investigador?.persona?.comision || ''} />
                        <FormLabel>Comisión</FormLabel>
                      </FormControl>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <FormControl variant="floating" id="grupo" width={{ base: '100%', md: '50%' }} mb='5vh'>
                        <Select placeholder='Grupo...' {...register('idGrupoInvestigacion', { valueAsNumber: true })}>
                          {grupos?.grupos.map((grupo, key) => (
                            <option selected={grupo.idGrupoInvestigacion == investigador?.persona?.idGrupoInvestigacion} key={key} value={grupo.idGrupoInvestigacion}>
                              {grupo.siglas}
                            </option>))
                          }
                        </Select>
                        <FormLabel>Grupo</FormLabel>
                      </FormControl>
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <RadioGroup value={radio} onChange={(value) => handleChangeRadio(value)} mb='5vh'>
                        <Stack direction='row'>
                          <Radio value='true' isChecked>Activo</Radio>
                          <Radio value='false'>Inactivo</Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </Box>

                  <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end' >
                    <Button colorScheme="gray" variant="outline" mr='3%' onClick={() => navigate(-1)} >
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