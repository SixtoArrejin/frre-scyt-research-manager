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
import {
  Search2Icon,
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  DeleteIcon,
  PlusSquareIcon,
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
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from "../../utils/data/ListaCategorias.json";
import { Link, useNavigate, useParams } from "react-router-dom";
import proyectosInv from "../../utils/data/proyectosInv.json";
import { useForm } from "react-hook-form";
import { getGrupoById, updateGrupo } from "../../utils/api/gruposApi";
import { useMutation, useQuery } from "react-query";
import {
  formatoFechaISOaAAAAMMDD,
  formatoFechaISOaDDMMAAAA,
} from "../../utils/general";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomModal from "../../components/CustomModal";

const schema = yup.object({
  nombre: yup.string().required("El nombre es requerido"),
  resolucion: yup
    .string()
    .required("La resolución es requerida")
    .matches(/^\d+\/\d+$/, "El formato de la resolución debe ser '###/###'"),
  fechaCreacion: yup.string().required("La fecha es requerida"),
  siglas: yup.string().required("Las siglas son requeridas"),
});

export default function ModificarGrupo() {
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const toast = useToast();

  const [radio, setRadio] = useState("false");

  const { idGrupoInvestigacion } = useParams();

  const {
    data,
    isLoading,
    error: errorGrupo,
  } = useQuery(["grupo"], () => getGrupoById(idGrupoInvestigacion));

  useEffect(() => {
    setValue("nombre", data?.grupo.nombre);
    setValue("resolucion", data?.grupo.resolucion);
    setValue(
      "fechaCreacion",
      formatoFechaISOaAAAAMMDD(data?.grupo.fechaCreacion)
    );
    setValue("siglas", data?.grupo.siglas);
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: data?.grupo?.nombre,
      resolucion: data?.grupo?.resolucion,
      fechaCreacion: formatoFechaISOaAAAAMMDD(data?.grupo?.fechaCreacion),
      siglas: data?.grupo?.siglas,
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updateGrupo(idGrupoInvestigacion, formData),
    onSuccess: () => {
      toast({
        title: "Modificar grupo",
        description: `Se ha modificado el grupo exitosamente`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al modificar los datos del grupo",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const onSub = (values) => {
    console.log(values);
    mutate(values);
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
            MODIFICAR DATOS DEL GRUPO
          </Heading>

          <br />
          <br />

          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Ingrese los datos del grupo</Text>
              <br />
              <form onSubmit={handleSubmit((values) => onSub(values))}>
                <Box
                  display="flex"
                  width="100%"
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
                      display="flex"
                      flexDirection="column"
                      width="50%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FormControl
                        variant="floating"
                        id="nombre"
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          name="nombre"
                          placeholder="Nombre"
                          {...register("nombre")}
                          defaultValue={data?.grupo.nombre || ""}
                        />
                        <FormLabel>Nombre</FormLabel>
                        <Text fontSize="sm" color="red">
                          {errors.nombre?.message}
                        </Text>
                      </FormControl>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      width="50%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FormControl
                        variant="floating"
                        id="siglas"
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          name="siglas"
                          placeholder="Siglas"
                          {...register("siglas")}
                          defaultValue={data?.grupo.siglas || ""}
                        />
                        <FormLabel>Siglas</FormLabel>
                        <Text fontSize="sm" color="red">
                          {errors.siglas?.message}
                        </Text>
                      </FormControl>
                    </Box>
                  </Box>

                  <Box
                    display="flex"
                    flexDirection={{ base: "column", md: "row" }}
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      width="50%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FormControl
                        variant="floating"
                        id="resolucion"
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          name="resolucion"
                          placeholder="Resolucion"
                          {...register("resolucion")}
                          defaultValue={data?.grupo.resolucion || ""}
                        />
                        <FormLabel>Resolucion</FormLabel>
                        <Text fontSize="sm" color="red">
                          {errors.resolucion?.message}
                        </Text>
                      </FormControl>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="column"
                      width="50%"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FormControl
                        variant="floating"
                        id="fecha"
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          name="fecha"
                          type="date"
                          placeholder="Fecha"
                          {...register("fechaCreacion")}
                          defaultValue={
                            formatoFechaISOaAAAAMMDD(
                              data?.grupo.fechaCreacion
                            ) || ""
                          }
                        />
                        <FormLabel>Fecha Creacion</FormLabel>
                        <Text fontSize="sm" color="red">
                          {errors.fechaCreacion?.message}
                        </Text>
                      </FormControl>
                    </Box>
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
                      mr="3%"
                      onClick={() => navigate(-1)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={openModal}
                      colorScheme="blue"
                      variant="outline"
                    >
                      Guardar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title="Guardar datos"
                      content="Se guardara los nuevos datos del grupo"
                      onSave={handleSubmit((values) => mutate(values))}
                    />
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
