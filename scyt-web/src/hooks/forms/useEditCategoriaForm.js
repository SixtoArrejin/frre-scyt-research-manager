import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import * as yup from 'yup';
import { putCategoriaById } from '../../utils/api/categoriasApi';
import { useFormHandler } from '../useFormHandler';
import { formatoFechaISOaAAAAMMDD } from '../../utils/general';

// Schema de validación para editar categoría
const editCategoriaSchema = yup.object({
  tipo: yup
    .string()
    .required('El tipo es requerido')
    .test('tipoCat', 'La categoria debe ser Ministerio o UTN', (val) => val.toLowerCase() === 'ministerio' || val.toLowerCase() === 'utn'),
  categoria: yup.string().required('La categoria es requerida'),
  normativa: yup
    .string()
    .required('La resolución es requerida')
    .matches(/^\d+\/\d+$/, 'El formato de la resolución debe ser \'###/###\''),
  comision: yup.string().required('La comisión es requerida'),
  fecha: yup.string().required('La fecha es requerida'),
});

// Valores por defecto para el formulario
const defaultValues = {
  fecha: '',
  categoria: '',
  comision: '',
  normativa: '',
  tipo: '',
  equiparacion: false,
};

// Constantes para las opciones
export const COMISIONES = [
  'Ingeniería',
  'Educación',
  'Antropología',
  'Ciencias de la Tierra, el Mar y la Atmosfera',
  'Química, Bioquímica y Farmacia',
  'Ciencias Básicas y Aplicadas',
];

export const catUTN = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export const catMIN = ['I', 'II', 'III', 'IV', 'V'];

/**
 * Hook personalizado para manejo de edición de categoría
 * @param {Object} categoria - Categoría a editar
 * @param {Function} onSuccess - Callback de éxito
 * @returns {Object} - Estado y funciones para manejo de edición de categoría
 */
export const useEditCategoriaForm = (categoria, onSuccess) => {
  const queryClient = useQueryClient();

  // Función para limpiar y formatear datos
  const formatData = (formData) => {
    return {
      ...formData,
      equiparacion: formData.equiparacion,
    };
  };

  // Función de envío usando React Query mutation
  const { mutate, isLoading: isLoadingMutation } = useMutation({
    mutationFn: (formData) => putCategoriaById(categoria?.idCategoria, formData),
    onSuccess: () => {
      queryClient.refetchQueries(['persona']);
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  // Función de envío
  const submitCategoria = async(formData) => {
    const cleanedData = formatData(formData);
    return new Promise((resolve, reject) => {
      mutate(cleanedData, {
        onSuccess: (data) => resolve(data),
        onError: (error) => reject(error),
      });
    });
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: editCategoriaSchema,
    defaultValues,
    onSubmit: submitCategoria,
    onSuccess: () => {
      // El callback onSuccess se maneja en la mutation
    },
    successTitle: 'Modificar Categoria',
    successMessage: 'Se ha modificado la categoria exitosamente.',
  });

  // Hook para observar cambios en el tipo de categoría
  const tipoCategoria = useWatch({
    control: form.control,
    name: 'tipo',
  });

  // Resetear valores del formulario cuando cambia la categoría
  useEffect(() => {
    if (categoria) {
      form.reset({
        fecha: formatoFechaISOaAAAAMMDD(categoria.fecha),
        categoria: categoria.categoria,
        comision: categoria.comision,
        normativa: categoria.normativa,
        tipo: categoria.tipo,
        equiparacion: categoria.equiparacion || false,
      });
    }
  }, [categoria, form.reset]);

  // Preparar opciones de categorías según el tipo
  const categoriaOptions = tipoCategoria === 'utn'
    ? catUTN.map((option) => ({ value: option, label: option }))
    : catMIN.map((option) => ({ value: option, label: option }));

  // Preparar opciones de comisiones
  const comisionOptions = COMISIONES.map((comision) => ({
    value: comision,
    label: comision,
  }));

  return {
    ...form,
    tipoCategoria,
    categoriaOptions,
    comisionOptions,
    isLoadingMutation,
  };
};
