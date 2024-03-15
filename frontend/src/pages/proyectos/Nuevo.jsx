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
import { DeleteIcon } from "@chakra-ui/icons";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from "../../utils/data/ListaCategorias.json";
import { Link, useNavigate, useParams } from "react-router-dom";
import proyectosInv from "../../utils/data/proyectosInv.json";
import { useQuery, useMutation } from "react-query";
import { createGrupo, getAllGrupos } from "../../utils/api/gruposApi";
import { useFieldArray, useForm } from "react-hook-form";
import { createPersona, getAllPersonas } from "../../utils/api/personasApi";
import { createProyecto } from "../../utils/api/proyectosApi";
import CustomModal from "../../components/CustomModal";
import { getAllRegionales } from "../../utils/api/regionalesApi";
import { getAllTiposProyectos } from "../../utils/api/tiposProyectosApi";

const tipoActividad = [
  "Desarrollo Experimental",
  "Investigación Aplicada",
  "Investigación Básica",
];

// const tipoProyecto = [
//   "UTN (PID UTN) CON INCORPORACION EN PROGRAMA INCENTIVOS",
//   "UTN (PID UTN) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
//   "INTER-FACULTAD (PID IF) SIN INCORPORACION EN  PROGRAMA INCENTIVOS",
//   "INTER-FACULTAD (PID IF) CON INCORPORACION EN  PROGRAMA INCENTIVOS",
//   "INTER-INSTITUCIONAL (PIC IN) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
//   "INTER-INSTITUCIONAL (PID IN) CON INCORPORACION EN PROGRAMA INCENTIVOS",
//   "FACULTAD (PID FA) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
//   "FACULTAD (PID FA) CON INCORPORACION EN PROGRAMA INCENTIVOS",
//   "INTEGRADOR ASOCIADO (PID IA) CON INCORPORACION EN PROGRAMA INCENTIVOS",
//   "INTEGRADOR ASOCIADO (PID IA) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
//   "INTEGRADOR PRINCIPAL (PID IP) CON INCORPORACION EN PROGRAMA INCENTIVOS",
//   "INTEGRADOR PRINCIPAL (PID IP) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
//   "OTROS (PID OT) CON INCORPORACION EN PROGRAMA INCENTIVOS",
//   "OTROS (PID OT) SIN INCORPORACION EN PROGRAMA INCENTIVOS",
//   "TUTORADO CON INCENTIVO",
//   "TUTORADO SIN INCENTIVO",
//   "PID INICIACION A INVESTIGACION PRIMER PROYECTO TIPO A",
//   "PID INICIACION A INVESTIGACION PRIMER PROYECTO TIPO B",
//   "PID INICIACION A INVESTIGACION PRIMER PROYECTO",
//   "PID EQUIPOS CONSOLIDADOS CON INCENTIVOS TIPO A",
//   "PID EQUIPOS CONSOLIDADOS CON INCENTIVOS TIPO B",
//   "PID EQUIPOS CONSOLIDADOS CON INCENTIVOS",
//   "PID EQUIPOS CONSOLIDADOS SIN INCENTIVOS",
//   "PID EQUIPOS EN CONSOLIDACIÓN CON INCENTIVOS TIPO A",
//   "PID EQUIPOS EN CONSOLIDACIÓN CON INCENTIVOS TIPO B",
//   "PID EQUIPOS EN CONSOLIDACIÓN CON INCENTIVOS",
//   "PID EQUIPOS EN CONSOLIDACIÓN SIN INCENTIVOS",
//   "PID TECNOLOGIA EDUCATIVA MULTI-FACULTAD CON INCENTIVOS TIPO A",
//   "PID TECNOLOGIA EDUCATIVA MULTI-FACULTAD CON INCENTIVOS TIPO B",
//   "PID TECNOLOGIA EDUCATIVA MULTI-FACULTAD SIN INCENTIVOS",
// ];

