import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast, Spinner } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import investigadores from '../../utils/data/investigadores.json';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { useFieldArray, useForm } from 'react-hook-form';
import { updatePID } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import { getProyectoById } from '../../utils/api/proyectosApi';
import GenericSelect from '../../components/formControls/GenericSelect';
import Tabla from '../../components/Tabla';

export default function AgregarGrupo() {
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
  const [grupos1, setGrupos1] = useState([]);
  const [investigadores1, setInvestigadores1] = useState([]);

  const [investigadoresFiltrados, setInvestigadoresFiltrados] = useState([]);

  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const eliminarGrupo = (idAEliminar, index) => {
    // Filtrar los grupos y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosGrupos = gruposSeleccionados.filter((item) => item.idGrupoInvestigacion !== idAEliminar);
    removeG(index);
    setGruposSeleccionados(nuevosGrupos);
  };
  const agregarGrupo = () => {
    // console.log(sortedInvestigadores);
    console.log(selectedOptionsGrupos);
    const objetoBuscado = grupos.find((item) => item.idGrupoInvestigacion == selectedOptionsGrupos);

    const objetoAgregar = {
      idGrupoInvestigacion: objetoBuscado.idGrupoInvestigacion,
    };

    // Verificar si el objeto ya está en gruposSeleccionados antes de agregarlo
    const objetoYaAgregado = gruposSeleccionados.find((item) => item.idGrupoInvestigacion == selectedOptionsGrupos);

    if (!objetoYaAgregado) {
      appendG(objetoAgregar);
      setGruposSeleccionados([...gruposSeleccionados, objetoBuscado]);
    }
  };

  useEffect(() => {
    setGrupos1(dataParticipa?.proyecto.tiene);

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
        title: 'Agregar grupo',
        description: `Se ha agregado el grupo exitosamente`,
        status: 'success',
        isClosable: true,
      });
      // navigate(`/investigadores/5`);
      navigate(-1);
    },
    onError: () => {
      toast({
        title: 'Error al agregar el grupo',
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
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const {
    fields: fieldsGrupos,
    append: appendG,
    remove: removeG,
    update: updateG,
  } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: 'grupos', // Nombre del campo de formulario que es un arreglo
  });

  const [selectedOptionsGrupos, setSelectedOptionsGrupos] = useState();

  const { data: dataGrupos } = useQuery(['grupos-add'], () => getAllGrupos());
  const [grupos, setGrupos] = useState(dataGrupos?.grupos || []);

  const onSub = (values) => {
    console.log(values);
    mutate(values);
  };
  // Obtén los objetos de investigadores que tienen un idPersona en común entre investigadores y investigadores1
  const obtenerGruposSeleccionados = () => {
    const gruposSeleccionados = grupos.filter((grupo) => {
      return grupos1.some((grupo1) => {
        return grupo.idGrupoInvestigacion === grupo1.idGrupoInvestigacion;
      });
    });

    return gruposSeleccionados;
  };

  useEffect(() => {
    console.log(investigadores1?.length);
    if (grupos1?.length > 0) {
      // Llama a la función para obtener los investigadores seleccionados
      const gruposSeleccionados = obtenerGruposSeleccionados();
      console.log('investigadoresSeleccionados:', gruposSeleccionados); // Agrega esta línea
      setGruposSeleccionados(gruposSeleccionados);

      // Crea un nuevo array para los datos que deseas agregar
      const nuevosDatos = gruposSeleccionados.map((item, index) => ({
        idGrupoInvestigacion: item.idGrupoInvestigacion,
      }));

      console.log(nuevosDatos);

      // Llama a append una sola vez con el nuevo array de datos
      appendG(nuevosDatos);
    }
  }, [grupos1]);

  if (isLoading) {
    return (
      <Box display='flex' height='84vh' width='100%' alignItems='center' justifyContent='center'>
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
              Modificar Grupos
            </Heading>
          </Box>

          {/* ACA SE AGREGA LA TABLA DE INVESTIGADORES */}
          <br />

          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Agregar los grupos asociados al proyecto</Text>
              <br />
              <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
                <br />
                <Box display='flex' width='100%'>
                  <Box display='flex' justifyContent='space-between' width='45%' marginLeft='2%'>
                    <GenericSelect
                      placeholder='Grupos...'
                      options={grupos?.map((item) => ({
                        value: item.idGrupoInvestigacion,
                        label: item.siglas,
                      }))}
                      onChange={(e) => {
                        setSelectedOptionsGrupos(e.target.value);
                      }}
                    />
                  </Box>
                  <Box display='flex' justifyContent='flex-end' width='55%'>
                    <Button colorScheme='blue' variant='outline' mr='5' onClick={agregarGrupo}>
                      Agregar
                    </Button>
                  </Box>
                </Box>
                <br />

                <Tabla
                  columnas={['Grupo', 'Eliminar']}
                  datos={gruposSeleccionados?.map((item, index) => {
                    return [
                      <div {...register(`grupos[${index}].idGrupoInvestigacion`, { value: item.idGrupoInvestigacion })}>{item.siglas}</div>,
                      <DeleteIcon
                        cursor={'pointer'}
                        onClick={() => {
                          eliminarGrupo(item.idGrupoInvestigacion, index);
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
                <Button colorScheme='gray' variant='outline' onClick={console.log(fieldsGrupos)} mr='5%'>
                  Prueba
                </Button>
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
                  onSave={handleSubmit((values) => onSub(values))}
                />
              </Box>
            </CardBody>
          </Card>
        </form>
      </CardBody>
    </Card>
  );
}
