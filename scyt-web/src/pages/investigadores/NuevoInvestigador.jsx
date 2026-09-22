import React, { useState } from 'react';
import { Box, Text, Switch, FormControl } from '@chakra-ui/react';
import { useNuevoInvestigadorForm } from '../../hooks/forms/useNuevoInvestigadorForm';
import FormLayout from '../../components/FormLayout';
import ErrorAlert from '../../components/ErrorAlert';
import FormButtons from '../../components/FormButtons';
import CustomModal from '../../components/CustomModal';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericInput from '../../components/formControls/GenericInput';
import { TIPOS_BECARIO } from '../../config/becarios';

// Componente visual para switches con la misma altura y estilo flotante que GenericInput
const FloatingSwitch = ({
  label,
  isChecked,
  onChange,
  leftText = 'No',
  rightText = 'Sí',
  colorScheme = 'blue',
  width = { base: '100%', md: '48%' },
}) => (
  <FormControl width={width}>
    <Box
      position='relative'
      height='40px'
      border='1px solid'
      borderColor='gray.200'
      borderRadius='md'
      display='flex'
      alignItems='center'
      px={4}
      bg='white'
      _hover={{ borderColor: 'gray.300' }}
      transition='border-color 0.2s'
    >
      <Text
        position='absolute'
        top='-10px'
        left='10px'
        bg='white'
        px={1}
        fontSize='xs'
        color='gray.600'
        zIndex={2}
      >
        {label}
      </Text>
      <Switch
        isChecked={isChecked}
        onChange={onChange}
        colorScheme={colorScheme}
        size='md'
      />
      <Text
        ml={3}
        fontSize='sm'
        fontWeight='medium'
        color={isChecked ? `${colorScheme}.600` : 'gray.600'}
      >
        {isChecked ? rightText : leftText}
      </Text>
    </Box>
  </FormControl>
);

