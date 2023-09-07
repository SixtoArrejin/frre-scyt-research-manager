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
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import {
  Search2Icon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DeleteIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from "../../utils/data/ListaCategorias.json";
import { Link, useNavigate, useParams } from "react-router-dom";
import proyectosInv from "../../utils/data/proyectosInv.json";
import { useQuery, useMutation } from "react-query";
import { createGrupo, getAllGrupos } from "../../utils/api/gruposApi";
import { useFieldArray, useForm } from "react-hook-form";
import { createPersona, getAllPersonas } from "../../utils/api/personasApi";
import { formatoFechaISOaAAAAMMDD, formatoFechaISOaDDMMAAAA } from "../../utils/general";

export default function NuevoPid() {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isLoadingGetGrupos,
    error,
  } = useQuery("grupos", () => getAllGrupos());

  const {
    data: dataInvestigadores
  } = useQuery(["investigadoresPID"], () => getAllPersonas());

  const onClick = async () => {
    toast({
      title: "Nuevo Investigador",
      description: `Se ha creado el investigador exitosamente`,
      status: "success",
      isClosable: true,
      duration: 4000,
    });
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => createPersona(formData),
    onSuccess: () => {
      toast({
        title: "Nuevo investigador",
        description: `Se ha creado el nuevo investigador exitosamente`,
        status: "success",
        isClosable: true,
      });
      // navigate(`/investigadores/5`);
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
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      proyecto: {
        tipoActividad: "",
        fechaInicio: "",
        fechaFin: "",
        denominacion: "",
        completo: false,
        regional: "",
        convocatoria: "",
        estado: "",
        idDirector: undefined,
        idCodirector: undefined,
      },
      pid: {
        tipoProyecto: "",
        prorrogado: false,
        codPid: "",
        programa: "",
        disposicion: "",
      }
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: 'pruebas', // Nombre del campo de formulario que es un arreglo
  });

  const onSubmit = (dataForm, event) => {
    console.log(dataForm);
    event.preventDefault();
    mutate(dataForm);
  };

  const onChangeRadioProrroga = (value) => {
    if (value === "true") {
      setValue("pid.prorrogado", true);
    } else {
      setValue("pid.prorrogado", false);
    }
  };

  return (
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
            Nuevo PID
          </Heading>

          <br />
          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Ingrese los datos del proyecto de investigación y desarrollo</Text>
              <br />
              {/* <form onSubmit={handleSubmit((values) => mutate(values))}> */}
              <form onSubmit={handleSubmit((values) => console.log(values))}>
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                        <Input name="apellido" placeholder="Código PID" {...register('pid.codPid')} />
                        <FormLabel>Código PID</FormLabel>
                      </FormControl>

                      <FormControl variant="floating" width={{ base: '100%', md: '65%' }} mb='5vh'>
                        <Input name="regional" placeholder="Regional" {...register('proyecto.regional')} />
                        <FormLabel>Regional</FormLabel>
                      </FormControl>
                    </Box>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      <FormControl variant="floating" width={{ base: '100%', md: '100%' }} mb='5vh'>
                        <Textarea placeholder='Denominación' style={{ resize: 'none' }} {...register('proyecto.denominacion')} />
                        <FormLabel>Denominación</FormLabel>
                      </FormControl>
                    </Box>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                        <Select
                          placeholder="Director..."
                          {...register("proyecto.idDirector", {
                            valueAsNumber: true,
                          })}
                        >
                          {dataInvestigadores?.personas.map((investigador, key) => (
                            <option
                              key={key}
                              value={investigador.idPersona}
                            >
                              {investigador.apellido} {investigador.nombre}
                            </option>
                          ))}
                        </Select>
                        <FormLabel>Director</FormLabel>
                      </FormControl>

                      <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                        {/* <Input name="codirector" placeholder="Codirector" {...register('proyecto.idCodirector')} /> */}

                        <Select
                          placeholder="Codirector..."
                          {...register("proyecto.idCodirector", {
                            valueAsNumber: true,
                          })}
                        >
                          {dataInvestigadores?.personas.map((investigador, key) => (
                            <option
                              key={key}
                              value={investigador.idPersona}
                            >
                              {investigador.apellido} {investigador.nombre}
                            </option>
                          ))}
                        </Select>
                        <FormLabel>Codirector</FormLabel>
                      </FormControl>
                    </Box>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      <FormControl variant="floating" id="fechaInicio" width={{ base: '100%', md: '30%' }} mb='5vh'>
                        <Input name="fechaInicio" type="date" placeholder="Fecha Inicio" {...register('proyecto.fechaInicio')} />
                        <FormLabel>Fecha Inicio</FormLabel>
                      </FormControl>

                      <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                        <Input name="fechaFin" type="date" placeholder="Fecha Fin" {...register('proyecto.fechaFin')} />
                        <FormLabel>Fecha Fin</FormLabel>
                      </FormControl>

                      <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                        <Input type='number' name="convocatoria" placeholder="Convocatoria" {...register('proyecto.convocatoria', {valueAsNumber: true,})} />
                        <FormLabel>Convocatoria</FormLabel>
                      </FormControl>
                    </Box>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                        <Input name="programa" placeholder="Programa" {...register('pid.programa')} />
                        <FormLabel>Programa</FormLabel>
                      </FormControl>

                      <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                        <Input placeholder="Tipo de proyecto" {...register('pid.tipoProyecto')} />
                        <FormLabel>Tipo de proyecto</FormLabel>
                      </FormControl>
                    </Box>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                        <Input name="actividad" placeholder="Actividad" {...register('proyecto.tipoActividad')} />
                        <FormLabel>Tipo Actividad</FormLabel>
                      </FormControl>

                      <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                        <Input name="estado" placeholder="Estado" {...register('proyecto.estado')} />
                        <FormLabel>Estado</FormLabel>
                      </FormControl>

                      <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                        <Input name="disposicion" placeholder="Disposición" {...register('pid.disposicion')} />
                        <FormLabel>Disposición</FormLabel>
                      </FormControl>
                    </Box>
                    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                      {/* <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                        <Input name="prorroga" placeholder="Prorroga" {...register('pid.prorrogado')} />
                        <FormLabel>Prorroga</FormLabel>
                      </FormControl> */}
                      <Box width={{ base: '100%', md: '50%' }} display='flex' justifyContent='center'>
                        <VStack>
                          <Text mb="1vh">Prorroga: </Text>
                          <RadioGroup
                            onChange={onChangeRadioProrroga}
                            // value={valueCategoria}
                            mb="5vh"
                            defaultValue="false"
                          >
                            <Stack
                              direction="row"
                              spacing={10}
                            >
                              <Radio value='true'>
                                Si
                              </Radio>
                              <Radio value='false'>
                                No
                              </Radio>
                            </Stack>
                          </RadioGroup>
                        </VStack>

                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box> {/* EJEMPLO DE USO DEL ARRAY EN FORMULARIOS */}

                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <input
                        {...register(`pruebas[${index}].prueba`)}
                        defaultValue={field.prueba}
                      />
                      <button type="button" onClick={() => remove(index)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => append({})}>
                    Agregar Elemento
                  </button>

                </Box>

                <Box
                  display="flex"
                  width="90%"
                  alignItems="center"
                  justifyContent="flex-end"
                >
                  <Button
                    colorScheme="gray"
                    variant="outline"
                    onClick={onClick}
                    mr="3%"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" colorScheme="blue" variant="outline">
                    Guardar
                  </Button>
                </Box>
              </form>
            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card >
  );
}
