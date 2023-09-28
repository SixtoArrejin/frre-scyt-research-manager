import React, { useState } from "react";
import {
  Card,
  CardBody,
  Text,
  Heading,
  Box,
  Button,
  Stack,
  Select,
  FormLabel,
  FormControl,
  useToast,
  Input,
  Radio,
  RadioGroup
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createCategoria } from "../../utils/api/categoriasApi";
import { useMutation } from "react-query";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomModal from "../../components/CustomModal";

const schema = yup.object({
  tipo: yup
    .string()
    .required("El tipo es requerido")
    .test(
      "tipoCat",
      "La categoria debe ser Ministerio o UTN",
      (val) => val.toLowerCase() === "ministerio" || val.toLowerCase() === "utn"
    ),
  equiparacion: yup.boolean().required("La equiparación es requerida"),
  categoria: yup.string().required("La categoria es requerida"),
  normativa: yup
    .string()
    .required("La normativa es requerida")
    .matches(/^\d+\/\d+$/, "El formato de la normativa debe ser '###/###'"),
  comision: yup.string().required("La comisión es requerida"),
  fecha: yup.string().required("La fecha es requerida"),
});

export default function NuevaCategoria() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toast = useToast();
  const navigate = useNavigate();

  const { idPersona } = useParams();

  const [valueCategoria, setValueCategoria] = useState("ministerio");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: "",
      equiparacion: true,
      categoria: "",
      fecha: "",
      normativa: "",
      idPersona: parseInt(idPersona),
      comision: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate } = useMutation({
    mutationFn: (formData) => createCategoria(formData),
    onSuccess: () => {
      toast({
        title: "Nueva categoria",
        description: `Categoria creada exitosamente.`,
        status: "success",
        isClosable: true,
      });
      navigate(`/investigadores/${idPersona}`);
    },
    onError: () => {
      toast({
        title: "Error al crear la categoria",
        description: `Intente de nuevo.`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const onSub = (values) => {
    // const gg = getValues('equiparacion')
    // setValue('equiparacion', getValues('equiparacion')==='true');
    console.log(values);
    mutate(values);
  };

  const onChangeRadio = (value) => {
    if (value === "true") {
      setValue("equiparacion", true);
    } else {
      setValue("equiparacion", false);
    }
  };

  const catUTN = ["A", "B", "C", "D", "E", "F", "G"];
  const catMIN = ["I", "II", "III", "IV", "V"];

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
              Nueva Categoria
            </Heading>

            <br />
            <br />
            <Card width="100%">
              <CardBody>
                <Text fontSize="md">Datos de categoria</Text>
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
                        <Text mb="1vh">Tipo de categoria: </Text>
                        <RadioGroup
                          onChange={setValueCategoria}
                          value={valueCategoria}
                          mb="5vh"
                        >
                          <Stack
                            direction="row"
                            spacing={10}
                            {...register("tipo")}
                          >
                            <Radio value="ministerio" {...register("tipo")}>
                              Ministerio
                            </Radio>
                            <Radio value="utn" {...register("tipo")}>
                              UTN
                            </Radio>
                          </Stack>
                          <Text fontSize="sm" color="red">
                            {errors.tipo?.message}
                          </Text>
                        </RadioGroup>
                      </Box>

                      <Box
                        display="flex"
                        flexDirection="column"
                        width="50%"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text mb="1vh">Equiparacion:</Text>
                        <RadioGroup
                          isDisabled={valueCategoria === "ministerio"}
                          mb="5vh"
                          onChange={(value) => onChangeRadio(value)}
                          defaultValue="false"
                        >
                          <Stack direction="row" spacing={10}>
                            <Radio value="true">Si</Radio>
                            <Radio value="false">No</Radio>
                          </Stack>
                          <Text fontSize="sm" color="red">
                            {errors.equiparacion?.message}
                          </Text>
                        </RadioGroup>
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
                          id="categoria"
                          width={{ base: "100%", md: "50%" }}
                          mb="5vh"
                        >
                          <Select
                            placeholder="Seleccione categoria"
                            {...register("categoria")}
                          >
                            {valueCategoria == "utn"
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
                                ))}
                          </Select>
                          <FormLabel>Categoria</FormLabel>
                          <Text fontSize="sm" color="red">
                            {errors.categoria?.message}
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
                          id="normativa"
                          width={{ base: "100%", md: "50%" }}
                          mb="5vh"
                        >
                          <Input
                            name="normativa"
                            placeholder="Normativa"
                            {...register("normativa")}
                          />
                          <FormLabel>Normativa</FormLabel>
                          <Text fontSize="sm" color="red">
                            {errors.normativa?.message}
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
                          id="comision"
                          width={{ base: "100%", md: "50%" }}
                          mb="5vh"
                        >
                          <Input
                            name="comision"
                            placeholder="Comisión"
                            {...register("comision")}
                          />
                          <FormLabel>Comisión</FormLabel>
                          <Text fontSize="sm" color="red">
                            {errors.comision?.message}
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
                            {...register("fecha")}
                          />
                          <FormLabel>Fecha</FormLabel>
                          <Text fontSize="sm" color="red">
                            {errors.fecha?.message}
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
                        title="Guardar nueva categoria"
                        content="Se guardara la nueva categoria"
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
    </>
  );
}
