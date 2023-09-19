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
import {
  formatoFechaISOaAAAAMMDD,
  formatoFechaISOaDDMMAAAA,
} from "../../utils/general";

const ITEMS_PER_PAGE = 2; // Define el número de elementos por página

export default function NuevoPid() {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isLoadingGetGrupos,
    error,
  } = useQuery("grupos", () => getAllGrupos());

  const [grupoAdd, setGrupoAdd] = useState()

  const { data: dataInvestigadores } = useQuery(["investigadoresPID"], () =>
    getAllPersonas()
  );

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
    getValues,
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
      },
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "pruebas", // Nombre del campo de formulario que es un arreglo
  });

  const { fields: fieldsGrupos, append: appendG, remove: removeG, update: updateG } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "grupos", // Nombre del campo de formulario que es un arreglo
  });

  const agregarGrupoForm = () => {

    appendG(grupoAdd)
  }

  const gg = getValues('grupos');

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

  //Aca se agrega lo de la tabla de investigadores
  const [selectedOptions, setSelectedOptions] = useState();
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
  };

  const handleSelectPage = (event) => {
    if (parseInt(event.target.value, 10) > totalPages) {
      handlePageChange(0);
    } else {
      if (parseInt(event.target.value, 10) !== "") {
        const selectedPage = parseInt(event.target.value, 10);
        setCurrentPage(selectedPage - 1);
      } else {
        handlePageChange(0);
      }
    }
  };

  const { data: dataPersonas } = useQuery("personas", () => getAllPersonas());
  const [investigadores, setInvestigadores] = useState(
    dataPersonas?.personas || []
  );

  const roles = ["Investigador", "Becario"];

  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] =
    useState([]);

  const totalPages = Math.ceil(
    investigadoresSeleccionados.length || 1 / ITEMS_PER_PAGE
  );

  const sortedInvestigadores = [...investigadores]?.sort((a, b) => {
    const apellidoA = a.apellido.toLowerCase();
    const apellidoB = b.apellido.toLowerCase();
    return apellidoA.localeCompare(apellidoB);
  });

  const agregarInvestigador = () => {
    console.log(sortedInvestigadores);
    console.log(selectedOptions);
    const objetoBuscado = sortedInvestigadores.find(
      (item) => item.idPersona == selectedOptions
    );

    const objetoAgregar = {
      idPersona: objetoBuscado.idPersona,
      rol: "",
    };

    // Verificar si el objeto ya está en investigadoresSeleccionados antes de agregarlo
    const objetoYaAgregado = investigadoresSeleccionados.find(
      (item) => item.idPersona == selectedOptions
    );

    if (!objetoYaAgregado) {
      append(objetoAgregar);
      setInvestigadoresSeleccionados([
        ...investigadoresSeleccionados,
        objetoBuscado,
      ]);
    }
  };

  const eliminarInvestigador = (idAEliminar, index) => {
    // Filtrar los investigadores y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosInvestigadores = investigadoresSeleccionados.filter(
      (item) => item.idPersona !== idAEliminar
    );

    remove(index)

    // Actualizar investigadoresSeleccionados con el nuevo arreglo
    setInvestigadoresSeleccionados(nuevosInvestigadores);
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
              <Text fontSize="md">
                Ingrese los datos del proyecto de investigación y desarrollo
              </Text>
              <br />
              {/* <form onSubmit={handleSubmit((values) => mutate(values))}> */}
              <form onSubmit={handleSubmit((values) => console.log(values))}>
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box
                    display="flex"
                    width="70%"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                  >
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      >
                        <Input
                          name="apellido"
                          placeholder="Código PID"
                          {...register("pid.codPid")}
                        />
                        <FormLabel>Código PID</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "65%" }}
                        mb="5vh"
                      >
                        <Input
                          name="regional"
                          placeholder="Regional"
                          {...register("proyecto.regional")}
                        />
                        <FormLabel>Regional</FormLabel>
                      </FormControl>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "100%" }}
                        mb="5vh"
                      >
                        <Textarea
                          placeholder="Denominación"
                          style={{ resize: "none" }}
                          {...register("proyecto.denominacion")}
                        />
                        <FormLabel>Denominación</FormLabel>
                      </FormControl>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Select
                          placeholder="Director..."
                          {...register("proyecto.idDirector", {
                            valueAsNumber: true,
                          })}
                        >
                          {dataInvestigadores?.personas.map(
                            (investigador, key) => (
                              <option key={key} value={investigador.idPersona}>
                                {investigador.apellido} {investigador.nombre}
                              </option>
                            )
                          )}
                        </Select>
                        <FormLabel>Director</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        {/* <Input name="codirector" placeholder="Codirector" {...register('proyecto.idCodirector')} /> */}

                        <Select
                          placeholder="Codirector..."
                          {...register("proyecto.idCodirector", {
                            valueAsNumber: true,
                          })}
                        >
                          {dataInvestigadores?.personas.map(
                            (investigador, key) => (
                              <option key={key} value={investigador.idPersona}>
                                {investigador.apellido} {investigador.nombre}
                              </option>
                            )
                          )}
                        </Select>
                        <FormLabel>Codirector</FormLabel>
                      </FormControl>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControl
                        variant="floating"
                        id="fechaInicio"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      >
                        <Input
                          name="fechaInicio"
                          type="date"
                          placeholder="Fecha Inicio"
                          {...register("proyecto.fechaInicio")}
                        />
                        <FormLabel>Fecha Inicio</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      >
                        <Input
                          name="fechaFin"
                          type="date"
                          placeholder="Fecha Fin"
                          {...register("proyecto.fechaFin")}
                        />
                        <FormLabel>Fecha Fin</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      >
                        <Input
                          type="number"
                          name="convocatoria"
                          placeholder="Convocatoria"
                          {...register("proyecto.convocatoria", {
                            valueAsNumber: true,
                          })}
                        />
                        <FormLabel>Convocatoria</FormLabel>
                      </FormControl>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Input
                          name="programa"
                          placeholder="Programa"
                          {...register("pid.programa")}
                        />
                        <FormLabel>Programa</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Input
                          placeholder="Tipo de proyecto"
                          {...register("pid.tipoProyecto")}
                        />
                        <FormLabel>Tipo de proyecto</FormLabel>
                      </FormControl>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      >
                        <Input
                          name="actividad"
                          placeholder="Actividad"
                          {...register("proyecto.tipoActividad")}
                        />
                        <FormLabel>Tipo Actividad</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      >
                        <Input
                          name="estado"
                          placeholder="Estado"
                          {...register("proyecto.estado")}
                        />
                        <FormLabel>Estado</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      >
                        <Input
                          name="disposicion"
                          placeholder="Disposición"
                          {...register("pid.disposicion")}
                        />
                        <FormLabel>Disposición</FormLabel>
                      </FormControl>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {/* <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                        <Input name="prorroga" placeholder="Prorroga" {...register('pid.prorrogado')} />
                        <FormLabel>Prorroga</FormLabel>
                      </FormControl> */}
                      <Box
                        width={{ base: "100%", md: "50%" }}
                        display="flex"
                        justifyContent="center"
                      >
                        <VStack>
                          <Text mb="1vh">Prorroga: </Text>
                          <RadioGroup
                            onChange={onChangeRadioProrroga}
                            // value={valueCategoria}
                            mb="5vh"
                            defaultValue="false"
                          >
                            <Stack direction="row" spacing={10}>
                              <Radio value="true">Si</Radio>
                              <Radio value="false">No</Radio>
                            </Stack>
                          </RadioGroup>
                        </VStack>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  {" "}
                  {/* EJEMPLO DE USO DEL ARRAY EN FORMULARIOS */}
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
        {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
        <br />
        <br />
        <Card width="100%">
          <CardBody>
            <Text fontSize="md">
              Agregar los investigadores al proyecto
            </Text>
            <br />
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <br />
              <Box display="flex" width="100%">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="45%"
                  marginLeft="2%"
                >
                  <Select
                    placeholder="Integrantes"
                    isSearchable={true}
                    onChange={(e) => {
                      setSelectedOptions(e.target.value);
                    }}
                  >
                    {sortedInvestigadores.map((item, index) => (
                      <option key={item.idPersona} value={item.idPersona}>
                        {item.apellido + ", " + item.nombre}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box display="flex" justifyContent="flex-end" width="55%">
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    mr="5"
                    onClick={agregarInvestigador}
                  >
                    Agregar
                  </Button>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    mr="5"
                    onClick={() => {
                      console.log(investigadoresSeleccionados);
                    }}
                  >
                    Prueba
                  </Button>
                </Box>
              </Box>
              <br />
              <form style={{ width: '100%' }} onSubmit={handleSubmit((values) => console.log(values))}>
                <Card width="100%">
                  <CardBody>
                    <TableContainer>
                      <Table
                        size="sm"
                        variant="striped"
                        colorScheme="blackAlpha"
                      >
                        <Thead>
                          <Tr>
                            <Th textAlign="center">
                              <Text fontSize="md">Apellido y Nombre</Text>
                            </Th>
                            <Th textAlign="center">
                              <Text fontSize="md">Grupo</Text>
                            </Th>
                            <Th textAlign="center">
                              <Text fontSize="md">Rol</Text>
                            </Th>
                            <Th textAlign="center">
                              <Text fontSize="md">Eliminar</Text>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {investigadoresSeleccionados?.map((item, index) => {
                              return (
                                <Tr key={index}>
                                  <Td textAlign="center">
                                    <Text
                                      fontSize="md"
                                      {...register(
                                        `pruebas[${index}].idPersona`,
                                        { value: item.idPersona }
                                      )}
                                    >
                                      {item.apellido + ", " + item.nombre}
                                    </Text>
                                  </Td>
                                  <Td textAlign="center">
                                    <Text fontSize="md">
                                      {item.gruposinvestigacion.siglas}
                                    </Text>
                                  </Td>
                                  <Td textAlign="center">
                                    <Select
                                      placeholder="Rol"
                                      onChange={(e) => {
                                        update(index, { rol: e.target.value })
                                      }}
                                    >
                                      {roles.map((role, roleIndex) => (
                                        <option key={roleIndex} value={role}>
                                          {role}
                                        </option>
                                      ))}
                                    </Select>
                                  </Td>
                                  <Td textAlign="center">
                                    <DeleteIcon
                                      cursor={"pointer"}
                                      onClick={() => { eliminarInvestigador(item.idPersona, index) }
                                      }
                                    />
                                  </Td>
                                </Tr>
                              );
                            })}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
                <Button type="submit" colorScheme="blue" variant="outline">
                  Guardar
                </Button>
              </form>
            </Box>
          </CardBody>
        </Card>

        {/* Grupos al form*/}
        <br />
        <Card width="100%">
          <CardBody>
            <Text fontSize="md">
              Agregar los grupos involucrados
            </Text>
            <br />
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <br />
              <Box display="flex" width="100%">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="45%"
                  marginLeft="2%"
                >
                  <Select
                    placeholder="Integrantes"
                    isSearchable={true}
                    onChange={(e) => {
                      setGrupoAdd(e.target.value);
                      console.log(e.target.value)
                    }}
                  >
                    {data?.grupos.map((item, index) => (
                      <option key={item.idGrupoInvestigacion} value={item.siglas}>
                        {item.siglas}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box display="flex" justifyContent="flex-end" width="55%">
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    mr="5"
                    onClick={() => agregarGrupoForm()}
                  >
                    Agregar
                  </Button>
                  <Button
                    colorScheme="blue"
                    variant="outline"
                    mr="5"
                    onClick={() => {
                      console.log(investigadoresSeleccionados);
                    }}
                  >
                    Prueba
                  </Button>
                </Box>
              </Box>
              <br />
              <form onSubmit={handleSubmit((values) => console.log(values))}>
                <Card width="100%">
                  <CardBody>
                    <TableContainer>
                      <Table
                        size="sm"
                        variant="striped"
                        colorScheme="blackAlpha"
                      >
                        <Thead>
                          <Tr>
                            <Th textAlign="center">
                              <Text fontSize="md">Grupo</Text>
                            </Th>
                            <Th textAlign="center">
                              <Text fontSize="md">Eliminar</Text>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {fieldsGrupos?.map((item, index) => {
                            // console.log(item)
                            return (
                              <Tr key={index}>
                                {/* <Td textAlign="center">
                                    <Text
                                      fontSize="md"
                                      {...register(
                                        `grupos[${index}].idGrupoInvestigacion`,
                                        { value: item.idGrupoInvestigacion }
                                      )}
                                    >
                                      {item.siglas}
                                    </Text>
                                  </Td> */}
                                <Td textAlign="center">
                                  <Text fontSize="md">
                                    {Object.keys(item).reduce((acc, key) => {
                                      if (key !== 'id') {
                                        return acc + item[key];
                                      }
                                      return acc;
                                    }, '')}
                                  </Text>
                                </Td>
                                {/* <Td textAlign="center">
                                    <Select
                                      placeholder="Rol"
                                      onChange={(e) => {
                                        update(index, {rol:e.target.value})
                                      }}
                                    >
                                      {roles.map((role, roleIndex) => (
                                        <option key={roleIndex} value={role}>
                                          {role}
                                        </option>
                                      ))}
                                    </Select>
                                  </Td> */}
                                <Td textAlign="center">
                                  <DeleteIcon
                                    cursor={"pointer"}
                                    onClick={() => { removeG(index) }
                                    }
                                  />
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                      <HStack spacing={4} mt={4} justify="center">
                        <IconButton
                          isDisabled={currentPage === 0}
                          icon={<ChevronLeftIcon />}
                          onClick={() => {
                            handlePageChange(currentPage - 1);
                          }}
                        />

                        <Input
                          type="number"
                          value={currentPage + 1}
                          onChange={handleSelectPage}
                          style={{ width: "50px", textAlign: "center" }}
                        />

                        <Text>de {totalPages}</Text>

                        <IconButton
                          isDisabled={
                            currentPage ===
                            Math.ceil(investigadores?.length / ITEMS_PER_PAGE) -
                            1
                          }
                          icon={<ChevronRightIcon />}
                          onClick={() => {
                            handlePageChange(currentPage + 1);
                          }}
                        />
                      </HStack>
                    </TableContainer>
                  </CardBody>
                </Card>
                <Button type="submit" colorScheme="blue" variant="outline">
                  Guardar
                </Button>
              </form>
              <br />
            </Box>
          </CardBody>
        </Card>

      </CardBody>
    </Card>
  );
}
