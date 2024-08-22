import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { getAllPersonas } from '../../utils/api/personasApi';
import { updatePID } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import { getProyectoById } from '../../utils/api/proyectosApi';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';

const roles = ['Director', 'CoDirector', 'Investigador', 'Becario', 'Asesor Cientifico', 'Técnico de Apoyo'];

export default function AgregarInvestigador() {
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

  const { idPid } = useParams();

  const { data: dataParticipa, isLoading } = useQuery(['participa', idPid], () => getProyectoById(Number(idPid)));
  const [investigadores1, setInvestigadores1] = useState([]);

  const [investigadoresFiltrados, setInvestigadoresFiltrados] = useState([]);

  useEffect(() => {
    setInvestigadores1(dataParticipa?.proyecto.participa);

    const investigadoresGrupo = investigadores.filter((investigador) => {
      return dataParticipa?.proyecto?.tiene.some((item) => {
        return investigador.idGrupoInvestigacion === item.idGrupoInvestigacion;
      });
    });

    setInvestigadoresFiltrados(investigadoresGrupo);
  }, [dataParticipa]);

  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => updatePID(Number(idPid), formData),
    onSuccess: () => {
      toast({
        title: 'Agregar investigador',
        description: `Se ha agregado el investigador exitosamente`,
        status: 'success',
        isClosable: true,
      });
      // navigate(`/investigadores/5`);
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al agregar al investigador',
        description: `Intente de nuevo.`,
        status: 'error',
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
    defaultValues: {},
  });

  const { fields, append, remove, update } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: 'investigadores', // Nombre del campo de formulario que es un arreglo
  });

  const onSubmit = (dataForm, event) => {
    console.log(dataForm);
    event.preventDefault();
    mutate(dataForm);
  };

  const onChangeRadioProrroga = (value) => {
    if (value === 'true') {
      setValue('pid.prorrogado', true);
    } else {
      setValue('pid.prorrogado', false);
    }
  };

  //Aca se agrega lo de la tabla de investigadores
  const [selectedOptions, setSelectedOptions] = useState();
  const [selectedOptionsGrupos, setSelectedOptionsGrupos] = useState();
  const [currentPage, setCurrentPage] = useState(0); // Estado para controlar la página actual

  const { data: dataPersonas } = useQuery('personas', () => getAllPersonas());
  const [investigadores, setInvestigadores] = useState(dataPersonas?.personas || []);

  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] = useState([]);

  const sortedInvestigadores = [...investigadoresFiltrados]?.sort((a, b) => {
    const apellidoA = a.apellido.toLowerCase();
    const apellidoB = b.apellido.toLowerCase();
    return apellidoA.localeCompare(apellidoB);
  });

  const agregarInvestigador = () => {
    console.log(sortedInvestigadores);
    console.log(selectedOptions);
    const objetoBuscado = sortedInvestigadores.find((item) => item.idPersona == selectedOptions);

    const objetoAgregar = {
      idPersona: objetoBuscado.idPersona,
      rol: '',
      fechaInicio: new Date().toISOString(),
    };

    // Verificar si el objeto ya está en investigadoresSeleccionados antes de agregarlo
    const objetoYaAgregado = investigadoresSeleccionados.find((item) => item.idPersona == selectedOptions);

    if (!objetoYaAgregado) {
      append(objetoAgregar);
      setInvestigadoresSeleccionados([...investigadoresSeleccionados, objetoBuscado]);
    }
  };

  const eliminarInvestigador = (idAEliminar, index) => {
    // Filtrar los investigadores y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosInvestigadores = investigadoresSeleccionados.filter((item) => item.idPersona !== idAEliminar);

    remove(index);

    // Actualizar investigadoresSeleccionados con el nuevo arreglo
    setInvestigadoresSeleccionados(nuevosInvestigadores);
  };

  const onSub = (values) => {
    console.log(values);
    mutate(values);
  };
  // Obtén los objetos de investigadores que tienen un idPersona en común entre investigadores y investigadores1
  const obtenerInvestigadoresSeleccionados = () => {
    const investigadoresSeleccionados = investigadores.filter((investigador) => {
      return investigadores1.some((investigador1) => {
        return investigador.idPersona === investigador1.idPersona;
      });
    });

    return investigadoresSeleccionados;
  };

  const [ejemplo, setEjemplo] = useState();
  useEffect(() => {
    console.log('pepe');
  }, [ejemplo]);

  useEffect(() => {
    console.log(investigadores1?.length);
    if (investigadores1?.length > 0) {
      // Llama a la función para obtener los investigadores seleccionados
      const investigadoresSeleccionados = obtenerInvestigadoresSeleccionados();
      console.log('investigadoresSeleccionados:', investigadoresSeleccionados); // Agrega esta línea
      setInvestigadoresSeleccionados(investigadoresSeleccionados);

      // Crea un nuevo array para los datos que deseas agregar
      const nuevosDatos = investigadoresSeleccionados.map((item, index) => ({
        idPersona: item.idPersona,
        rol: investigadores1[index].rol,
        fechaInicio: investigadores1[index].fechaInicio, // Puedes establecer un valor predeterminado aquí si es necesario
      }));

      console.log(nuevosDatos);

      // Llama a append una sola vez con el nuevo array de datos
      append(nuevosDatos);
    }
  }, [investigadores1]);

  if (isLoading) {
    return (
      <Box display='flex' height='calc(100vh - 80px - 16px - 1px - 16px)' width='100%' alignItems='center' justifyContent='center'>
        <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
      </Box>
    );
  }

  return (
    <Card>
      <CardBody>
        <form style={{ width: '100%' }} onSubmit={handleSubmit((values) => onSub(values))}>
          <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <Heading as='h2' size='xl' textAlign='center'>
              Modificar Integrantes
            </Heading>
          </Box>

          {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Agregar los investigadores al proyecto</Text>
              <br />
              <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
                <br />
                <Box display='flex' width='100%'>
                  <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
                    <GenericSelect
                      placeholder='Integrantes...'
                      options={sortedInvestigadores.map((item) => ({
                        value: item.idPersona,
                        label: item.apellido + ', ' + item.nombre,
                      }))}
                      onChange={(e) => {
                        setSelectedOptions(e.target.value);
                      }}
                    />
                  </Box>
                  <Box display='flex' justifyContent='flex-end' width='55%'>
                    <Button colorScheme='blue' variant='outline' mr='5' onClick={agregarInvestigador}>
                      Agregar
                    </Button>
                    <Button colorScheme='blue' variant='outline' mr='5' onClick={console.log(fields)}>
                      Prueba
                    </Button>
                  </Box>
                </Box>
                <br />

                <Tabla
                  columnas={['Apellido y nombre', 'Grupo', 'Rol', 'Eliminar']}
                  datos={investigadoresSeleccionados?.map((item, index) => {
                    return [
                      <div {...register(`investigadores[${index}].idPersona`, { value: item.idPersona })}>{item.apellido + ', ' + item.nombre}</div>,
                      item.gruposinvestigacion.siglas,
                      <GenericSelect
                        placeholder='Rol...'
                        options={roles.map((role) => ({
                          value: role,
                          label: role,
                        }))}
                        onChange={(e) => {
                          const updatedArray = fields[index]; // Copia el array original
                          delete updatedArray.id;
                          update(index, {
                            ...updatedArray, // Copia el objeto existente
                            rol: e.target.value, // Actualiza solo la propiedad "rol"
                          });
                        }}
                        defaultValue={investigadores1[index]?.rol}
                      />,
                      <DeleteIcon
                        cursor={'pointer'}
                        onClick={() => {
                          eliminarInvestigador(item.idPersona, index);
                        }}
                      />,
                    ];
                  })}
                  paginado={false}
                />
              </Box>
              <br />
              <Box
                display='flex'
                width='100%'
                alignItems='center'
                // justifyContent="flex-end"
                justifyContent='center'
              >
                <Button colorScheme='gray' variant='outline' onClick={() => navigate(-1)} mr='5%'>
                  Cancelar
                </Button>
                <Button onClick={openModal} isLoading={isLoadingMutation} colorScheme='blue' variant='outline' ml='5%'>
                  Guardar
                </Button>
                <CustomModal
                  isOpen={isOpen}
                  onClose={closeModal}
                  guardar={true}
                  title='Guardar nuevo PID'
                  content='Se guardara el nuevo PID'
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