const estadoProyecto = [
  "EN TRÁMITE",
  "HOMOLOGADO",
  "REFORMULAR POR EVALUACIÓN EXTERNA",
  "REFORMULAR POR CONSEJO DE PROGRAMAS",
  "DENEGADO POR EVALUACIÓN EXTERNA",
  "DENEGADO POR CONSEJO DE PROGRAMAS",
  "CANCELADO",
];

const roles = [
  "Director",
  "CoDirector",
  "Investigador",
  "Becario",
  "Asesor Cientifico",
  "Técnico de Apoyo"
];

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

  const {
    data: dataRegionales,
    isLoading: isLoadingGetRegionales,
    error: errorRegionales,
  } = useQuery(["regionales",], () => getAllRegionales());

  const {
    data: dataTiposProyectos,
    isLoading: isLoadingGetTiposProyectos,
    error: errorTiposProyectos,
  } = useQuery(["tiposProyectos",], () => getAllTiposProyectos());

  const grupos = data?.grupos;

  const [investigadores, setInvestigadores] = useState([]);

  const { data: dataInvestigadores } = useQuery(["investigadoresNewPID"], () =>
    getAllPersonas()
  );

  useEffect(() => {
    setInvestigadores(dataInvestigadores?.personas);
  }, [dataInvestigadores]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => createProyecto(formData),
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
      const errorMessage = error?.message;
      toast({
        title: "Error al crear el proyecto",
        description: `${errorMessage || "Intente nuevamente"}`,
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
      tipoProyecto: "",
      prorrogado: false,
      codPid: "",
      programa: "",
      disposicion: "",
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "investigadores", // Nombre del campo de formulario que es un arreglo
  });

  const {
    fields: fieldsGrupos,
    append: appendG,
    remove: removeG,
    update: updateG,
  } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "grupos", // Nombre del campo de formulario que es un arreglo
  });

  const onChangeRadioProrroga = (value) => {
    if (value === "true") {
      setValue("prorrogado", true);
    } else {
      setValue("prorrogado", false);
    }
  };

  //Aca se agrega lo de la tabla de investigadores
  const [selectedOptions, setSelectedOptions] = useState();
  const [selectedOptionsGrupos, setSelectedOptionsGrupos] = useState();

  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] =
    useState([]);
  const [investigadoresDelGrupo, setInvestigadoresDelGrupo] = useState([]);

  const sortedInvestigadores = investigadoresDelGrupo?.sort((a, b) => {
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
      setGruposSeleccionados([...gruposSeleccionados, objetoBuscado]);
      const investigadoresGrupo = investigadores.filter(
        (investigador) =>
          investigador.idGrupoInvestigacion ===
          objetoBuscado.idGrupoInvestigacion
      );

      // Actualizar la lista de investigadores seleccionados
      setInvestigadoresDelGrupo([
        ...investigadoresDelGrupo,
        ...investigadoresGrupo,
      ]);

      console.log(investigadoresDelGrupo);
    }
  };

  const eliminarInvestigador = (idAEliminar, index) => {
    // Filtrar los investigadores y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosInvestigadores = investigadoresSeleccionados.filter(
      (item) => item.idPersona !== idAEliminar
    );

    remove(index);

    // Actualizar investigadoresSeleccionados con el nuevo arreglo
    setInvestigadoresSeleccionados(nuevosInvestigadores);
  };

  const eliminarGrupo = (idAEliminar, index) => {
    // Filtrar los grupos y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosGrupos = gruposSeleccionados.filter(
      (item) => item.idGrupoInvestigacion !== idAEliminar
    );

    // Filtrar los investigadores para mantener solo los que no pertenecen al grupo a eliminar
    const investigadoresRestantes = investigadoresDelGrupo.filter(
      (investigador) => investigador.idGrupoInvestigacion !== idAEliminar
    );

    removeG(index);

    // Actualizar investigadoresSeleccionados y gruposSeleccionados con los nuevos arreglos
    setInvestigadoresDelGrupo(investigadoresRestantes);
    console.log(investigadoresRestantes)
    setGruposSeleccionados(nuevosGrupos);
  };

  return (
    <Card>
      <CardBody>
        <form
          style={{ width: "100%" }}
          // onSubmit={handleSubmit((values) => onSub(values))}
        >
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
                          {...register("codPid")}
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
                          {...register("regional")}
                        >
                          {(isLoadingGetRegionales ? ['Cargando...'] : dataRegionales.regionales).map((regional, key) => (
                            <option key={key} value={regional}>
                              {regional}
                            </option>
                          ))}
                        </Select>
                        <FormLabel>Regional asociada</FormLabel>
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
                          {...register("denominacion")}
                        />
                        <FormLabel>Denominación</FormLabel>
                      </FormControl>
                    </Box>
                    {/* <Box
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
                          {...register("idDirector", {
                            valueAsNumber: true,
                          })}
                        >
                          {investigadores?.map((investigador, key) => (
                            <option key={key} value={investigador.idPersona}>
                              {investigador.apellido} {investigador.nombre}
                            </option>
                          ))}
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
                          {...register("idCodirector", {
                            valueAsNumber: true,
                          })}
                        >
                          {investigadores?.map((investigador, key) => (
                            <option key={key} value={investigador.idPersona}>
                              {investigador.apellido} {investigador.nombre}
                            </option>
                          ))}
                        </Select>
                        <FormLabel>Codirector</FormLabel>
                      </FormControl>
                    </Box> */}
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
                          {...register("fechaInicio")}
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
                          {...register("fechaFin")}
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
                          {...register("convocatoria", {
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
                          {...register("programa")}
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
                          {...register("tipoProyecto")}
                        >
                          {(isLoadingGetTiposProyectos ? ['Cargando...'] : dataTiposProyectos?.tiposProyectos).map((tipo, key) => (
                            <option key={key} value={tipo}>
                              {tipo}
                            </option>
                          ))}
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
                          {...register("tipoActividad")}
                        >
                          {tipoActividad.map((actividad, key) => (
                            <option key={key} value={actividad}>
                              {actividad}
                            </option>
                          ))}
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
                          {...register("estado")}
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
                          {...register("estado")}
                        >
                          {estadoProyecto.map((estado, key) => (
                            <option key={key} value={estado}>
                              {estado}
                            </option>
                          ))}
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
                          {...register("disposicion")}
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
                        <option
                          key={item.idGrupoInvestigacion}
                          value={item.idGrupoInvestigacion}
                        >
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
                                    onClick={() => {
                                      eliminarGrupo(
                                        item.idGrupoInvestigacion,
                                        index
                                      );
                                    }}
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
              <Text fontSize="md">Agregar los investigadores al proyecto</Text>
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
                                      update(index, { rol: e.target.value });
                                      if (e.target.value === 'CoDirector'){
                                        setValue("idCodirector", Number(item.idPersona))
                                      }
                                      if (e.target.value === 'Director'){
                                        setValue("idDirector", Number(item.idPersona))
                                      }
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
                                    onClick={() => {
                                      eliminarInvestigador(
                                        item.idPersona,
                                        index
                                      );
                                    }}
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
                <Button
                  onClick={openModal}
                  colorScheme="blue"
                  variant="outline"
                  ml="5%"
                >
                  Guardar
                </Button>
                <CustomModal
                  isOpen={isOpen}
                  onClose={closeModal}
                  guardar={true}
                  title="Guardar nuevo PID"
                  content="Se guardara el nuevo Proyecto"
                  onSave={handleSubmit((values) => mutate(values))}
                  // onSave={handleSubmit((values) => console.log(values))}
                />
              </Box>
            </CardBody>
          </Card>
        </form>
      </CardBody>
    </Card>
  );
}