export default function NuevoInvestigador() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    error,
    gruposOptions,
    gruposLoading,
    gruposError,
    handleCancel,
    submitHandler,
    clearError,
  } = useNuevoInvestigadorForm();

  const openModal = () => {
    clearError();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    handleSubmit(
      () => {
        clearError();
        openModal();
      },
      (validationErrors) => {
        console.log('Errores de validación:', validationErrors);
      }
    )();
  };

  const onSubmit = (data) => {
    closeModal();
    submitHandler(data);
  };

  const esBecario = watch('esBecario');
  const tienePosgrado = watch('tienePosgrado');
  const tipoBecario = watch('tipoBecario');
  const nivelPosgrado = watch('nivelPosgrado');

  return (
    <FormLayout
      title='Nuevo Investigador'
      description='Ingrese los datos del nuevo investigador'
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Box
          display='flex'
          flexDirection='column'
          width={{ base: '100%', md: '90%', lg: '80%' }}
          maxW='860px'
          mx='auto'
          py={2}
        >
          {/* Fila 1: Apellido y Nombre */}
          <Box
            display='flex'
            flexDirection={{ base: 'column', md: 'row' }}
            width='100%'
            alignItems='flex-start'
            justifyContent='space-between'
            gap={{ base: 4, md: '4%' }}
            mb={6}
          >
            <GenericInput
              name='apellido'
              label='Apellido'
              placeholder='Apellido'
              register={register}
              errors={errors}
              width={{ base: '100%', md: '48%' }}
              isRequired
            />
            <GenericInput
              name='nombre'
              label='Nombre'
              placeholder='Nombre'
              register={register}
              errors={errors}
              width={{ base: '100%', md: '48%' }}
              isRequired
            />
          </Box>

          {/* Fila 2: DNI y Legajo */}
          <Box
            display='flex'
            flexDirection={{ base: 'column', md: 'row' }}
            width='100%'
            alignItems='flex-start'
            justifyContent='space-between'
            gap={{ base: 4, md: '4%' }}
            mb={6}
          >
            <GenericInput
              type='number'
              name='dni'
              label='DNI'
              placeholder='DNI'
              register={register}
              errors={errors}
              width={{ base: '100%', md: '48%' }}
              isRequired
            />
            <GenericInput
              name='legajo'
              type='number'
              label='Legajo'
              placeholder='Legajo'
              register={register}
              errors={errors}
              width={{ base: '100%', md: '48%' }}
            />
          </Box>

          {/* Fila 3: Grupo y Fecha de Ingreso */}
          <Box
            display='flex'
            flexDirection={{ base: 'column', md: 'row' }}
            width='100%'
            alignItems='flex-start'
            justifyContent='space-between'
            gap={{ base: 4, md: '4%' }}
            mb={6}
          >
            <GenericSelect
              name='idGrupoInvestigacion'
              label='Grupo'
              placeholder='Seleccione un grupo...'
              width={{ base: '100%', md: '48%' }}
              isRequired
              register={register}
              options={gruposOptions}
              errors={errors}
              isDisabled={gruposLoading || !!gruposError}
            />
            <GenericInput
              type='date'
              name='fechaIngresoGrupo'
              label='Fecha de Ingreso al Grupo'
              register={register}
              errors={errors}
              width={{ base: '100%', md: '48%' }}
            />
          </Box>

          {/* Fila 4: ORCID */}
          <Box
            display='flex'
            flexDirection={{ base: 'column', md: 'row' }}
            width='100%'
            alignItems='flex-start'
            justifyContent='space-between'
            mb={6}
          >
            <GenericInput
              name='orcid'
              label='Número ORCID'
              placeholder='0000-0000-0000-0000'
              register={register}
              errors={errors}
              width='100%'
            />
          </Box>

          {/* Fila 5: Tipo de Investigador y Clasificación (Posgrado o Tipo de Becario) */}
          <Box
            display='flex'
            flexDirection={{ base: 'column', md: 'row' }}
            width='100%'
            alignItems='flex-start'
            justifyContent='space-between'
            gap={{ base: 4, md: '4%' }}
            mb={6}
          >
            <FloatingSwitch
              label='Tipo de Investigador'
              isChecked={esBecario}
              onChange={(e) => {
                setValue('esBecario', e.target.checked);
              }}
              leftText='Investigador'
              rightText='Becario'
              colorScheme='blue'
            />

            {esBecario ? (
              <GenericSelect
                name='tipoBecario'
                label='Tipo de Becario'
                placeholder='Seleccione el tipo...'
                width={{ base: '100%', md: '48%' }}
                isRequired
                register={register}
                options={TIPOS_BECARIO}
                errors={errors}
                onChange={(e) => {
                  setValue('tipoBecario', e.target.value);
                }}
              />
            ) : (
              <FloatingSwitch
                label='¿Tiene Posgrado?'
                isChecked={tienePosgrado}
                onChange={(e) => {
                  setValue('tienePosgrado', e.target.checked);
                }}
                leftText='No'
                rightText='Sí'
                colorScheme='blue'
              />
            )}
          </Box>

          {/* Fila 6 Condicional: Becario (Resolución) o Investigador (Nivel de Posgrado) */}
          {esBecario && (tipoBecario === 'BAR' || tipoBecario === 'BINID') && (
            <Box
              display='flex'
              flexDirection={{ base: 'column', md: 'row' }}
              width='100%'
              alignItems='flex-start'
              justifyContent='space-between'
              mb={6}
            >
              <GenericInput
                name='resolucionBeca'
                label='Número de Resolución'
                placeholder='Número de resolución (opcional)'
                register={register}
                errors={errors}
                width='100%'
              />
            </Box>
          )}

          {!esBecario && tienePosgrado && (
            <Box
              display='flex'
              flexDirection={{ base: 'column', md: 'row' }}
              width='100%'
              alignItems='flex-start'
              justifyContent='space-between'
              gap={{ base: 4, md: '4%' }}
              mb={6}
            >
              <GenericSelect
                name='nivelPosgrado'
                label='Nivel de Posgrado'
                placeholder='Seleccione el nivel...'
                register={register}
                options={[
                  { value: 'doctorado', label: 'Doctorado' },
                  { value: 'maestria', label: 'Maestría' },
                  { value: 'especializacion', label: 'Especialización' },
                  { value: 'diplomatura', label: 'Diplomatura' },
                  { value: 'otro', label: 'Otro' },
                ]}
                errors={errors}
                width={nivelPosgrado === 'otro' ? { base: '100%', md: '48%' } : '100%'}
                isRequired
                onChange={(e) => {
                  setValue('nivelPosgrado', e.target.value);
                }}
              />

              {nivelPosgrado === 'otro' && (
                <GenericInput
                  name='otroPosgrado'
                  label='Especifique el Posgrado'
                  placeholder='Especifique...'
                  register={register}
                  errors={errors}
                  width={{ base: '100%', md: '48%' }}
                  isRequired
                />
              )}
            </Box>
          )}

          {/* Mostrar errores */}
          <ErrorAlert
            error={
              gruposError && {
                title: 'Error al cargar grupos',
                message: 'No se pudieron cargar los grupos de investigación. Intente recargar la página.',
              }
            }
          />
          <ErrorAlert error={error} />

          {/* Botones */}
          <FormButtons
            onCancel={handleCancel}
            onSubmit={handleOpenModal}
            isLoading={isSubmitting}
            isDisabled={gruposLoading || !!gruposError}
          />

          {/* Modal de confirmación */}
          <CustomModal
            isOpen={isOpen}
            onClose={closeModal}
            guardar={true}
            title='Guardar nuevo investigador'
            content='¿Está seguro que desea guardar el nuevo investigador?'
            onSave={handleSubmit(onSubmit)}
          />
        </Box>
      </form>
    </FormLayout>
  );
}
