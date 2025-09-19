import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { createCategoria } from '../../utils/api/categoriasApi';
import { useFormHandler } from '../useFormHandler';

// Schema de validación para nueva categoría
const nuevaCategoriaSchema = yup.object({
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
  tipo: 'ministerio',
  equiparacion: false,
  categoria: '',
  fecha: '',
  normativa: '',
  comision: '',
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
 * Hook personalizado para manejo de nueva categoría
 * @returns {Object} - Estado y funciones para manejo de nueva categoría
 */
export const useNuevaCategoriaForm = () => {
  const navigate = useNavigate();
  const { idPersona } = useParams();

  // Función para limpiar y formatear datos
  const formatData = (formData) => {
    return {
      ...formData,
      idPersona: parseInt(idPersona),
      equiparacion: formData.equiparacion,
    };
  };

  // Función de envío
  const submitCategoria = async(formData) => {
    const cleanedData = formatData(formData);
    return await createCategoria(cleanedData);
  };

  // Configuración del formulario
  const form = useFormHandler({
    schema: nuevaCategoriaSchema,
    defaultValues,
    onSubmit: submitCategoria,
    onSuccess: () => navigate(`/investigadores/${idPersona}`),
    successTitle: 'Nueva categoria',
    successMessage: 'Categoria creada exitosamente.',
  });

  // Hook para observar cambios en el tipo de categoría
  const tipoCategoriaSeleccionada = useWatch({
    control: form.control,
    name: 'tipo',
  });

  // Resetear categoría cuando cambia el tipo
  useEffect(() => {
    if (tipoCategoriaSeleccionada) {
      form.setValue('categoria', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipoCategoriaSeleccionada]);

  // Función para cancelar
  const handleCancel = () => {
    form.resetForm();
    navigate(-1);
  };

  // Preparar opciones de categorías según el tipo
  const categoriaOptions = tipoCategoriaSeleccionada === 'utn'
    ? catUTN.map((option) => ({ value: option, label: option }))
    : catMIN.map((option) => ({ value: option, label: option }));

  // Preparar opciones de comisiones
  const comisionOptions = COMISIONES.map((comision) => ({
    value: comision,
    label: comision,
  }));

  return {
    ...form,
    tipoCategoriaSeleccionada,
    categoriaOptions,
    comisionOptions,
    handleCancel,
  };
};
