import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Text,
  Heading,
  Box,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { getAllGrupos } from '../../utils/api/gruposApi';
import { useForm } from 'react-hook-form';
import { createPersona } from '../../utils/api/personasApi';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomModal from '../../components/CustomModal';
import GenericSelect from '../../components/formControls/GenericSelect';
import GenericInput from '../../components/formControls/GenericInput';

const schema = yup.object({
  nombre: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder los 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El nombre solo puede contener letras y espacios')
    .trim(),
  apellido: yup
    .string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder los 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, 'El apellido solo puede contener letras y espacios')
    .trim(),
  dni: yup
    .string()
    .required('El DNI es requerido')
    .matches(/^\d+$/, 'El DNI solo puede contener números')
    .test('dni-length', 'El DNI debe tener exactamente entre 7 y 8 dígitos', (value) => {
      if (!value) return false;
      const cleanValue = value.toString().replace(/\D/g, '');
      return cleanValue.length >= 7 && cleanValue.length <= 8;
    })
    .test('dni-range', 'El DNI debe ser un número válido', (value) => {
      if (!value) return false;
      const numericValue = parseInt(value, 10);
      return numericValue >= 1000000 && numericValue <= 99999999;
    }),
  idGrupoInvestigacion: yup
    .mixed()
    .required('Debe seleccionar un grupo de investigación')
    .test('is-valid-group', 'Debe seleccionar un grupo válido', (value) => {
      // Si el valor está vacío o es null/undefined, el required ya lo maneja
      if (!value || value === '') return false;
      // Verificar que sea un número válido mayor a 0
      const numValue = parseInt(value, 10);
      return !isNaN(numValue) && numValue > 0;
    }),
});

