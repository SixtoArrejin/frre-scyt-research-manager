import { formatoFechaISOaDDMMAAAA } from '../general';

/**
 * Configuración de filtros y columnas para la exportación de proyectos
 * @param {Array} tiposProyectos - Lista de tipos de proyectos disponibles
 * @returns {Object} Configuración de filtros y columnas
 */
export const getProyectosExportConfig = (tiposProyectos = []) => {
  return {
    filters: [
      {
        key: 'tipo',
        label: 'Clasificación de Proyecto',
        type: 'select',
        options: [
          { value: 'pid', label: 'Solo Proyectos PID' },
          { value: 'externos', label: 'Solo Proyectos Externos' },
        ],
      },
      {
        key: 'tipoProyecto',
        label: 'Tipo de Proyecto',
        type: 'select',
        options: tiposProyectos.map((tipo) => ({
          value: tipo,
          label: tipo,
        })),
      },
      {
        key: 'trl',
        label: 'Nivel TRL (Madurez Tecnológica)',
        type: 'select',
        options: [
          { value: 'TRL 1', label: 'TRL 1 - Principios básicos observados' },
          { value: 'TRL 2', label: 'TRL 2 - Concepto tecnológico formulado' },
          { value: 'TRL 3', label: 'TRL 3 - Prueba de concepto experimental' },
          { value: 'TRL 4', label: 'TRL 4 - Validación en laboratorio' },
          { value: 'TRL 5', label: 'TRL 5 - Validación en entorno relevante' },
          { value: 'TRL 6', label: 'TRL 6 - Demostración en entorno relevante' },
          { value: 'TRL 7', label: 'TRL 7 - Demostración de sistema operacional' },
          { value: 'TRL 8', label: 'TRL 8 - Sistema completo y calificado' },
          { value: 'TRL 9', label: 'TRL 9 - Sistema probado operacional' },
        ],
      },
    ],
    columns: [
      { key: 'tipo', label: 'Clasificación (PID/Externo)' },
      { key: 'codPid', label: 'Código PID' },
      { key: 'denominacion', label: 'Denominación' },
      { key: 'descripcionBreve', label: 'Descripción Breve' },
      { key: 'fechaInicio', label: 'Fecha Inicio' },
      { key: 'fechaFin', label: 'Fecha Fin' },
      { key: 'regional', label: 'Regional' },
      { key: 'programa', label: 'Programa' },
      { key: 'tipoProyecto', label: 'Tipo de Proyecto' },
      { key: 'trl', label: 'Nivel TRL' },
      { key: 'estado', label: 'Estado' },
    ],
  };
};

/**
 * Filtra la lista de proyectos según los criterios seleccionados en el modal
 * @param {Array} proyectos - Lista completa de proyectos
 * @param {Object} filters - Filtros seleccionados
 * @returns {Array} Proyectos filtrados
 */
export const filterProyectos = (proyectos, filters) => {
  if (!proyectos || proyectos.length === 0) return [];

  return proyectos.filter((proyecto) => {
    // Filtro por clasificación PID vs Externo
    if (filters.tipo) {
      const isPid = !!proyecto.codPid;
      if (filters.tipo === 'pid' && !isPid) return false;
      if (filters.tipo === 'externos' && isPid) return false;
    }

    // Filtro por tipo de proyecto
    if (filters.tipoProyecto && proyecto.tipoProyecto !== filters.tipoProyecto) {
      return false;
    }

    // Filtro por nivel TRL
    if (filters.trl && proyecto.trl !== filters.trl) {
      return false;
    }

    return true;
  });
};

/**
 * Prepara las filas y columnas estructuradas para el archivo Excel
 * @param {Array} proyectos - Lista de proyectos a exportar
 * @param {Array} selectedColumns - Claves de columnas seleccionadas por el usuario
 * @returns {Array} Filas formateadas para Excel
 */
export const prepareProyectosForExport = (proyectos, selectedColumns) => {
  if (!proyectos || proyectos.length === 0) return [];

  const allColumns = [
    'tipo',
    'codPid',
    'denominacion',
    'descripcionBreve',
    'fechaInicio',
    'fechaFin',
    'regional',
    'programa',
    'tipoProyecto',
    'trl',
    'estado',
  ];

  const columnsToExport = selectedColumns && selectedColumns.length > 0 ? selectedColumns : allColumns;

  return proyectos.map((proyecto) => {
    const row = {};

    if (columnsToExport.includes('tipo')) {
      row['Clasificación'] = proyecto.codPid ? 'PID' : 'Externo';
    }
    if (columnsToExport.includes('codPid')) {
      row['Código PID'] = proyecto.codPid || '-';
    }
    if (columnsToExport.includes('denominacion')) {
      row['Denominación'] = proyecto.denominacion || '';
    }
    if (columnsToExport.includes('descripcionBreve')) {
      row['Descripción Breve'] = proyecto.descripcionBreve || '';
    }
    if (columnsToExport.includes('fechaInicio')) {
      row['Fecha Inicio'] = proyecto.fechaInicio ? formatoFechaISOaDDMMAAAA(proyecto.fechaInicio) : '';
    }
    if (columnsToExport.includes('fechaFin')) {
      row['Fecha Fin'] = proyecto.fechaFin ? formatoFechaISOaDDMMAAAA(proyecto.fechaFin) : '';
    }
    if (columnsToExport.includes('regional')) {
      row['Regional'] = proyecto.regional || '';
    }
    if (columnsToExport.includes('programa')) {
      row['Programa'] = proyecto.programa || '';
    }
    if (columnsToExport.includes('tipoProyecto')) {
      row['Tipo de Proyecto'] = proyecto.tipoProyecto || '';
    }
    if (columnsToExport.includes('trl')) {
      row['Nivel TRL'] = proyecto.trl || '';
    }
    if (columnsToExport.includes('estado')) {
      row['Estado'] = proyecto.estado || '';
    }

    return row;
  });
};
