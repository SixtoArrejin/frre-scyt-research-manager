import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Text,
  Heading,
  Box,
  Button,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { getAllGrupos } from "../../utils/api/gruposApi";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { getAllPersonas } from "../../utils/api/personasApi";
import { createProyecto } from "../../utils/api/proyectosApi";
import CustomModal from "../../components/CustomModal";
import { getAllRegionales } from "../../utils/api/regionalesApi";
import { getAllTiposProyectos } from "../../utils/api/tiposProyectosApi";
import GenericInput from "../../components/formControls/GenericInput.jsx";
import GenericSelect from "../../components/formControls/GenericSelect.jsx";
import GenericRadio from "../../components/formControls/GenericRadio.jsx";
import Tabla from "../../components/Tabla.jsx";
import { formatoFechaISOaDDMMAAAA } from "../../utils/general.jsx";

const tipoActividad = [
  "Desarrollo Experimental",
  "Investigación Aplicada",
  "Investigación Básica",
];

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
  "Técnico de Apoyo",
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
  } = useQuery(["regionales"], () => getAllRegionales());

  const {
    data: dataTiposProyectos,
    isLoading: isLoadingGetTiposProyectos,
    //error: errorTiposProyectos,
  } = useQuery(["tiposProyectos"], () => getAllTiposProyectos());

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
    watch,
    register,
    handleSubmit,
    //setValue,
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
      prorrogado: "false",
      nuevaFechaFin: "",
      nuevaDisposicion: "",
      codPid: "",
      programa: "",
      disposicion: "",
      tipo: "pid",
      empresaInstitucion: "",
      regionales: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "investigadores", // Nombre del campo de formulario que es un arreglo
  });

  const {
    //fields: fieldsGrupos,
    append: appendG,
    remove: removeG,
    //update: updateG,
  } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "grupos", // Nombre del campo de formulario que es un arreglo
  });

  const {
    //fields: fieldsRegionales,
    append: appendR,
    remove: removeR,
    //update: updateR,
  } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "regionales", // Nombre del campo de formulario que es un arreglo
  });

  const tipoProyectosConRegionales = [
    "Integrador Asociado (PID IA) con Incentivo",
    "Integrador Asociado (PID IA) sin Incentivo",
    "Inter-institucional (PIC IN) con Incentivos",
    "Inter-institucional (PIC IN) sin Incentivos",
    "PID Tecnología Educativa Multifacultad con Incentivos (PIDA)",
    "PID Tecnología Educativa Multifacultad sin Incentivos (PIDA)",
    "Tutorado con Incentivo",
    "Tutorado sin Incentivo",
  ];
  const [selectedTipoProyecto, setSelectedTipoProyecto] = useState("");

  const handleTipoProyectoChange = (e) => {
    const value = e.target.value;
    setSelectedTipoProyecto(value);
  };

  //Aca se agrega lo de la tabla de investigadores
  const [selectedOptions, setSelectedOptions] = useState();
  const [selectedOptionsGrupos, setSelectedOptionsGrupos] = useState();
  const [selectedOptionsRegionales, setSelectedOptionsRegionales] = useState();
  const [rolSelected, setRolSelected] = useState();
  const [fechaSelected, setFechaSelected] = useState();

  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] =
    useState([]);
  const [regionalesSeleccionados, setRegionalesSeleccionados] = useState([]);
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
      rol: rolSelected,
      persona: objetoBuscado,
      fechaInicio: fechaSelected,
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

  const agregarRegional = () => {
    // Verificar si el objeto ya está en regionalesSeleccionadas antes de agregarlo
    const objetoYaAgregado = regionalesSeleccionados.find(
      (item) => item == selectedOptionsRegionales
    );

    if (!objetoYaAgregado) {
      appendR(selectedOptionsRegionales);
      setRegionalesSeleccionados([
        ...regionalesSeleccionados,
        selectedOptionsRegionales,
      ]);
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
    console.log(investigadoresRestantes);
    setGruposSeleccionados(nuevosGrupos);
  };

  const eliminarRegional = (itemEliminar, index) => {
    // Filtrar las regionales y crear un nuevo arreglo sin el objeto a eliminar
    const nuevasRegionales = regionalesSeleccionados.filter(
      (item) => item !== itemEliminar
    );

    removeR(index);

    setRegionalesSeleccionados(nuevasRegionales);
  };

  const onSubmit = (values) => {
    // Convierte el valor de 'prorroga' a booleano antes de enviar
    const modifiedValues = {
      ...values,
      prorrogado: values.prorrogado === "true",
    };
    console.log(modifiedValues);
    mutate(modifiedValues);
  };

  const PidExterno = useWatch({ control, name: "tipo" });
  const [estado, setEstado] = useState("");

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
              Nuevo Proyecto
            </Heading>
            <br />
            <Card width="100%">
              <CardBody>
                <Text fontSize="md">Ingrese los datos del proyecto: </Text>
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
                      <Box
                        width={{ base: "100%", md: "20%" }}
                        display="flex"
                        justifyContent="center"
                        mt="15px"
                      >
                        <GenericRadio
                          name="tipo"
                          direction="row"
                          options={[
                            { value: "pid", label: "PID" },
                            { value: "externo", label: "Externo" },
                          ]}
                          register={register}
                          defaultValue="pid"
                          mb="5vh"
                          width={"100%"}
                        />
                      </Box>
                      {PidExterno === "pid" && (
                        <GenericInput
                          name="codPid"
                          placeholder="Código PID"
                          register={register}
                          label="Código PID"
                          width={{ base: "100%", md: "80%" }}
                          mb="5vh"
                          isRequired
                        />
                      )}
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <GenericInput
                        textArea
                        name="denominacion"
                        placeholder="Denominación"
                        register={register}
                        label="Denominación"
                        width={{ base: "100%", md: "100%" }}
                        mb="5vh"
                        isRequired
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <GenericInput
                        name="fechaInicio"
                        type="date"
                        register={register}
                        label="Fecha Inicio"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      />

                      <GenericInput
                        name="fechaFin"
                        type="date"
                        register={register}
                        label="Fecha Fin"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                      />

                      <GenericInput
                        type="number"
                        name="convocatoria"
                        placeholder="Convocatoria"
                        register={register}
                        label="Convocatoria"
                        width={{ base: "100%", md: "30%" }}
                        mb="5vh"
                        isRequired
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <GenericInput
                        name="programa"
                        placeholder="Programa"
                        register={register}
                        label="Programa"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                        isRequired
                      />

                      <GenericSelect
                        name="tipoProyecto"
                        label="Tipo de proyecto"
                        placeholder="Tipo de proyecto..."
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                        register={register}
                        options={(isLoadingGetTiposProyectos
                          ? ["Cargando..."]
                          : dataTiposProyectos?.tiposProyectos
                        ).map((tipo) => ({
                          value: tipo,
                          label: tipo,
                        }))}
                        errors={errors}
                        onChange={handleTipoProyectoChange}
                      />
                    </Box>
                    {PidExterno === "pid" && (
                      <Box
                        display="flex"
                        flexDirection={{ base: "column", md: "row" }}
                        width="100%"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <GenericSelect
                          name="tipoActividad"
                          label="Tipo de actividad"
                          placeholder="Tipo de actividad..."
                          width={{ base: "100%", md: "30%" }}
                          mb="5vh"
                          isRequired
                          register={register}
                          options={tipoActividad.map((actividad) => ({
                            value: actividad,
                            label: actividad,
                          }))}
                          errors={errors}
                        />

                        <GenericSelect
                          name="estado"
                          label="Estado"
                          placeholder="Estado..."
                          width={{
                            base: "100%",
                            md: estado === "HOMOLOGADO" ? "30%" : "65%",
                          }}
                          mb="5vh"
                          isRequired
                          register={register}
                          options={estadoProyecto.map((estado) => ({
                            value: estado,
                            label: estado,
                          }))}
                          errors={errors}
                          onChange={(e) => setEstado(e.target.value)}
                        />

                        {estado === "HOMOLOGADO" && (
                          <GenericInput
                            name="disposicion"
                            placeholder="Disposición"
                            register={register}
                            label="Disposición"
                            width={{ base: "100%", md: "30%" }}
                            mb="5vh"
                            isRequired={estado === "HOMOLOGADO"}
                          />
                        )}
                      </Box>
                    )}
                    <Box
                      display="flex"
                      flexDirection={{ base: "column", md: "row" }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      {PidExterno !== "pid" && (
                        <GenericInput
                          name="empresaInstitucion"
                          placeholder="Empresa/Institución"
                          register={register}
                          label="Empresa/Institución"
                          width={{ base: "100%", md: "47.5%" }}
                          mb="5vh"
                        />
                      )}
                      {PidExterno === "pid" && (
                        <Box
                          width={{ base: "100%", md: "52.5%" }}
                          display="flex"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                          height="100%"
                          mb="5%"
                          ml="1%"
                        >
                          <Text mr="2%" as="b">
                            Prorroga:
                          </Text>
                          <GenericRadio
                            name="prorrogado"
                            direction="row"
                            options={[
                              { value: "true", label: "Si" },
                              { value: "false", label: "No" },
                            ]}
                            register={register}
                            defaultValue={watch("prorrogado")}
                            errors={errors}
                          />
                        </Box>
                      )}
                      {PidExterno === "pid" &&
                        watch("prorrogado") === "true" && (
                          <Box
                            display="flex"
                            flexDirection={{ base: "column", md: "row" }}
                            width="100%"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <GenericInput
                              name="nuevaFechaFin"
                              type="date"
                              register={register}
                              label="Nueva Fecha Finalización"
                              width={{
                                base: "100%",
                                md: estado === "HOMOLOGADO" ? "46.25%" : "100%",
                              }}
                              mb="5vh"
                              isRequired={
                                PidExterno === "pid" &&
                                watch("prorrogado") === "true"
                              }
                            />
                            {estado === "HOMOLOGADO" && (
                              <GenericInput
                                name="nuevaDisposicion"
                                placeholder="Nueva Disposición"
                                register={register}
                                label="Nueva Disposición"
                                width={{ base: "100%", md: "46.25%" }}
                                mb="5vh"
                                isRequired={
                                  estado === "HOMOLOGADO" &&
                                  PidExterno === "pid" &&
                                  watch("prorrogado") === "true"
                                }
                              />
                            )}
                          </Box>
                        )}
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
                    <GenericSelect
                      placeholder="Grupos..."
                      isSearchable={true}
                      options={grupos?.map((grupo) => ({
                        value: grupo.idGrupoInvestigacion,
                        label: grupo.siglas,
                      }))}
                      onChange={(e) => {
                        setSelectedOptionsGrupos(e.target.value);
                      }}
                    />
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
                <Tabla
                  columnas={["Grupo", "Eliminar"]}
                  datos={gruposSeleccionados?.map((item, index) => [
                    item.siglas,
                    <DeleteIcon
                      cursor={"pointer"}
                      onClick={() => {
                        eliminarGrupo(item.idGrupoInvestigacion, index);
                      }}
                    />,
                  ])}
                  paginado={false}
                />
              </Box>
            </CardBody>
          </Card>

          {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
          <br />
          {gruposSeleccionados.length > 0 && (
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
                      width="75%"
                      marginLeft="2%"
                    >
                      <GenericSelect
                        placeholder="Integrantes..."
                        isSearchable={true}
                        options={sortedInvestigadores?.map((investigador) => ({
                          value: investigador.idPersona,
                          label:
                            investigador.apellido + ", " + investigador.nombre,
                        }))}
                        onChange={(e) => {
                          setSelectedOptions(e.target.value);
                        }}
                        width="30%"
                      />
                      <GenericSelect
                        placeholder="Rol..."
                        options={roles.map((rol) => ({
                          value: rol,
                          label: rol,
                        }))}
                        onChange={(e) => {
                          setRolSelected(e.target.value);
                        }}
                        width="30%"
                      />
                      <GenericInput
                        name="fechaInicio"
                        label="Fecha ingreso"
                        placeholder="Fecha de ingreso"
                        type="date"
                        width="30%"
                        onChange={(e) => setFechaSelected(e.target.value)}
                        value={fechaSelected}
                      />
                    </Box>
                    <Box display="flex" justifyContent="flex-end" width="25%">
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

                  <Tabla
                    columnas={[
                      "Apellido y Nombre",
                      "Grupo",
                      "Rol",
                      "Fecha de Inicio",
                      "Eliminar",
                    ]}
                    datos={fields?.map((item, index) => [
                      <div>
                        {item.persona.apellido} {item.persona.nombre}
                      </div>,
                      <div>{item.persona.gruposinvestigacion.siglas}</div>,
                      <div>{item.rol}</div>,
                      <div>{formatoFechaISOaDDMMAAAA(item.fechaInicio)}</div>,
                      <DeleteIcon
                        cursor={"pointer"}
                        onClick={() => {
                          eliminarInvestigador(item.idPersona, index);
                        }}
                      />,
                    ])}
                    paginado={false}
                  />
                </Box>
                <br />
              </CardBody>
            </Card>
          )}
          {tipoProyectosConRegionales?.includes(selectedTipoProyecto) && (
            <Card width="100%">
              <CardBody>
                <Text fontSize="md">Agregar las regionales asociadas</Text>
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
                      <GenericSelect
                        placeholder="Regionales..."
                        isSearchable={true}
                        options={dataRegionales?.regionales?.map(
                          (regional) => ({
                            value: regional,
                            label: regional,
                          })
                        )}
                        onChange={(e) => {
                          setSelectedOptionsRegionales(e.target.value);
                        }}
                      />
                    </Box>
                    <Box display="flex" justifyContent="flex-end" width="55%">
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        mr="5"
                        onClick={agregarRegional}
                      >
                        Agregar
                      </Button>
                    </Box>
                  </Box>
                  <br />

                  <Tabla
                    columnas={["Regional", "Eliminar"]}
                    datos={regionalesSeleccionados?.map((item, index) => [
                      item,
                      <DeleteIcon
                        cursor={"pointer"}
                        onClick={() => {
                          eliminarRegional(item, index);
                        }}
                      />,
                    ])}
                    paginado={false}
                  />
                </Box>
                <br />
              </CardBody>
            </Card>
          )}
          <Box
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent="center"
            mt="2%"
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
              isLoading={isLoading}
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
              //onSave={handleSubmit((values) => console.log(values))}
              onSave={handleSubmit((values) => onSubmit(values))}
            />
          </Box>
        </form>
      </CardBody>
    </Card>
  );
}
