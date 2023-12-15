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
import { createGrupo } from "../../utils/api/gruposApi";
import { useMutation, useQuery } from "react-query";
import CustomModal from "../../components/CustomModal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  fechaDesembolso: yup.date().required("La fecha es requerida"),
  plazoEtapa: yup
    .number()
    .required("El plazo es requerido"),
  monto: yup.number().required("El monto es requerido"),
});

export default function NuevoDesembolso() {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fechaDesembolso: (new Date()).toISOString,
      plazoEtapa: null,
      monto: null
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => createGrupo(formData),
    onSuccess: () => {
      toast({
        title: "Crear desembolso",
        description: `Se ha creado exitosamente`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al registrar el desembolso",
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
            Nuevo desembolso
          </Heading>

          <br />
          <br />

          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Ingrese los datos del desembolso</Text>
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
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          type="date"
                          {...register("fechaDesembolso")}
                        />
                        <FormLabel>Fecha de desembolso</FormLabel>
                        <Text fontSize="sm" color="red">
                          {errors.fechaDesembolso?.message}
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
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          placeholder="Plazo (meses)"
                          type="number"
                          {...register("plazoEtapa")}
                        />
                        <FormLabel>Plazo de etapa</FormLabel>
                        <Text fontSize="sm" color="red">
                          {errors.plazoEtapa?.message}
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
                          type="number"
                          placeholder="Monto"
                          {...register("monto")}
                        />
                        <FormLabel>Monto</FormLabel>
                        <Text fontSize="sm" color="red">
                          {errors.monto?.message}
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
                      title="Guardar nuevo desembolso"
                      content="Se guardara el nuevo desembolso"
                      onSave={handleSubmit((values) => onSub(values))}
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
