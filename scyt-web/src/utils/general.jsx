export function formatoFechaISOaDDMMAAAA(fechaISO) {
  const fechaObjeto = new Date(fechaISO);
  const dia = String(fechaObjeto.getUTCDate()).padStart(2, '0');
  const mes = String(fechaObjeto.getUTCMonth() + 1).padStart(2, '0');
  const año = fechaObjeto.getUTCFullYear();
  return `${dia}/${mes}/${año}`;
}

export function formatoFechaISOaAAAAMMDD(fechaISO) {
  const fechaObjeto = new Date(fechaISO);
  const dia = String(fechaObjeto.getDate() + 1).padStart(2, '0');
  const mes = String(fechaObjeto.getMonth() + 1).padStart(2, '0');
  const año = fechaObjeto.getFullYear();
  return `${año}-${mes}-${dia}`;
}

export function getCategoriaMasActual(categorias, tipo) {
  // Filtrar solo las categorías del tipo deseado
  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.tipo === tipo,
  );

  // Encontrar la categoría con la fecha más actual
  const categoriaMasActual = categoriasFiltradas.reduce((actual, categoria) => {
    if (!actual) {
      return categoria;
    } else {
      const fechaActual = new Date(actual.fecha);
      const fechaCategoria = new Date(categoria.fecha);
      return fechaCategoria > fechaActual ? categoria : actual;
    }
  }, null);

  return categoriaMasActual;
}

export function convertirFechaDDMMAAAAaDate(fechaStr) {
  const [dia, mes, año] = fechaStr.split('/').map(Number);
  return new Date(año, mes - 1, dia);
}

export function sumarMeses(fecha, meses) {
  const fechaInicio = new Date(fecha); // Convertir la fecha ISO en objeto Date
  fechaInicio.setMonth(fechaInicio.getMonth() + meses); // Sumar los meses
  return fechaInicio;
}

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
