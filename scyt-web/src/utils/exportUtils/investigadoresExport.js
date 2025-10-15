import { getCategoriaMasActual } from '../general';

/**
 * Configuración de filtros y columnas para la exportación de investigadores
 * @param {Array} grupos - Lista de grupos de investigación disponibles
 * @param {Array} categorias - Lista de categorías disponibles
 * @returns {Object} Configuración de filtros y columnas
 */
export const getInvestigadoresExportConfig = (grupos = [], categorias = []) => {
  return {
    filters: [
      {
        key: 'estado',
        label: 'Estado del Investigador',
        type: 'select',
        options: [
          { value: 'activo', label: 'Solo Activos' },
          { value: 'inactivo', label: 'Solo Inactivos' },
        ],
      },
      {
        key: 'grupo',
        label: 'Grupo de Investigación',
        type: 'select',
        options: grupos.map((grupo) => ({
          value: grupo.siglas,
          label: grupo.siglas + ' - ' + grupo.nombre,
        })),
      },
      {
        key: 'categoriaUTN',
        label: 'Categoría UTN',
        type: 'select',
        options: [
          { value: 'I', label: 'Categoría I' },
          { value: 'II', label: 'Categoría II' },
          { value: 'III', label: 'Categoría III' },
          { value: 'IV', label: 'Categoría IV' },
          { value: 'V', label: 'Categoría V' },
        ],
      },
      {
        key: 'categoriaMIN',
        label: 'Categoría Ministerio',
        type: 'select',
        options: [
          { value: 'I', label: 'Categoría I' },
          { value: 'II', label: 'Categoría II' },
          { value: 'III', label: 'Categoría III' },
          { value: 'IV', label: 'Categoría IV' },
          { value: 'V', label: 'Categoría V' },
        ],
      },
    ],
    columns: [
      { key: 'apellido', label: 'Apellido' },
      { key: 'nombre', label: 'Nombre' },
      { key: 'estado', label: 'Estado' },
      { key: 'grupo', label: 'Grupo de Investigación' },
      { key: 'categoriaUTN', label: 'Categoría UTN' },
      { key: 'categoriaMIN', label: 'Categoría Ministerio' },
      { key: 'email', label: 'Email' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'dni', label: 'DNI' },
    ],
  };
};

/**
 * Filtra los investigadores según los filtros seleccionados
 * @param {Array} investigadores - Lista completa de investigadores
 * @param {Object} filters - Filtros seleccionados
 * @returns {Array} Investigadores filtrados
 */
export const filterInvestigadores = (investigadores, filters) => {
  if (!investigadores || investigadores.length === 0) return [];

  return investigadores.filter((investigador) => {
    // Filtro por estado
    if (filters.estado) {
      const isActivo = investigador.activo;
      if (filters.estado === 'activo' && !isActivo) return false;
      if (filters.estado === 'inactivo' && isActivo) return false;
    }

    // Filtro por grupo
    if (filters.grupo && investigador.gruposinvestigacion?.siglas !== filters.grupo) {
      return false;
    }

    // Filtro por categoría UTN
    if (filters.categoriaUTN) {
      const categoriaUTN = getCategoriaMasActual(investigador.categorias, 'utn');
      if (!categoriaUTN || categoriaUTN.categoria !== filters.categoriaUTN) {
        return false;
      }
    }

    // Filtro por categoría Ministerio
    if (filters.categoriaMIN) {
      const categoriaMIN = getCategoriaMasActual(investigador.categorias, 'ministerio');
      if (!categoriaMIN || categoriaMIN.categoria !== filters.categoriaMIN) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Prepara los datos de investigadores para exportación a Excel
 * @param {Array} investigadores - Lista de investigadores a exportar
 * @param {Array} selectedColumns - Columnas seleccionadas para exportar
 * @returns {Array} Datos formateados para Excel
 */
export const prepareInvestigadoresForExport = (investigadores, selectedColumns) => {
  if (!investigadores || investigadores.length === 0) return [];

  const allColumns = [
    'apellido',
    'nombre',
    'estado',
    'grupo',
    'categoriaUTN',
    'categoriaMIN',
    'email',
    'telefono',
    'dni',
  ];

  const columnsToExport = selectedColumns && selectedColumns.length > 0 ? selectedColumns : allColumns;

  return investigadores.map((investigador) => {
    const categoriaUTN = getCategoriaMasActual(investigador.categorias, 'utn');
    const categoriaMIN = getCategoriaMasActual(investigador.categorias, 'ministerio');

    const row = {};

    if (columnsToExport.includes('apellido')) {
      row['Apellido'] = investigador.apellido || '';
    }
    if (columnsToExport.includes('nombre')) {
      row['Nombre'] = investigador.nombre || '';
    }
    if (columnsToExport.includes('estado')) {
      row['Estado'] = investigador.activo ? 'Activo' : 'Inactivo';
    }
    if (columnsToExport.includes('grupo')) {
      row['Grupo de Investigación'] = investigador.gruposinvestigacion?.siglas || '';
    }
    if (columnsToExport.includes('categoriaUTN')) {
      row['Categoría UTN'] = categoriaUTN ? categoriaUTN.categoria : '-';
    }
    if (columnsToExport.includes('categoriaMIN')) {
      row['Categoría Ministerio'] = categoriaMIN ? categoriaMIN.categoria : '-';
    }
    if (columnsToExport.includes('email')) {
      row['Email'] = investigador.email || '';
    }
    if (columnsToExport.includes('telefono')) {
      row['Teléfono'] = investigador.telefono || '';
    }
    if (columnsToExport.includes('dni')) {
      row['DNI'] = investigador.dni || '';
    }

    return row;
  });
};
