import React, { useState } from 'react';
import { Card, CardBody, Text, Box, Button, Heading, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import CustomModal from '../../components/CustomModal';
import GenericInput from '../../components/formControls/GenericInput.jsx';
import GenericSelect from '../../components/formControls/GenericSelect.jsx';
import GenericRadio from '../../components/formControls/GenericRadio.jsx';
import Tabla from '../../components/Tabla.jsx';
import BackButton from '../../components/BackButton';

import { formatoFechaISOaDDMMAAAA } from '../../utils/general.jsx';
import {
  useNuevoProyectoForm,
  tipoActividad,
  estadoProyecto,
  roles,
  tipoProyectosInterinstitucionales,
} from '../../hooks/forms/useNuevoProyectoForm';

export default function NuevoPid() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    grupos,
    dataRegionales,
    dataTiposProyectos,
    isLoadingGetTiposProyectos,
    investigadoresFields,
    sortedInvestigadores,
    gruposSeleccionados,
    institucionesSeleccionadas,
    tipoProyecto: PidExterno,
    prorrogado,
    selectedTipoProyecto,
    estado,
    setSelectedOptions,
    setSelectedOptionsGrupos,
    selectedInstitucion,
    setSelectedInstitucion,
    otraInstitucion,
    setOtraInstitucion,
    setRolSelected,
    fechaSelected,
    setFechaSelected,
    handleCancel,
    handleTipoProyectoChange,
    setEstado,
    agregarInvestigador,
    agregarGrupo,
    agregarInstitucion,
    eliminarInvestigador,
    eliminarGrupo,
    eliminarInstitucion,
    submitHandler,
  } = useNuevoProyectoForm();

  const handleOpenModal = async() => {
    // Trigger validation manually before opening modal
    const isValid = await trigger();
    if (isValid) {
      setIsOpen(true);
    }
  };

  const handleSubmitAndClose = (data) => {
    setIsOpen(false);
    submitHandler(data);
  };

  return (
    <Card>
      <CardBody>
        <form
          style={{ width: '100%' }}
        // onSubmit={handleSubmit((values) => onSub(values))}
        >
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <HStack width='100%' justifyContent='space-between' mb={6}>
              <BackButton to='/proyectos' />
              <Heading as="h2" size="xl" textAlign="center">
                Nuevo Proyecto
              </Heading>
              <Box /> {/* Spacer para centrar el título */}
            </HStack>
            <br />
            <Card width="100%">
              <CardBody>
                <Text fontSize="md" fontWeight="bold">Ingrese los datos del proyecto: </Text>
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
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        width={{ base: '100%', md: '20%' }}
                        display="flex"
                        justifyContent="center"
                        mt="15px"
                      >
                        <GenericRadio
                          name="tipo"
                          direction="row"
                          options={[
                            { value: 'pid', label: 'PID' },
                            { value: 'externo', label: 'Externo' },
                          ]}
                          register={register}
                          defaultValue="pid"
                          mb="5vh"
                          width={'100%'}
                        />
                      </Box>
                      {PidExterno === 'pid' && (
                        <GenericInput
                          name="codPid"
                          placeholder="Código PID"
                          register={register}
                          errors={errors}
                          label="Código PID"
                          width={{ base: '100%', md: '80%' }}
                          mb="5vh"
                          isRequired
                        />
                      )}
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <GenericInput
                        textArea
                        name="denominacion"
                        placeholder="Denominación"
                        register={register}
                        errors={errors}
                        label="Denominación"
                        width={{ base: '100%', md: '100%' }}
                        mb="5vh"
                        isRequired
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <GenericInput
                        textArea
                        name="descripcionBreve"
                        placeholder="Descripción breve del proyecto"
                        register={register}
                        errors={errors}
                        label="Descripción Breve"
                        width={{ base: '100%', md: '100%' }}
                        mb="5vh"
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <GenericInput
                        name="fechaInicio"
                        type="date"
                        register={register}
                        label="Fecha Inicio"
                        width={{ base: '100%', md: '30%' }}
                        mb="5vh"
                      />

                      <GenericInput
                        name="fechaFin"
                        type="date"
                        register={register}
                        label="Fecha Fin"
                        width={{ base: '100%', md: '30%' }}
                        mb="5vh"
                      />

                      <GenericInput
                        type="number"
                        name="convocatoria"
                        placeholder="Convocatoria"
                        register={register}
                        errors={errors}
                        label="Convocatoria"
                        width={{ base: '100%', md: '30%' }}
                        mb="5vh"
                        isRequired
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <GenericInput
                        name="programa"
                        placeholder="Programa"
                        register={register}
                        errors={errors}
                        label="Programa"
                        width={{ base: '100%', md: '47.5%' }}
                        mb="5vh"
                        isRequired
                      />

                      <GenericSelect
                        name="tipoProyecto"
                        label="Tipo de proyecto"
                        placeholder="Tipo de proyecto..."
                        width={{ base: '100%', md: '47.5%' }}
                        mb="5vh"
                        register={register}
                        options={(isLoadingGetTiposProyectos
                          ? ['Cargando...']
                          : (dataTiposProyectos?.tiposProyectos || [])
                        ).map((tipo) => ({
                          value: tipo,
                          label: tipo,
                        }))}
                        errors={errors}
                        onChange={handleTipoProyectoChange}
                        isRequired={PidExterno === 'pid'}
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection={{ base: 'column', md: 'row' }}
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <GenericSelect
                        name="trl"
                        label="Nivel TRL (Madurez Tecnológica)"
                        placeholder="Seleccione TRL..."
                        width={{ base: '100%', md: PidExterno !== 'pid' ? '47.5%' : '100%' }}
                        mb="5vh"
                        register={register}
                        options={[
                          { value: 'TRL 1', label: 'TRL 1 - Principios básicos observados' },
                          { value: 'TRL 2', label: 'TRL 2 - Concepto tecnológico formulado' },
                          { value: 'TRL 3', label: 'TRL 3 - Prueba de concepto experimental' },
                          { value: 'TRL 4', label: 'TRL 4 - Validación en laboratorio' },
                          { value: 'TRL 5', label: 'TRL 5 - Validación en entorno relevante' },
                          { value: 'TRL 6', label: 'TRL 6 - Demostración en entorno relevante' },
                          { value: 'TRL 7', label: 'TRL 7 - Demostración de sistema operacional' },
                          { value: 'TRL 8', label: 'TRL 8 - Sistema completo y calificado' },
                          { value: 'TRL 9', label: 'TRL 9 - Sistema probado operacional' },
                        ]}
                        errors={errors}
                      />
                      {PidExterno !== 'pid' && (
                        <GenericInput
                          name="empresaInstitucion"
                          placeholder="Empresa/Institución"
                          register={register}
                          label="Empresa/Institución"
                          width={{ base: '100%', md: '47.5%' }}
                          mb="5vh"
                        />
                      )}
                    </Box>
                    {PidExterno === 'pid' && (
                      <Box
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                        width="100%"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <GenericSelect
                          name="tipoActividad"
                          label="Tipo de actividad"
                          placeholder="Tipo de actividad..."
                          width={{ base: '100%', md: '30%' }}
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
                            base: '100%',
                            md: estado === 'HOMOLOGADO' ? '30%' : '65%',
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

                        {estado === 'HOMOLOGADO' && (
                          <GenericInput
                            name="disposicion"
                            placeholder="Disposición"
                            register={register}
                            label="Disposición"
                            width={{ base: '100%', md: '30%' }}
                            mb="5vh"
                            isRequired={estado === 'HOMOLOGADO'}
                            errors={errors}
                          />
                        )}
                      </Box>
                    )}
                      {PidExterno === 'pid' && (
                        <Box
                          width={{ base: '100%', md: '52.5%' }}
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
                              { value: 'true', label: 'Si' },
                              { value: 'false', label: 'No' },
                            ]}
                            register={register}
                            defaultValue={prorrogado}
                            errors={errors}
                          />
                        </Box>
                      )}
                      {PidExterno === 'pid' &&
                        prorrogado === 'true' && (
                        <Box
                          display="flex"
                          flexDirection={{ base: 'column', md: 'row' }}
                          width="100%"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <GenericInput
                            name="nuevaFechaFin"
                            type="date"
                            register={register}
                            errors={errors}
                            label="Nueva Fecha Finalización"
                            width={{
                              base: '100%',
                              md: estado === 'HOMOLOGADO' ? '46.25%' : '100%',
                            }}
                            mb="5vh"
                            isRequired={
                              PidExterno === 'pid' &&
                                prorrogado === 'true'
                            }
                          />
                          {estado === 'HOMOLOGADO' && (
                            <GenericInput
                              name="nuevaDisposicion"
                              placeholder="Nueva Disposición"
                              register={register}
                              errors={errors}
                              label="Nueva Disposición"
                              width={{ base: '100%', md: '46.25%' }}
                              mb="5vh"
                              isRequired={
                                estado === 'HOMOLOGADO' &&
                                  PidExterno === 'pid' &&
                                  prorrogado === 'true'
                              }
                            />
                          )}
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
          <Card width="100%">
            <CardBody>
              <Text fontSize="md" fontWeight="bold">
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
                  columnas={['Grupo', 'Eliminar']}
                  datos={gruposSeleccionados?.map((item, index) => [
                    item.siglas,
                    <DeleteIcon
                      key={item.idGrupoInvestigacion}
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
          {gruposSeleccionados.length > 0 && (
            <Card width="100%">
              <CardBody>
                <Text fontSize="md" fontWeight="bold">
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
                            investigador.apellido + ', ' + investigador.nombre,
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
                      'Apellido y Nombre',
                      'Grupo',
                      'Rol',
                      'Fecha de Inicio',
                      'Eliminar',
                    ]}
                    datos={investigadoresFields?.map((item, index) => [
                      <div key={`nombre-${item.idPersona}`}>
                        {item.persona.apellido} {item.persona.nombre}
                      </div>,
                      <div key={`grupo-${item.persona.gruposinvestigacion.siglas}`}>{item.persona.gruposinvestigacion.siglas}</div>,
                      <div key={`rol-${item.idPersona}`}>{item.rol}</div>,
                      <div key={`fecha-${item.idPersona}`}>{formatoFechaISOaDDMMAAAA(item.fechaInicio)}</div>,
                      <DeleteIcon
                        key={`delete-${item.idPersona}`}
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
              </CardBody>
            </Card>
          )}
          {tipoProyectosInterinstitucionales?.includes(selectedTipoProyecto) && (
            <Card width="100%">
              <CardBody>
                <Text fontSize="md" fontWeight="bold">Agregar instituciones asociadas</Text>
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
                      gap="2%"
                    >
                      <GenericSelect
                        placeholder="Instituciones..."
                        isSearchable={true}
                        options={[
                          ...(dataRegionales?.regionales?.map((regional) => ({
                            value: regional,
                            label: regional,
                          })) || []),
                          { value: 'Otro', label: 'Otro' },
                        ]}
                        value={selectedInstitucion}
                        onChange={(e) => {
                          setSelectedInstitucion(e.target.value);
                        }}
                      />
                      {selectedInstitucion === 'Otro' && (
                        <GenericInput
                          placeholder="Nombre de la institución..."
                          value={otraInstitucion}
                          onChange={(e) => {
                            setOtraInstitucion(e.target.value);
                          }}
                        />
                      )}
                    </Box>
                    <Box display="flex" justifyContent="flex-end" width="55%">
                      <Button
                        colorScheme="blue"
                        variant="outline"
                        mr="5"
                        onClick={agregarInstitucion}
                      >
                        Agregar
                      </Button>
                    </Box>
                  </Box>
                  <br />

                  <Tabla
                    columnas={['Institución', 'Eliminar']}
                    datos={institucionesSeleccionadas?.map((item, index) => [
                      item,
                      <DeleteIcon
                        key={`delete-institucion-${item}-${index}`}
                        cursor={'pointer'}
                        onClick={() => {
                          eliminarInstitucion(item);
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
              onClick={handleCancel}
              mr="5%"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleOpenModal}
              isLoading={isSubmitting}
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
              onSave={handleSubmit(handleSubmitAndClose)}
            />
          </Box>
        </form>
      </CardBody>
    </Card>
  );
}
