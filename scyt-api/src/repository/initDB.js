import { prisma } from '../db.js';

const regionalesData = [
  'Centro Tecnológico De Desarrollo Regional Los Reyunos',
  'Facultad Regional Avellaneda',
  'Facultad Regional Bahía Blanca',
  'Facultad Regional Buenos Aires',
  'Facultad Regional Chubut',
  'Facultad Regional Concepción del Uruguay',
  'Facultad Regional Concordia',
  'Facultad Regional Córdoba',
  'Facultad Regional Delta',
  'Facultad Regional General Pacheco',
  'Facultad Regional Haedo',
  'Facultad Regional La Plata',
  'Facultad Regional La Rioja',
  'Facultad Regional Mar del Plata',
  'Facultad Regional Mendoza',
  'Facultad Regional Neuquen',
  'Facultad Regional Paraná',
  'Facultad Regional Rafaela',
  'Facultad Regional Reconquista',
  'Facultad Regional Resistencia',
  'Facultad Regional Rosario',
  'Facultad Regional San Francisco',
  'Facultad Regional San Nicolás',
  'Facultad Regional San Rafael',
  'Facultad Regional Santa Cruz',
  'Facultad Regional Santa Fe',
  'Facultad Regional Tierra del Fuego',
  'Facultad Regional Trenque Lauquen',
  'Facultad Regional Tucumán',
  'Facultad Regional Venado Tuerto',
  'Facultad Regional Villa María',
  'Instituto Nacional Superior de Profesorado Técnico',
  // 'Rectorado'
];

const tiposProyectosData = [
  'Integrador Asociado (PID IA) con Incentivo',
  'Integrador Asociado (PID IA) sin Incentivo',
  'Inter-institucional (PIC IN) con Incentivos',
  'Inter-institucional (PIC IN) sin Incentivos',
  'PID Con Incentivos',
  'PID Equipos Consolidados con Incentivos (TC)',
  'PID Equipos Consolidados sin Incentivos (TC)',
  'PID Equipos en Consolidación con Incentivos (EC)',
  'PID Equipos en Consolidación sin Incentivos (EC)',
  'PID Iniciación a Investigación Primer Proyecto (PP)',
  'PID Sin Incentivos',
  'PID Tecnología Educativa Multifacultad con Incentivos (PIDA)',
  'PID Tecnología Educativa Multifacultad sin Incentivos (PIDA)',
  'Tutorado con Incentivo',
  'Tutorado sin Incentivo',
];

export async function initDatabase() {
  try {
    for (const nombre of regionalesData) {
      const regional = await prisma.regionales.findUnique({
        where: { nombre },
      });

      if (!regional) {
        await prisma.regionales.create({
          data: { nombre },
        });
        console.log(`Regional "${nombre}" ha sido insertada.`);
      } else {
        console.log(`Regional "${nombre}" ya existe.`);
      }
    }

    for (const tipoProyecto of tiposProyectosData) {
      const tipoProyectoE = await prisma.tiposproyectos.findUnique({
        where: { tipoProyecto },
      });

      if (!tipoProyectoE) {
        await prisma.tiposproyectos.create({
          data: { tipoProyecto },
        });
        console.log(`Tipo de Proyecto "${tipoProyecto}" ha sido insertado.`);
      } else {
        console.log(`Tipo de Proyecto "${tipoProyecto}" ya existe.`);
      }
    }
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}
