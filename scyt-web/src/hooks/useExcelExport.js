import * as XLSX from 'xlsx';

/**
 * Hook personalizado para exportar datos a Excel
 * @returns {Function} exportToExcel - Función para exportar datos
 */
export const useExcelExport = () => {
  /**
   * Exporta datos a un archivo Excel con estilo profesional
   * @param {Array} data - Array de objetos con los datos a exportar
   * @param {string} fileName - Nombre del archivo (sin extensión)
   * @param {string} sheetName - Nombre de la hoja de cálculo
   */
  const exportToExcel = (data, fileName = 'export', sheetName = 'Datos') => {
    try {
      // Crear un nuevo libro de trabajo
      const workbook = XLSX.utils.book_new();
      
      // Convertir los datos a hoja de cálculo
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Ajustar el ancho de las columnas automáticamente
      const columnWidths = [];
      if (data.length > 0) {
        Object.keys(data[0]).forEach((key) => {
          const maxLength = Math.max(
            key.length,
            ...data.map((row) => {
              const value = row[key];
              return value ? value.toString().length : 0;
            })
          );
          columnWidths.push({ wch: Math.min(maxLength + 3, 50) });
        });
      }
      worksheet['!cols'] = columnWidths;
      
      // Aplicar estilos a los encabezados (primera fila)
      if (data.length > 0) {
        const headers = Object.keys(data[0]);
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        
        // Estilizar cada celda de encabezado
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
          if (!worksheet[cellAddress]) continue;
          
          // Aplicar estilos a los encabezados
          worksheet[cellAddress].s = {
            font: {
              name: 'Calibri',
              sz: 12,
              bold: true,
              color: { rgb: 'FFFFFF' }
            },
            fill: {
              fgColor: { rgb: '4472C4' }
            },
            alignment: {
              horizontal: 'center',
              vertical: 'center',
              wrapText: true
            },
            border: {
              top: { style: 'thin', color: { rgb: '000000' } },
              bottom: { style: 'thin', color: { rgb: '000000' } },
              left: { style: 'thin', color: { rgb: '000000' } },
              right: { style: 'thin', color: { rgb: '000000' } }
            }
          };
        }
        
        // Estilizar las celdas de datos
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cellAddress]) continue;
            
            worksheet[cellAddress].s = {
              font: {
                name: 'Calibri',
                sz: 11
              },
              alignment: {
                vertical: 'center',
                wrapText: false
              },
              border: {
                top: { style: 'thin', color: { rgb: 'D3D3D3' } },
                bottom: { style: 'thin', color: { rgb: 'D3D3D3' } },
                left: { style: 'thin', color: { rgb: 'D3D3D3' } },
                right: { style: 'thin', color: { rgb: 'D3D3D3' } }
              },
              fill: {
                fgColor: { rgb: row % 2 === 0 ? 'F2F2F2' : 'FFFFFF' }
              }
            };
          }
        }
        
        // Congelar la primera fila (encabezados)
        worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
      }
      
      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      
      // Generar el archivo y descargarlo con el formato XLSX para soportar estilos
      XLSX.writeFile(workbook, `${fileName}.xlsx`, { 
        bookType: 'xlsx',
        cellStyles: true 
      });
      
      return true;
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      return false;
    }
  };

  return { exportToExcel };
};
