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
import { getAllGrupos } from "../../utils/api/gruposApi";

export default function ModificarGrupo() {
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
    setValue("siglas", data?.grupo.siglas);
    setValue("denominacion", data?.grupo.denominacion);
    setValue("resolucion", data?.grupo.resolucion);
    setValue("fechaCreacion", data?.grupo.fechaCreacion);
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: data?.grupo.nombre,
      siglas: data?.grupo.siglas,
      denominacion: data?.grupo.denominacion,
      resolucion: data?.grupo.resolucion,
      fechaCreacion: data?.grupo.fechaCreacion,
    },
  });

/*   const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updatePersona(idPersona, formData),
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
  }); */
/* 
  const onSub = (values) => {
    console.log(values);
    mutate(values);
  }; */

  const [gruposExistentes, setGruposExistentes] = useState([
    "CINAPTIC",
    "ACHETIQ",
    "OTROS",
  ]);

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
              <form /* onSubmit={handleSubmit((values) => onSub(values))} */>
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
                        id="denominacion"
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          name="denominacion"
                          placeholder="Denominación"
                          {...register("denominacion")}
                          defaultValue={data?.grupo.denominacion || ""}
                        />
                        <FormLabel>Denominación</FormLabel>
                      </FormControl>
                    </Box>
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
