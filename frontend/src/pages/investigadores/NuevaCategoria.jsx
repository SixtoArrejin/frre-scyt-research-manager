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
  Stack,
  Select,
  FormLabel,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import {
  Search2Icon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import { Radio, RadioGroup } from "@chakra-ui/react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createCategoria } from "../../utils/api/categoriasApi";
import { useMutation } from "react-query";

export default function NuevaCategoria() {
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual
  const [nombre, setNombre] = useState("");
  const [grupo, setGrupo] = useState("");
  const [investigadoresFiltrados, setInvestigadoresFiltrados] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState(false);

  const toast = useToast()
  const navigate = useNavigate()

  const { idPersona } = useParams()

  const [valueCategoria, setValueCategoria] = useState("ministerio");

  const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm({
    defaultValues: {
      tipo: "",
      equiparacion: true,
      categoria: "",
      fecha: "",
      normativa: "",
      idPersona: parseInt(idPersona),
    },
  }
  );

  const { mutate, isLoading } = useMutation(
    {
      mutationFn: (formData) => createCategoria(formData),
      onSuccess: () => {
        toast({
          title: "Nueva categoria",
          description: `Categoria creada exitosamente.`,
          status: "success",
          isClosable: true,
        });
        // navigate(-1);
      },
      onError: () => {
        toast({
          title: "Error al crear la categoria",
          description: `Intente de nuevo.`,
          status: "error",
          isClosable: true,
        });
      },
    }
  );

  const tr = true;

  const fl = false;

  const onSub = (values) => {
    // const gg = getValues('equiparacion')
    // setValue('equiparacion', getValues('equiparacion')==='true');
    console.log(values);
    mutate(values)
  }

  const onChangeRadio = (value) => {
    if (value==="true"){
      setValue('equiparacion', true)
    } else {
      setValue('equiparacion', false)
    }
  }

  const catUTN = ["A", "B", "C", "D", "E"];
  const catMIN = ["I", "II", "III", "IV", "V"]

  return (
    <>
      <Card>
        <CardBody>
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Heading as="h2" size="xl" textAlign="center">
              NUEVA CATEGORIA
            </Heading>

            <br />
            <br />
            <Card width="100%">
              <CardBody>
                <Text fontSize="md">Datos de categoria</Text>
                <br />
                <form onSubmit={handleSubmit((values) => onSub(values))} >
                  <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                        {/* <FormControl variant="floating" id="apellido" width={{ base: '100%', md: '50%' }} mb='5vh'>
                          <Input name="apellido" placeholder="Apellido" {...register('apellido')} />
                          <FormLabel>Apellido</FormLabel>
                        </FormControl> */}
                        <Text mb='1vh'>Tipo de categoria: </Text>
                        <RadioGroup
                          onChange={setValueCategoria}
                          value={valueCategoria}
                          mb='5vh'
                        >
                          <Stack direction="row" spacing={10} {...register('tipo')}>
                            <Radio value="ministerio" {...register('tipo')}>Ministerio</Radio>
                            <Radio value="utn" {...register('tipo')}>UTN</Radio>
                          </Stack>
                        </RadioGroup>
                      </Box>

                      <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                        <Text mb='1vh'>Equiparacion:</Text>
                        <RadioGroup isDisabled={valueCategoria === "ministerio"} mb='5vh' onChange={ (value) => onChangeRadio(value)}>
                          <Stack direction="row" spacing={10} >
                            <Radio value="true">Si</Radio>
                            <Radio value="false">No</Radio>
                          </Stack>
                        </RadioGroup>
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                        <FormControl variant="floating" id="categoria" width={{ base: '100%', md: '50%' }} mb='5vh'>
                          <Select placeholder="Seleccione categoria" {...register('categoria')} >
                            {valueCategoria == 'utn'
                              ? // Categorias de utn
                              catUTN.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))
                              : // Categorias de MIN
                              catMIN.map((option, index) => (
                                <option key={index} value={option}>
                                  {option}
                                </option>
                              ))
                              }
                          </Select>
                          <FormLabel>Categoria</FormLabel>
                        </FormControl>
                      </Box>

                      <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                        <FormControl variant="floating" id="normativa" width={{ base: '100%', md: '50%' }} mb='5vh'>
                          <Input name="normativa" placeholder="Normativa" {...register('normativa')} />
                          <FormLabel>Normativa</FormLabel>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">
                      <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                        <FormControl variant="floating" id="fecha" width={{ base: '100%', md: '50%' }} mb='5vh'>
                          <Input name="fecha" type="date" placeholder="Fecha" {...register('fecha')} />
                          <FormLabel>Fecha</FormLabel>
                        </FormControl>
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

    </>
  );
}
