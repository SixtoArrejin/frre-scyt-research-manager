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
  useToast,
  Select,
  Textarea,
  VStack,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { Input, HStack } from "@chakra-ui/react";
import { Search2Icon, AddIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, DeleteIcon, PlusSquareIcon } from "@chakra-ui/icons";
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
  FormLabel
} from "@chakra-ui/react";
import investigadores from "../../utils/data/investigadores.json";
import InputLabel from "../../components/InputLabel";
import categorias from '../../utils/data/ListaCategorias.json'
import { Link, useParams, useNavigate } from 'react-router-dom';
import proyectosInv from '../../utils/data/proyectosInv.json';
import { getAllPersonas, getPersonaById } from "../../utils/api/personasApi";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { formatoFechaISOaAAAAMMDD, formatoFechaISOaDDMMAAAA, getCategoriaMasActual } from "../../utils/general";
import { deleteCategoriaById } from "../../utils/api/categoriasApi";
import { getProyectoById, updatePID } from "../../utils/api/proyectosApi";
import CustomModal from "../../components/CustomModal";
import { useForm } from "react-hook-form";

export default function ModificarPIDs() {

  const navigate = useNavigate();
  const toast = useToast();

  const { idPid } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const { data, isLoading, error } = useQuery(["proyecto", idPid], () => getProyectoById(Number(idPid)))
  const [integrantes, setIntegrantes] = useState(data?.proyecto?.participa)
  const [grupos, setGrupos] = useState(data?.proyecto?.tiene)
  const [proyectoPID, setProyectoPID] = useState(data?.proyecto)

  const { data: dataInvestigadores } = useQuery(["investigadoresPID"], () =>
    getAllPersonas()
  );

  useEffect(() => {
    setIntegrantes(data?.proyecto?.participa)
    setGrupos(data?.proyecto?.tiene)
    setProyectoPID(data?.proyecto)
  }, [data])

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updatePID(Number(idPid), formData),
    onSuccess: () => {
      toast({
        title: "Modificar PID",
        description: `Se ha modificado el PID exitosamente`,
        status: "success",
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al modificar los datos del PID",
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
        tipoActividad: data?.proyecto?.tipoActividad,
        fechaInicio: formatoFechaISOaAAAAMMDD(data?.proyecto?.fechaInicio),
        fechaFin: formatoFechaISOaAAAAMMDD(data?.proyecto?.fechaFin),
        denominacion: data?.proyecto?.denominacion,
        completo: data?.proyecto?.completo,
        regional: data?.proyecto?.regional,
        convocatoria: data?.proyecto?.convocatoria,
        estado: data?.proyecto?.estado,
        idDirector: data?.proyecto?.idDirector,
        idCodirector: data?.proyecto?.idCodirector,
      },
      pid: {
        tipoProyecto: data?.proyecto?.pids?.tipoProyecto,
        prorrogado: data?.proyecto?.pids?.prorrogado,
        codPid: data?.proyecto?.pids?.codPid,
        programa: data?.proyecto?.pids?.programa,
        disposicion: data?.proyecto?.pids?.disposicion,
      },
    },
  });

  const onChangeRadioProrroga = (value) => {
    if (value === "true") {
      setValue("pid.prorrogado", true);
    } else {
      setValue("pid.prorrogado", false);
    }
  };

  const onChangeRadioCompleto = (value) => {
    if (value === "true") {
      setValue("proyecto.completo", true);
    } else {
      setValue("proyecto.completo", false);
    }
  };

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center' >
          <Heading as="h2" size="xl" textAlign="center">
            Modificar datos del PID
          </Heading>
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize="md">Datos del proyecto</Text>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="apellido" placeholder="Código PID" {...register("pid.codPid")} />
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
                      // defaultValue={data?.proyecto?.regional}
                      />
                      <FormLabel>Regional</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">
                    <FormControl variant="floating" width={{ base: '100%', md: '100%' }} mb='5vh'>
                      <Textarea placeholder='Denominación' style={{ resize: 'none' }} {...register("proyecto.denominacion")} />
                      <FormLabel>Denominación</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

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
                      // defaultValue={data?.proyecto?.idDirector}
                      >
                        {dataInvestigadores?.personas.map(
                          (investigador, key) => (
                            <option key={key} value={investigador.idPersona}>
                              {investigador.apellido}, {investigador.nombre}
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
                      // defaultValue={data?.proyecto?.idCodirector}
                      >
                        {dataInvestigadores?.personas.map(
                          (investigador, key) => (
                            <option key={key} value={investigador.idPersona}>
                              {investigador.apellido}, {investigador.nombre}
                            </option>
                          )
                        )}
                      </Select>
                      <FormLabel>Codirector</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" id="fechaInicio" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input type='date' name="fechaInicio" placeholder="Fecha Inicio" {...register("proyecto.fechaInicio")} />
                      <FormLabel>Fecha Inicio</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input type='date' name="fechaFin" placeholder="Fecha Fin" {...register("proyecto.fechaInicio")} />
                      <FormLabel>Fecha Fin</FormLabel>
                    </FormControl>

                    {/* <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="prorroga" placeholder="Prorroga" defaultValue={data?.proyecto?.pids?.prorrogado ? 'Si' : 'No'} />
                      <FormLabel>Prorroga</FormLabel>
                    </FormControl> */}
                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input type='number' name="convocatoria" placeholder="Convocatoria" {...register("proyecto.convocatoria", {
                        valueAsNumber: true,
                      })} />
                      <FormLabel>Convocatoria</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="programa" placeholder="Programa" {...register("pid.programa")} />
                      <FormLabel>Programa</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="tipoProyecto" placeholder="Tipo de proyecto" defaultValue={data?.proyecto?.pids?.tipoProyecto} />
                      <FormLabel>Tipo de proyecto</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="actividad" placeholder="Actividad" {...register("proyecto.tipoActividad")} />
                      <FormLabel>Tipo Actividad</FormLabel>
                    </FormControl>

                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="estado" placeholder="Estado" {...register("proyecto.estado")} />
                      <FormLabel>Estado</FormLabel>
                    </FormControl>

                    {/* <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="completo" placeholder="Completo" defaultValue={data?.proyecto?.completo ? 'Si' : 'No'} />
                      <FormLabel>Completo</FormLabel>
                    </FormControl> */}
                    <FormControl variant="floating" width={{ base: '100%', md: '30%' }} mb='5vh'>
                      <Input name="disposicion" placeholder="Disposición" {...register("pid.disposicion")} />
                      <FormLabel>Disposición</FormLabel>
                    </FormControl>
                  </Box>
                  <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems="center" justifyContent="space-between">

                    {/* <FormControl variant="floating" width={{ base: '100%', md: '47.5%' }} mb='5vh'>
                      <Input name="convocatoria" placeholder="Convocatoria" defaultValue={data?.proyecto?.convocatoria} />
                      <FormLabel>Convocatoria</FormLabel>
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
                          mb="5vh"
                          defaultValue={data?.proyecto?.pids?.prorrogado ? 'true' : 'false'}
                        >
                          <Stack direction="row" spacing={10}>
                            <Radio value="true">Si</Radio>
                            <Radio value="false">No</Radio>
                          </Stack>
                        </RadioGroup>
                      </VStack>
                    </Box>

                    <Box
                      width={{ base: "100%", md: "50%" }}
                      display="flex"
                      justifyContent="center"
                    >
                      <VStack>
                        <Text mb="1vh">Completo: </Text>
                        <RadioGroup
                          onChange={onChangeRadioCompleto}
                          defaultValue={data?.proyecto?.completo ? 'true' : 'false'}
                          mb="5vh"
                        >
                          <Stack direction="row" spacing={10}>
                            <Radio value="true">Si</Radio>
                            <Radio value="false">No</Radio>
                          </Stack>
                        </RadioGroup>
                      </VStack>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    width="100%"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Button
                      colorScheme="gray"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      mr="3%"
                    >
                      Cancelar
                    </Button>
                    <Button onClick={openModal} colorScheme="blue" variant="outline">
                      Aceptar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title="Se modificaran los datos del proyecto."
                      content="¿Seguro que desea modificar la información del proyecto?"
                      // onSave={(handleSubmit((values) => console.log(values)))}
                      onSave={handleSubmit((values) => { console.log(values); mutate(values) })}
                    />
                  </Box>
                </Box>
              </Box>

            </CardBody>
          </Card>
        </Box>
      </CardBody>
    </Card>
  );
}