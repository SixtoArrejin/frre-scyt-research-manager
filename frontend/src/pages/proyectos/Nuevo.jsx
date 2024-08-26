import React, { useState, useEffect } from 'react';
import { Card, CardBody, Text, Heading, Box, Button, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { getAllPersonas } from '../../utils/api/personasApi';
import { createProyecto } from '../../utils/api/proyectosApi';
import CustomModal from '../../components/CustomModal';
import { getAllRegionales } from '../../utils/api/regionalesApi';
import { getAllTiposProyectos } from '../../utils/api/tiposProyectosApi';
import GenericInput from '../../components/formControls/GenericInput.jsx';
import GenericSelect from '../../components/formControls/GenericSelect.jsx';
import GenericRadio from '../../components/formControls/GenericRadio.jsx';
import Tabla from '../../components/Tabla.jsx';

const tipoActividad = ['Desarrollo Experimental', 'Investigación Aplicada', 'Investigación Básica'];

const estadoProyecto = [
  'EN TRÁMITE',
  'HOMOLOGADO',
  'REFORMULAR POR EVALUACIÓN EXTERNA',
  'REFORMULAR POR CONSEJO DE PROGRAMAS',
  'DENEGADO POR EVALUACIÓN EXTERNA',
  'DENEGADO POR CONSEJO DE PROGRAMAS',
  'CANCELADO',
];

const roles = ['Director', 'CoDirector', 'Investigador', 'Becario', 'Asesor Cientifico', 'Técnico de Apoyo'];

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

  const { data, isLoading: isLoadingGetGrupos, error } = useQuery('grupos', () => getAllGrupos());

  const { data: dataRegionales, isLoading: isLoadingGetRegionales, error: errorRegionales } = useQuery(['regionales'], () => getAllRegionales());

  const {
    data: dataTiposProyectos,
    isLoading: isLoadingGetTiposProyectos,
    error: errorTiposProyectos,
  } = useQuery(['tiposProyectos'], () => getAllTiposProyectos());

  const grupos = data?.grupos;

  const [investigadores, setInvestigadores] = useState([]);

  const { data: dataInvestigadores } = useQuery(['investigadoresNewPID'], () => getAllPersonas());

  useEffect(() => {
    setInvestigadores(dataInvestigadores?.personas);
  }, [dataInvestigadores]);

  const { mutate, isLoading } = useMutation({
    mutationFn: (formData) => createProyecto(formData),
    onSuccess: () => {
      toast({
        title: 'Nuevo Proyecto',
        description: `Se ha creado el nuevo proyecto exitosamente`,
        status: 'success',
        isClosable: true,
      });
      navigate(-1);
    },
    onError: (error) => {
      const errorMessage = error?.message;
      toast({
        title: 'Error al crear el proyecto',
        description: `${errorMessage || 'Intente nuevamente'}`,
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipoActividad: '',
      fechaInicio: '',
      fechaFin: '',
      denominacion: '',
      completo: false,
      regional: 'Facultad Regional Resistencia',
      convocatoria: '',
      estado: '',
      idDirector: undefined,
      idCodirector: undefined,
      tipoProyecto: '',
      prorrogado: 'false',
      codPid: '',
      programa: '',
      disposicion: '',
      tipo: 'pid',
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control, // Debes proporcionar el objeto control de useForm
    name: 'investigadores', // Nombre del campo de formulario que es un arreglo
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

  const onChangeRadioProrroga = (value) => {
    if (value === 'true') {
      setValue('prorrogado', true);
    } else {
      setValue('prorrogado', false);
    }
  };

  //Aca se agrega lo de la tabla de investigadores
  const [selectedOptions, setSelectedOptions] = useState();
  const [selectedOptionsGrupos, setSelectedOptionsGrupos] = useState();

  const [gruposSeleccionados, setGruposSeleccionados] = useState([]);
  const [investigadoresSeleccionados, setInvestigadoresSeleccionados] = useState([]);
  const [investigadoresDelGrupo, setInvestigadoresDelGrupo] = useState([]);

  const sortedInvestigadores = investigadoresDelGrupo?.sort((a, b) => {
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
    };

    // Verificar si el objeto ya está en investigadoresSeleccionados antes de agregarlo
    const objetoYaAgregado = investigadoresSeleccionados.find((item) => item.idPersona == selectedOptions);

    if (!objetoYaAgregado) {
      append(objetoAgregar);
      setInvestigadoresSeleccionados([...investigadoresSeleccionados, objetoBuscado]);
    }
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
      const investigadoresGrupo = investigadores.filter((investigador) => investigador.idGrupoInvestigacion === objetoBuscado.idGrupoInvestigacion);

      // Actualizar la lista de investigadores seleccionados
      setInvestigadoresDelGrupo([...investigadoresDelGrupo, ...investigadoresGrupo]);

      console.log(investigadoresDelGrupo);
    }
  };

  const eliminarInvestigador = (idAEliminar, index) => {
    // Filtrar los investigadores y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosInvestigadores = investigadoresSeleccionados.filter((item) => item.idPersona !== idAEliminar);

    remove(index);

    // Actualizar investigadoresSeleccionados con el nuevo arreglo
    setInvestigadoresSeleccionados(nuevosInvestigadores);
  };

  const eliminarGrupo = (idAEliminar, index) => {
    // Filtrar los grupos y crear un nuevo arreglo sin el objeto a eliminar
    const nuevosGrupos = gruposSeleccionados.filter((item) => item.idGrupoInvestigacion !== idAEliminar);

    // Filtrar los investigadores para mantener solo los que no pertenecen al grupo a eliminar
    const investigadoresRestantes = investigadoresDelGrupo.filter((investigador) => investigador.idGrupoInvestigacion !== idAEliminar);

    removeG(index);

    // Actualizar investigadoresSeleccionados y gruposSeleccionados con los nuevos arreglos
    setInvestigadoresDelGrupo(investigadoresRestantes);
    console.log(investigadoresRestantes);
    setGruposSeleccionados(nuevosGrupos);
  };

  const onSubmit = (values) => {
    // Convierte el valor de 'prorroga' a booleano antes de enviar
    const modifiedValues = {
      ...values,
      prorrogado: values.prorrogado === 'true',
    };
    console.log(modifiedValues);
    mutate(modifiedValues);
  };

  const PidExterno = useWatch({ control, name: 'tipo' });
  const [estado, setEstado] = useState('');

  return (
    <Card>
      <CardBody>
        <form
          style={{ width: '100%' }}
          // onSubmit={handleSubmit((values) => onSub(values))}
        >
          <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
            <Heading as='h2' size='xl' textAlign='center'>
              Nuevo Proyecto
            </Heading>
            <br />
            <Card width='100%'>
              <CardBody>
                <Text fontSize='md'>Ingrese los datos del proyecto: </Text>
                <br />
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' width='70%' alignItems='center' justifyContent='center' flexDirection='column'>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <Box width={{ base: '100%', md: '20%' }} display='flex' justifyContent='center'>
                        <GenericRadio
                          name='tipo'
                          direction='row'
                          options={[
                            { value: 'pid', label: 'PID' },
                            { value: 'externo', label: 'Externo' },
                          ]}
                          register={register}
                          defaultValue='pid'
                          mb='5vh'
                          width={'100%'}
                        />
                      </Box>
                      {PidExterno === 'pid' && (
                        <GenericInput
                          name='codPid'
                          placeholder='Código PID'
                          register={register}
                          label='Código PID'
                          width={{ base: '100%', md: '30%' }}
                          mb='5vh'
                          isRequired
                        />
                      )}

                      <GenericSelect
                        name='regional'
                        label='Regional asociada'
                        placeholder='Regional...'
                        width={{ base: '100%', md: PidExterno === 'pid' ? '45%' : '75%' }}
                        mb='5vh'
                        isRequired
                        register={register}
                        options={(isLoadingGetRegionales ? ['Cargando...'] : dataRegionales.regionales).map((regional) => ({
                          value: regional,
                          label: regional,
                        }))}
                        errors={errors}
                      />
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        textArea
                        name='denominacion'
                        placeholder='Denominación'
                        register={register}
                        label='Denominación'
                        width={{ base: '100%', md: '100%' }}
                        mb='5vh'
                        isRequired
                      />
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        name='fechaInicio'
                        type='date'
                        register={register}
                        label='Fecha Inicio'
                        width={{ base: '100%', md: '30%' }}
                        mb='5vh'
                        isRequired
                      />

                      <GenericInput
                        name='fechaFin'
                        type='date'
                        register={register}
                        label='Fecha Fin'
                        width={{ base: '100%', md: '30%' }}
                        mb='5vh'
                        isRequired
                      />

                      <GenericInput
                        type='number'
                        name='convocatoria'
                        placeholder='Convocatoria'
                        register={register}
                        label='Convocatoria'
                        width={{ base: '100%', md: '30%' }}
                        mb='5vh'
                        isRequired
                      />
                    </Box>
                    <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                      <GenericInput
                        name='programa'
                        placeholder='Programa'
                        register={register}
                        label='Programa'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                      />

                      <GenericSelect
                        name='tipoProyecto'
                        label='Tipo de proyecto'
                        placeholder='Tipo de proyecto...'
                        width={{ base: '100%', md: '47.5%' }}
                        mb='5vh'
                        isRequired
                        register={register}
                        options={(isLoadingGetTiposProyectos ? ['Cargando...'] : dataTiposProyectos?.tiposProyectos).map((tipo) => ({
                          value: tipo,
                          label: tipo,
                        }))}
                        errors={errors}
                      />
                    </Box>
                    {PidExterno === 'pid' && (
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <GenericSelect
                          name='tipoActividad'
                          label='Tipo de actividad'
                          placeholder='Tipo de actividad...'
                          width={{ base: '100%', md: '30%' }}
                          mb='5vh'
                          isRequired
                          register={register}
                          options={tipoActividad.map((actividad) => ({
                            value: actividad,
                            label: actividad,
                          }))}
                          errors={errors}
                        />

                        <GenericSelect
                          name='estado'
                          label='Estado'
                          placeholder='Estado...'
                          width={{ base: '100%', md: estado === 'HOMOLOGADO' ? '30%' : '65%' }}
                          mb='5vh'
                          isRequired
                          register={register}
                          options={estadoProyecto.map((estado) => ({
                            value: estado,
                            label: estado,
                          }))}
                          errors={errors}
                          onChange={(e) => setEstado(e.target.value)}
                        />

                        {estado === 'HOMOLOGADO' && (
                          <GenericInput
                            name='disposicion'
                            placeholder='Disposición'
                            register={register}
                            label='Disposición'
                            width={{ base: '100%', md: '30%' }}
                            mb='5vh'
                            isRequired={estado === 'HOMOLOGADO'}
                          />
                        )}
                      </Box>
                    )}
                    {PidExterno === 'pid' && (
                      <Box
                        display='flex'
                        flexDirection={{ base: 'column', md: 'row' }}
                        width='100%'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <Box width={{ base: '100%', md: '15%' }} display='flex' justifyContent='center'>
                          <GenericRadio
                            name='prorrogado'
                            label='Prorroga'
                            direction='row'
                            options={[
                              { value: 'true', label: 'Si' },
                              { value: 'false', label: 'No' },
                            ]}
                            register={register}
                            defaultValue='false'
                            errors={errors}
                            mb='5vh'
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* ACA SE AGREGA LA TABLA DE GRUPOS */}
          <br />
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
                  <Box display='flex' justifyContent='flex-end' width='55%'>
                    <Button colorScheme='blue' variant='outline' mr='5' onClick={agregarGrupo}>
                      Agregar
                    </Button>
                  </Box>
                </Box>
                <br />
                <Tabla
                  columnas={['Grupo', 'Eliminar']}
                  datos={gruposSeleccionados?.map((item, index) => [
                    item.siglas,
                    <DeleteIcon
                      cursor={'pointer'}
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
                      isSearchable={true}
                      options={sortedInvestigadores?.map((investigador) => ({
                        value: investigador.idPersona,
                        label: investigador.apellido + ', ' + investigador.nombre,
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
                  </Box>
                </Box>
                <br />

                <Tabla
                  columnas={['Apellido y Nombre', 'Grupo', 'Rol', 'Eliminar']}
                  datos={investigadoresSeleccionados?.map((item, index) => [
                    <div {...register(`investigadores[${index}].idPersona`, { value: item.idPersona })}>{item.apellido + ', ' + item.nombre}</div>,
                    item.gruposinvestigacion.siglas,
                    <GenericSelect
                      placeholder='Rol...'
                      options={roles.map((rol) => ({
                        value: rol,
                        label: rol,
                      }))}
                      onChange={(e) => {
                        update(index, { rol: e.target.value });
                        if (e.target.value === 'CoDirector') {
                          setValue('idCodirector', Number(item.idPersona));
                        }
                        if (e.target.value === 'Director') {
                          setValue('idDirector', Number(item.idPersona));
                        }
                      }}
                    />,
                    <DeleteIcon
                      cursor={'pointer'}
                      onClick={() => {
                        eliminarInvestigador(item.idPersona, index);
                      }}
                    />,
                  ])}
                  paginado={false}
                />
              </Box>
              <br />
              <Box display='flex' width='100%' alignItems='center' justifyContent='center'>
                <Button colorScheme='gray' variant='outline' onClick={() => navigate(-1)} mr='5%'>
                  Cancelar
                </Button>
                <Button onClick={openModal} isLoading={isLoading} colorScheme='blue' variant='outline' ml='5%'>
                  Guardar
                </Button>
                <CustomModal
                  isOpen={isOpen}
                  onClose={closeModal}
                  guardar={true}
                  title='Guardar nuevo PID'
                  content='Se guardara el nuevo Proyecto'
                  onSave={handleSubmit((values) => onSubmit(values))}
                />
              </Box>
            </CardBody>
          </Card>
        </form>
      </CardBody>
    </Card>
  );
}