export default function NuevoInvestigador() {
  /* Usestate para el modal */
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const openModal = () => {
    setSubmitError(null); // Limpiar errores previos
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSubmitError(null);
  };

  const toast = useToast();
  const navigate = useNavigate();

  const { data: gruposData, isLoading: gruposLoading, error: gruposError } = useQuery(
    'grupos',
    getAllGrupos,
    {
      onError: (error) => {
        console.error('Error al cargar grupos:', error);
        toast({
          title: 'Error al cargar grupos',
          description: 'No se pudieron cargar los grupos de investigación. Intente recargar la página.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      },
      retry: 2,
      retryDelay: 1000,
    },
  );

  const { mutate } = useMutation({
    mutationFn: (formData) => {
      // Limpiar y formatear los datos antes de enviar
      const cleanedData = {
        ...formData,
        nombre: formData.nombre?.trim(),
        apellido: formData.apellido?.trim(),
        dni: formData.dni && formData.dni !== '' ? parseInt(formData.dni, 10) : null,
        idGrupoInvestigacion: formData.idGrupoInvestigacion && formData.idGrupoInvestigacion !== '' ? parseInt(formData.idGrupoInvestigacion, 10) : null,
      };

      // Validar que los datos requeridos estén presentes
      if (!cleanedData.nombre || !cleanedData.apellido || !cleanedData.dni || !cleanedData.idGrupoInvestigacion) {
        throw new Error('Todos los campos son requeridos');
      }

      return createPersona(cleanedData);
    },
    onSuccess: (data) => {
      toast({
        title: 'Investigador creado exitosamente',
        description: `Se ha creado el investigador ${data?.nombre || ''} ${data?.apellido || ''} correctamente`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      navigate(-1);
    },
    onError: (error) => {
      console.error('Error al crear investigador:', error);

      let errorMessage = 'Ha ocurrido un error inesperado. Intente nuevamente.';
      let errorTitle = 'Error al crear investigador';

      // Manejo específico de errores según el tipo de respuesta
      if (error?.response?.data) {
        const { status, data: errorData } = error.response;

        switch (status) {
        case 400:
          errorTitle = 'Datos inválidos';
          if (errorData?.message?.includes('DNI')) {
            errorMessage = 'El DNI ingresado ya existe o no es válido.';
          } else if (errorData?.message?.includes('grupo')) {
            errorMessage = 'El grupo de investigación seleccionado no es válido.';
          } else {
            errorMessage = errorData?.message || 'Los datos ingresados no son válidos.';
          }
          break;
        case 409:
          errorTitle = 'Conflicto de datos';
          errorMessage = 'Ya existe un investigador con el mismo DNI.';
          break;
        case 500:
          errorTitle = 'Error del servidor';
          errorMessage = 'Error interno del servidor. Contacte al administrador.';
          break;
        case 503:
          errorTitle = 'Servicio no disponible';
          errorMessage = 'El servicio no está disponible temporalmente. Intente más tarde.';
          break;
        default:
          errorMessage = errorData?.message || errorMessage;
        }
      } else if (error?.message) {
        if (error.message.includes('Network')) {
          errorTitle = 'Error de conexión';
          errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
        } else {
          errorMessage = error.message;
        }
      }

      setSubmitError({ title: errorTitle, message: errorMessage });

      toast({
        title: errorTitle,
        description: errorMessage,
        status: 'error',
        duration: 6000,
        isClosable: true,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formIsSubmitting },
    reset,
    clearErrors,
  } = useForm({
    defaultValues: {
      nombre: '',
      apellido: '',
      dni: '',
      idGrupoInvestigacion: '',
      activo: true,
    },
    resolver: yupResolver(schema),
    mode: 'onBlur', // Validación al perder el foco (menos intrusiva)
  });

  // Función para limpiar el formulario y errores
  const handleCancel = () => {
    reset();
    clearErrors();
    setSubmitError(null);
    navigate(-1);
  };

  // Función para manejar el envío del formulario
  const onSubmit = (data) => {
    setSubmitError(null);
    clearErrors();
    closeModal(); // Cerrar el modal al enviar
    mutate(data);
  };

  // Función para validar antes de abrir el modal
  const handleOpenModal = () => {
    handleSubmit(() => {
      setSubmitError(null);
      openModal();
    }, (errors) => {
      console.log('Errores de validación:', errors);
    })();
  };

  return (
    <Card>
      <CardBody>
        <Box display='flex' flexDirection='column' width='100%' alignItems='center' justifyContent='center'>
          <Heading as='h2' size='xl' textAlign='center'>
            Nuevo Investigador
          </Heading>

          <br />
          <br />
          <Card width='100%'>
            <CardBody>
              <Text fontSize='md'>Ingrese los datos del investigador</Text>
              <br />
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box display='flex' width='100%' alignItems='center' justifyContent='center' flexDirection='column'>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        name='apellido'
                        label='Apellido'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        name='nombre'
                        label='Nombre'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>
                  </Box>
                  <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} width='100%' alignItems='center' justifyContent='space-between'>
                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericInput
                        type='number'
                        name='dni'
                        label='DNI'
                        register={register}
                        errors={errors}
                        width={{ base: '100%', md: '50%' }}
                        isRequired
                        mb='5vh'
                      />
                    </Box>

                    <Box display='flex' flexDirection='column' width='50%' alignItems='center' justifyContent='center'>
                      <GenericSelect
                        name='idGrupoInvestigacion'
                        label='Grupo'
                        placeholder='Seleccione un grupo...'
                        width={{ base: '100%', md: '50%' }}
                        mb='5vh'
                        isRequired
                        register={register}
                        options={gruposData?.grupos?.map((grupo) => ({
                          value: grupo.idGrupoInvestigacion,
                          label: grupo.siglas,
                        })) || []}
                        errors={errors}
                        isDisabled={gruposLoading || !!gruposError}
                      />
                    </Box>
                  </Box>

                  {/* Mostrar errores de carga de grupos */}
                  {gruposError && (
                    <Box width='100%' mb={4}>
                      <Alert status='error'>
                        <AlertIcon />
                        <Box flex='1'>
                          <AlertTitle mr={2}>Error al cargar grupos:</AlertTitle>
                          <AlertDescription>
                            No se pudieron cargar los grupos de investigación. Intente recargar la página.
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </Box>
                  )}

                  {/* Mostrar errores de envío */}
                  {submitError && (
                    <Box width='100%' mb={4}>
                      <Alert status='error'>
                        <AlertIcon />
                        <Box flex='1'>
                          <AlertTitle mr={2}>{submitError.title}</AlertTitle>
                          <AlertDescription>{submitError.message}</AlertDescription>
                        </Box>
                      </Alert>
                    </Box>
                  )}

                  <Box display='flex' width='90%' alignItems='center' justifyContent='flex-end'>
                    <Button colorScheme='gray' variant='outline' onClick={handleCancel} mr='3%'>
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleOpenModal}
                      isLoading={formIsSubmitting}
                      colorScheme='blue'
                      variant='outline'
                      isDisabled={gruposLoading || !!gruposError}
                    >
                      Guardar
                    </Button>
                    <CustomModal
                      isOpen={isOpen}
                      onClose={closeModal}
                      guardar={true}
                      title='Guardar nuevo investigador'
                      content='¿Está seguro que desea guardar el nuevo investigador?'
                      onSave={handleSubmit(onSubmit)}
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
