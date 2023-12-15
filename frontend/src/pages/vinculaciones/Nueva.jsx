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

export default function NuevaVinculacion() {
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

  const [selectedConvenio, setSelectedConvenio] = useState()
  const [nroConvenio, setNroConvenio] = useState()

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
      adjudicacion: null,
      beneficiario: null,
      desembolsos: null,
      empresaInstitucion: null,
      nroMarco: null,
      financiamiento: false,
      linea: null,
      monto: null,
      plazoEjecucion: null,
      presentacion: null,
    }
  });

  const { fields: convenios, append, remove, update } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: "convenios", // Nombre del campo de formulario que es un arreglo
  });

  const [financiamiento, setFinanciamiento] = useState(false)
  const onChangeRadioFinanciamiento = (value) => {
    if (value === "true") {
      setFinanciamiento(true)
      setValue("financiamiento", true);
    } else {
      setFinanciamiento(false)
      setValue("financiamiento", false);
    }
  };

  const agregarConvenio = () => {
    append({ tipoConvenio: selectedConvenio, nroConvenio })
  }

  const eliminarConvenio = (index) => {
    remove(index)
  }

  const onSub = (values) => {
    console.log(values);
    // mutate(values);
  };

  return (
    <Card>
      <CardBody>
        <form
          style={{ width: "100%" }}
          onSubmit={handleSubmit((values) => onSub(values))}
        >
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Heading as="h2" size="xl" textAlign="center">
              Nueva Vinculacion
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
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          name="apellido"
                          placeholder="Empresa/Institución"
                          {...register("empresaInstitucion")}
                        />
                        <FormLabel>Empresa/Institución</FormLabel>
                      </FormControl>
                      <Box
                        width={{ base: "100%", md: "45%" }}
                        display="flex"
                        justifyContent="center"
                      >
                        <Box display={'flex'} >
                          <RadioGroup
                            onChange={onChangeRadioFinanciamiento}
                            // value={valueCategoria}
                            mb="5vh"
                            defaultValue="false"
                            width={'100%'}
                          >
                            <HStack>
                              <Radio value="true" >Con financiamiento</Radio>
                              <Radio value="false" >Sin financiamiento</Radio>
                            </HStack>
                          </RadioGroup>
                        </Box>
                      </Box>
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
                        width={{ base: "100%", md: "50%" }}
                        mb="5vh"
                      >
                        <Input
                          name="apellido"
                          type="number"
                          placeholder="Nro Marco"
                          {...register("nroMarco", { valueAsNumber: true })}
                        />
                        <FormLabel>Nro Marco</FormLabel>
                      </FormControl>
                    </Box>

                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
          <br />
          <Card width="100%">
            <CardBody>
              <Text fontSize="md">Convenios</Text>
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
                    flexDirection={{ base: "column", md: "row" }}
                    justifyContent="space-between"
                    width="60%"
                    marginLeft="2%"
                  >
                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "35%" }}
                      mb="5vh"
                    >
                      <Select
                        placeholder="Integrantes"
                        isSearchable={true}
                        onChange={(e) => {
                          setSelectedConvenio(e.target.value);
                        }}
                      >
                        {['1ro', '2do', '3ro'].map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl
                      variant="floating"
                      width={{ base: "100%", md: "35%" }}
                      mb="5vh"
                    >
                      <Input
                        name="nroConvenio"
                        placeholder="Nro Convenio"
                        onChange={(e) => setNroConvenio(Number(e.target.value))}
                      />
                      <FormLabel>Nro Convenio</FormLabel>
                    </FormControl>

                    <Box display="flex" justifyContent="flex-end" width="20%">
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        // onClick={() => alert('new convenio')}
                        onClick={agregarConvenio}
                      >
                        Agregar
                      </Button>
                    </Box>
                  </Box>

                </Box>

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
                              <Text fontSize="md">Tipo</Text>
                            </Th>
                            <Th textAlign="center">
                              <Text fontSize="md">Número</Text>
                            </Th>
                            <Th textAlign="center">
                              <Text fontSize="md">Eliminar</Text>
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {convenios?.map((item, index) => {
                            return (
                              <Tr key={index}>
                                <Td textAlign="center">
                                  <Text
                                    fontSize="md"
                                    {...register(
                                      `convenios[${index}]`,
                                      { value: item }
                                    )}
                                  >
                                    {item.tipoConvenio}
                                  </Text>
                                </Td>
                                <Td textAlign="center">
                                  <Text fontSize="md">
                                    {item.nroConvenio}
                                  </Text>
                                </Td>
                                <Td textAlign="center">
                                  <DeleteIcon
                                    cursor={"pointer"}
                                    onClick={() => {
                                      eliminarConvenio(index)
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
          <br />

          <Card width="100%">
            <CardBody>
              <Text fontSize="md">
                Ingrese los datos del convenio {financiamiento === true ? 'con' : 'sin'} financiamiento
              </Text>
              <br />
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                {(financiamiento === true) &&
                  <Box
                    display="flex"
                    width="75%"
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
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Input
                          placeholder="Título"
                          {...register("titulo")}
                        />
                        <FormLabel>Título</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Input
                          type="text"
                          placeholder="Jorge Almendra"
                          {...register("beneficiario")}
                        />
                        <FormLabel>Nombre del beneficiario</FormLabel>
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
                          type="number"
                          placeholder="Título"
                          {...register("monto", { valueAsNumber: true })}
                        />
                        <FormLabel>Monto</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Input
                          type="number"
                          placeholder="Jorge Almendra"
                          {...register("desembolsos", { valueAsNumber: true })}
                        />
                        <FormLabel>Cantidad de desembolsos</FormLabel>
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
                          type="date"
                          {...register("presentacion", { valueAsDate: true })}
                        />
                        <FormLabel>Presentación</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Input
                          type="date"
                          {...register("adjuducacion", { valueAsDate: true })}
                        />
                        <FormLabel>Adjudicación</FormLabel>
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
                          type="number"
                          placeholder="Plazo de ejecución"
                          {...register("plazoEjecución", { valueAsNumber: true })}
                        />
                        <FormLabel>Plazo de ejecución (meses)</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Select
                          placeholder="Línea..."
                          isSearchable={true}
                          {...register("linea")}
                        >
                          {['1ro', '2do', '3ro'].map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </Select>
                        <FormLabel>Línea</FormLabel>
                      </FormControl>
                    </Box>
                  </Box>
                }

                {(financiamiento === false) &&
                  <Box
                    display="flex"
                    width="75%"
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
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Input
                          type="date"
                          {...register("fechaInicio", { valueAsDate: true })}
                        />
                        <FormLabel>Inicio</FormLabel>
                      </FormControl>

                      <FormControl
                        variant="floating"
                        width={{ base: "100%", md: "47.5%" }}
                        mb="5vh"
                      >
                        <Input
                          type="date"
                          {...register("fechaCierre", { valueAsDate: true })}
                        />
                        <FormLabel>Cierre</FormLabel>
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
                          type="text"
                          placeholder="Descripción"
                          style={{ resize: "none" }}
                          {...register("descripcion")}
                        />
                        <FormLabel>Descripción</FormLabel>
                      </FormControl>
                    </Box>

                  </Box>
                }

              </Box>
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="flex-end"
              // justifyContent="center"
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
                  onSave={handleSubmit((values) => onSub(values))}
                // onSave={handleSubmit((values) => mutate(values))}
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
