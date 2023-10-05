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
  TableContainer,
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import {
  DeleteIcon,
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
import { createProyectoPID } from "../../utils/api/proyectosApi";
import CustomModal from "../../components/CustomModal";

const regionales = [
  "Facultad Regional Avellaneda",
  "Facultad Regional Bahía Blanca",
  "Facultad Regional Buenos Aires",
  "Facultad Regional Chubut",
  "Facultad Regional Concepción del Uruguay",
  "Facultad Regional Concordia",
  "Facultad Regional Córdoba",
  "Facultad Regional Delta",
  "Facultad Regional General Pacheco",
  "Facultad Regional Haedo",
  "Facultad Regional La Plata",
  "Facultad Regional La Rioja",
  "Facultad Regional Mar del Plata",
  "Facultad Regional Mendoza",
  "Facultad Regional Neuquen",
  "Facultad Regional Paraná",
  "Facultad Regional Rafaela",
  "Facultad Regional Reconquista",
  "Facultad Regional Resistencia",
  "Facultad Regional Rosario",
  "Facultad Regional San Francisco",
  "Facultad Regional San Nicolás",
  "Facultad Regional San Rafael",
  "Facultad Regional Santa Cruz",
  "Facultad Regional Santa Fe",
  "Facultad Regional Tierra del Fuego",
  "Facultad Regional Trenque Lauquen",
  "Facultad Regional Tucumán",
  "Facultad Regional Venado Tuerto",
  "Facultad Regional Villa María",
  "Rectorado",
  "Instituto Nacional Superior de Profesorado Técnico",
  "Centro Tecnológico De Desarrollo Regional Los Reyunos"
]

const tipoActividad = ["Desarrollo Experimental", "Investigación Aplicada", "Investigación Básica"]

const tipoProyecto = [
  "UTN (PID UTN) CON INCORPORACION EN PROGRAMA INCENTIVOS",
  "UTN (PID UTN) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
  "INTER-FACULTAD (PID IF) SIN INCORPORACION EN  PROGRAMA INCENTIVOS",
  "INTER-FACULTAD (PID IF) CON INCORPORACION EN  PROGRAMA INCENTIVOS",
  "INTER-INSTITUCIONAL (PIC IN) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
  "INTER-INSTITUCIONAL (PID IN) CON INCORPORACION EN PROGRAMA INCENTIVOS",
  "FACULTAD (PID FA) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
  "FACULTAD (PID FA) CON INCORPORACION EN PROGRAMA INCENTIVOS",
  "INTEGRADOR ASOCIADO (PID IA) CON INCORPORACION EN PROGRAMA INCENTIVOS",
  "INTEGRADOR ASOCIADO (PID IA) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
  "INTEGRADOR PRINCIPAL (PID IP) CON INCORPORACION EN PROGRAMA INCENTIVOS",
  "INTEGRADOR PRINCIPAL (PID IP) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
  "OTROS (PID OT) CON INCORPORACION EN PROGRAMA INCENTIVOS",
  "OTROS (PID OT) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
  "TUTORADO CON INCENTIVO",
  "TUTORADO SIN INCENTIVO",
  "PID INICIACION A INVESTIGACION PRIMER PROYECTO TIPO A",
  "PID INICIACION A INVESTIGACION PRIMER PROYECTO TIPO B",
  "PID INICIACION A INVESTIGACION PRIMER PROYECTO",
  "PID EQUIPOS CONSOLIDADOS CON INCENTIVOS TIPO A",
  "PID EQUIPOS CONSOLIDADOS CON INCENTIVOS TIPO B",
  "PID EQUIPOS CONSOLIDADOS CON INCENTIVOS",
  "PID EQUIPOS CONSOLIDADOS SIN INCENTIVOS",
  "PID EQUIPOS EN CONSOLIDACIÓN CON INCENTIVOS TIPO A",
  "PID EQUIPOS EN CONSOLIDACIÓN CON INCENTIVOS TIPO B",
  "PID EQUIPOS EN CONSOLIDACIÓN CON INCENTIVOS",
  "PID EQUIPOS EN CONSOLIDACIÓN SIN INCENTIVOS",
  "PID TECNOLOGIA EDUCATIVA MULTI-FACULTAD CON INCENTIVOS TIPO A",
  "PID TECNOLOGIA EDUCATIVA MULTI-FACULTAD CON INCENTIVOS TIPO B",
  "PID TECNOLOGIA EDUCATIVA MULTI-FACULTAD SIN INCENTIVOS"
]

const estadoProyecto = [
  "EN TRÁMITE",
  "HOMOLOGADO",
  "REFORMULAR POR EVALUACIÓN EXTERNA",
  "REFORMULAR POR CONSEJO DE PROGRAMAS",
  "DENEGADO POR EVALUACIÓN EXTERNA",
  "DENEGADO POR CONSEJO DE PROGRAMAS",
  "CANCELADO",
]


const roles = ["Investigador", "Becario", "Asesor Cientifico", "Técnico de Apoyo", "CoDirector"];

export default function NuevoPid() {
    /* Usestate para el modal */
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
      setIsOpen(true);
    };
  
    const closeModal = () => {
      setIsOpen(false);
    };

  const toast = useToast();
  const navigate = useNavigate();

  const {
    data,
    isLoading: isLoadingGetGrupos,
    error,
  } = useQuery("grupos", () => getAllGrupos());

  const grupos = data?.grupos;

  const [investigadores, setInvestigadores] = useState([])

  const { data: dataInvestigadores } = useQuery(["investigadoresNewPID"], () =>
    getAllPersonas()
  );

  useEffect(() => {
    setInvestigadores(dataInvestigadores?.personas)
  }, [dataInvestigadores])

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => createProyectoPID(formData),
    onSuccess: () => {
      toast({
        title: "Nuevo Proyecto",
        description: `Se ha creado el nuevo proyecto exitosamente`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: (error) => {
      const errorMessage = error?.message
      toast({
        title: "Error al crear el proyecto",
        description: `${errorMessage || 'Intente nuevamente'}`,
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
        regional: "Facultad Regional Resistencia",
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
    name: "investigadores", // Nombre del campo de formulario que es un arreglo
  });

  const { fields: fieldsGrupos, append: appendG, remove: removeG, update: updateG } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "grupos", // Nombre del campo de formulario que es un arreglo
  });

  const onChangeRadioProrroga = (value) => {
    if (value === "true") {
      setValue("pid.prorrogado", true);
    } else {
      setValue("pid.prorrogado", false);
    }
  };

  //Aca se agrega lo de la tabla de investigadores
  const [selectedOptions, setSelectedOptions] = useState();
  const [selectedOptionsGrupos, setSelectedOptionsGrupos] = useState();

  // const { data: dataPersonas } = useQuery("personas", () => getAllPersonas());
  // const [investigadores, setInvestigadores] = useState(
  //   dataPersonas?.personas || []
  // );

  const [gruposSeleccionados, setGruposSeleccionados] =
    useState([]);
  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] =
    useState([]);

  const sortedInvestigadores = investigadores?.sort((a, b) => {
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

  const agregarGrupo = () => {
    // console.log(sortedInvestigadores);
    console.log(selectedOptionsGrupos);
    const objetoBuscado = grupos.find(
      (item) => item.idGrupoInvestigacion == selectedOptionsGrupos
    );

    const objetoAgregar = {
      idGrupoInvestigacion: objetoBuscado.idGrupoInvestigacion,
    };

    // Verificar si el objeto ya está en gruposSeleccionados antes de agregarlo
    const objetoYaAgregado = gruposSeleccionados.find(
      (item) => item.idGrupoInvestigacion == selectedOptionsGrupos
    );

    if (!objetoYaAgregado) {
      appendG(objetoAgregar);
      setGruposSeleccionados([
        ...gruposSeleccionados,
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

  const eliminarGrupo = (idAEliminar, index) => {
    // Filtrar los grupos y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosGrupos = gruposSeleccionados.filter(
      (item) => item.idGrupoInvestigacion !== idAEliminar
    );

    removeG(index)

    // Actualizar investigadoresSeleccionados con el nuevo arreglo
    setGruposSeleccionados(nuevosGrupos);
  };

  const onSub = (values) => {
    console.log(values);
    mutate(values);
  };

  return (
    <Card>
      <CardBody>
        <form style={{ width: '100%' }} onSubmit={handleSubmit((values) => onSub(values))}>
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
            <Card width="100%">
              <CardBody>
                <Text fontSize="md">
                  Ingrese los datos del proyecto de investigación y desarrollo
                </Text>
                <br />
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
                        <Select
                          placeholder="Regional..."
                          {...register("proyecto.regional")}
                        >
                          {regionales.map(
                            (regional, key) => (
                              <option key={key} value={regional}>
                                {regional}
                              </option>
                            )
                          )}
                        </Select>
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
                          {investigadores?.map(
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
                        <Select
                          placeholder="Codirector..."
                          {...register("proyecto.idCodirector", {
                            valueAsNumber: true,
                          })}
                        >
                          {investigadores?.map(
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
                        <Select
                          placeholder="Tipo de proyecto..."
                          {...register("pid.tipoProyecto")}
                        >
                          {tipoProyecto.map(
                            (tipo, key) => (
                              <option key={key} value={tipo}>
                                {tipo}
                              </option>
                            )
                          )}
                        </Select>
                        <FormLabel>Tipo de proyecsto</FormLabel>
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
                        <Select
                          placeholder="Tipo de actividad..."
                          {...register("proyecto.tipoActividad")}
                        >
                          {tipoActividad.map(
                            (actividad, key) => (
                              <option key={key} value={actividad}>
                                {actividad}
                              </option>
                            )
                          )}
                        </Select>
                        <FormLabel>Tipo de actividad</FormLabel>
                      </FormControl>

                      {/* <FormControl
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
                      </FormControl> */}
                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      >
                        <Select
                          placeholder="Estado..."
                          {...register("proyecto.estado")}
                        >
                          {estadoProyecto.map(
                            (estado, key) => (
                              <option key={key} value={estado}>
                                {estado}
                              </option>
                            )
                          )}
                        </Select>
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
              </CardBody>
            </Card>
          </Box>

          {/* ACA SE AGREGA LA TABLA DE GRUPOS */}
          <br />
          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">
                Agregar los grupos asociados al proyecto
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
                      placeholder="Grupos..."
                      isSearchable={true}
                      onChange={(e) => {
                        setSelectedOptionsGrupos(e.target.value);
                      }}
                    >
                      {grupos?.map((item, index) => (
                        <option key={item.idGrupoInvestigacion} value={item.idGrupoInvestigacion}>
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
                      onClick={agregarGrupo}
                    >
                      Agregar
                    </Button>
                  </Box>
                </Box>
                <br />
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
                          {gruposSeleccionados?.map((item, index) => {
                            return (
                              <Tr key={index}>
                                <Td textAlign="center">
                                  <Text
                                    fontSize="md"
                                    {...register(
                                      `grupos[${index}].idGrupoInvestigacion`,
                                      { value: item.idGrupoInvestigacion }
                                    )}
                                  >
                                    {item.siglas}
                                  </Text>
                                </Td>
                                {/* <Td textAlign="center">
                                    <Text fontSize="md">
                                      {item.gruposinvestigacion.siglas}
                                    </Text>
                                  </Td> */}
                                <Td textAlign="center">
                                  <DeleteIcon
                                    cursor={"pointer"}
                                    onClick={() => { eliminarGrupo(item.idGrupoInvestigacion, index) }
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
              </Box>
            </CardBody>
          </Card>

          {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
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
                      {sortedInvestigadores?.map((item, index) => (
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
                  </Box>
                </Box>
                <br />

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
                                      `investigadores[${index}].idPersona`,
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


              </Box>
              <br />
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                // justifyContent="flex-end"
                justifyContent="center"
              >
                <Button
                  colorScheme="gray"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  mr="5%"
                >
                  Cancelar
                </Button>
                <Button onClick={openModal} colorScheme="blue" variant="outline" ml="5%">
                  Guardar
                </Button>
                <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title="Guardar nuevo PID"
                      content="Se guardara el nuevo PID"
                      onSave={handleSubmit((values) => mutate(values))}
                    />
              </Box>
            </CardBody>
          </Card>
        </form>
      </CardBody>
    </Card>
  );
}
