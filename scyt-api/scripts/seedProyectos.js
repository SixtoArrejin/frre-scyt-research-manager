import { prisma } from '../src/db.js';

async function seedData() {
  console.log('🌱 Iniciando carga de proyectos y datos asociados...');

  try {
    // 1. Asegurar investigadores / personas adicionales si no existen
    const existingPersonas = await prisma.personas.findMany();
    const personasByDni = new Map(existingPersonas.map((p) => [p.dni, p]));

    let personaTobias = existingPersonas.find((p) => p.nombre?.toLowerCase().includes('tobias')) || existingPersonas[0];
    let personaSixto = existingPersonas.find((p) => p.nombre?.toLowerCase().includes('sixto')) || existingPersonas[1];
    let personaAndre = existingPersonas.find((p) => p.nombre?.toLowerCase().includes('andré') || p.nombre?.toLowerCase().includes('andre')) || existingPersonas[2];

    // Personas adicionales para enriquecer
    if (!personasByDni.has(35123456)) {
      const pDoc = await prisma.personas.create({
        data: {
          dni: 35123456,
          nombre: 'Martín',
          apellido: 'Gómez',
          activo: true,
          idGrupoInvestigacion: 1,
          legajo: 'DOC-1029',
          nivelPosgrado: 'Doctorado',
          tienePosgrado: true,
          esBecario: false,
          orcid: '0000-0002-1825-0097',
        },
      });
      personasByDni.set(35123456, pDoc);
    }

    if (!personasByDni.has(41987654)) {
      const pBec = await prisma.personas.create({
        data: {
          dni: 41987654,
          nombre: 'Lucía',
          apellido: 'Benítez',
          activo: true,
          idGrupoInvestigacion: 2,
          legajo: 'BEC-2045',
          nivelPosgrado: 'Grado',
          tienePosgrado: false,
          esBecario: true,
          orcid: '0009-0003-4512-8871',
        },
      });
      personasByDni.set(41987654, pBec);
    }

    const personaMartin = personasByDni.get(35123456);
    const personaLucia = personasByDni.get(41987654);

    // 2. Definir los proyectos a cargar
    console.log('📌 Insertando proyectos de prueba...');

    // PROYECTO 1: PID Equipos Consolidados con Incentivos (TC)
    const proyecto1 = await prisma.proyectos.create({
      data: {
        denominacion: 'Optimización de Algoritmos de Machine Learning para Redes IoT en Entornos Industriales',
        regional: 'Facultad Regional Resistencia',
        convocatoria: 2024,
        idDirector: personaTobias?.idPersona,
        idCodirector: personaSixto?.idPersona,
        tipoProyecto: 'PID Equipos Consolidados con Incentivos (TC)',
        programa: 'Tecnologías de la Información y las Comunicaciones',
        trl: 'TRL 4',
        descripcionBreve: 'Investigación y desarrollo de modelos predictivos optimizados y de baja latencia para sensores industriales en el marco de la Industria 4.0.',
        fechaInicio: new Date('2024-01-01'),
        fechaFin: new Date('2026-12-31'),
        pid: {
          create: {
            codPid: 'PID-UTN-8042',
            tipoActividad: 'Investigación Aplicada',
            completo: false,
            estado: 'En Ejecución',
            disposicion: 'Disp. SCyT 142/24',
            prorrogado: false,
          },
        },
        tiene: {
          create: [{ idGrupoInvestigacion: 1 }],
        },
        institucionesAsociadas: {
          create: [
            { nombreInstitucion: 'CONICET' },
            { nombreInstitucion: 'INTI - Regional NEA' },
          ],
        },
        participa: {
          create: [
            { idPersona: personaTobias.idPersona, rol: 'Director', fechaInicio: new Date('2024-01-01') },
            { idPersona: personaSixto.idPersona, rol: 'Codirector', fechaInicio: new Date('2024-01-01') },
            { idPersona: personaAndre.idPersona, rol: 'Investigador', fechaInicio: new Date('2024-01-01') },
            ...(personaLucia ? [{ idPersona: personaLucia.idPersona, rol: 'Becario', fechaInicio: new Date('2024-03-01') }] : []),
          ],
        },
        propiedadIntelectual: {
          create: [
            {
              tipoPI: 'Derecho de Autor',
              numeroExpediente: 'EXP-2024-00452-UTN',
              fechaInicio: new Date('2024-04-10'),
              descripcion: 'Software de monitorización predictiva y telemetría de tráfico en redes sensorizadas (IoT-ML Suite).',
              investigadores: {
                create: [
                  { idPersona: personaTobias.idPersona, porcentajeParticipacion: 60.0 },
                  { idPersona: personaSixto.idPersona, porcentajeParticipacion: 40.0 },
                ],
              },
            },
          ],
        },
      },
    });

    // Vinculación tecnológica asociada al proyecto 1
    const vinc1 = await prisma.vinculaciones.create({
      data: {
        empresaInstitucion: 'Polo Tecnológico Chaco S.A.',
        numeroMarco: 1024,
        idProyecto: proyecto1.idProyecto,
        idResponsable: personaTobias?.idPersona,
        vinculacionesconfinanciamiento: {
          create: {
            titulo: 'Implementación Piloto de Telemetría IoT en Empresas del Parque Industrial de Resistencia',
            estado: 'En Ejecución',
            motivoEstado: 'Segunda etapa de despliegue en campo',
            monto: 4500000,
            plazoEjecucion: 12,
            nombreBeneficiario: 'Polo Tecnológico Chaco S.A.',
            cantidadDesembolsos: 2,
            fechaPresentacion: new Date('2024-03-01'),
            fechaAdjudicacion: new Date('2024-05-15'),
            desembolsos: {
              create: [
                {
                  montoDesembolsado: 2250000,
                  montoRendido: 2250000,
                  estado: 'Rendido Aprobado',
                  plazoEtapa: 6,
                  fechaDesembolso: new Date('2024-06-01'),
                  fechaRendicion: new Date('2024-11-30'),
                  fechaAprobado: new Date('2024-12-10'),
                },
                {
                  montoDesembolsado: 2250000,
                  montoRendido: 1100000,
                  estado: 'En Ejecución',
                  plazoEtapa: 6,
                  fechaDesembolso: new Date('2024-12-15'),
                  fechaRendicion: new Date('2025-06-15'),
                },
              ],
            },
          },
        },
      },
    });

    console.log(`✅ Proyecto 1 creado: ${proyecto1.denominacion} (ID: ${proyecto1.idProyecto})`);

    // PROYECTO 2: PID Iniciación a Investigación Primer Proyecto (PP)
    const proyecto2 = await prisma.proyectos.create({
      data: {
        denominacion: 'Evaluación de Materiales Sostenibles a Base de Subproductos del Algodón para Aislamiento Térmico',
        regional: 'Facultad Regional Resistencia',
        convocatoria: 2024,
        idDirector: personaAndre?.idPersona,
        idCodirector: personaTobias?.idPersona,
        tipoProyecto: 'PID Iniciación a Investigación Primer Proyecto (PP)',
        programa: 'Materiales y Estructuras Sostenibles',
        trl: 'TRL 3',
        descripcionBreve: 'Estudio de las propiedades térmicas y acústicas de biocompuestos obtenidos a partir de fibras residuales de la desmotadora de algodón chaqueña.',
        fechaInicio: new Date('2024-03-01'),
        fechaFin: new Date('2025-02-28'),
        pid: {
          create: {
            codPid: 'PID-UTN-8115',
            tipoActividad: 'Desarrollo Experimental',
            completo: false,
            estado: 'En Ejecución',
            disposicion: 'Disp. SCyT 210/24',
            prorrogado: true,
            nuevaDisposicion: 'Disp. SCyT 580/24',
            nuevaFechaFin: new Date('2025-08-31'),
          },
        },
        tiene: {
          create: [{ idGrupoInvestigacion: 2 }],
        },
        institucionesAsociadas: {
          create: [{ nombreInstitucion: 'INTA - EEA Colonia Benítez' }],
        },
        participa: {
          create: [
            { idPersona: personaAndre.idPersona, rol: 'Director', fechaInicio: new Date('2024-03-01') },
            { idPersona: personaTobias.idPersona, rol: 'Codirector', fechaInicio: new Date('2024-03-01') },
            ...(personaLucia ? [{ idPersona: personaLucia.idPersona, rol: 'Becario', fechaInicio: new Date('2024-04-01') }] : []),
          ],
        },
      },
    });

    console.log(`✅ Proyecto 2 creado: ${proyecto2.denominacion} (ID: ${proyecto2.idProyecto})`);

    // PROYECTO 3: PID Con Incentivos (Finalizado)
    const proyecto3 = await prisma.proyectos.create({
      data: {
        denominacion: 'Sistema Inteligente de Gestión Energética para Micro-redes Eléctricas Universitarias',
        regional: 'Facultad Regional Resistencia',
        convocatoria: 2023,
        idDirector: personaSixto?.idPersona,
        idCodirector: personaAndre?.idPersona,
        tipoProyecto: 'PID Con Incentivos',
        programa: 'Energías Renovables y Eficiencia Energética',
        trl: 'TRL 6',
        descripcionBreve: 'Diseño e instalación de un sistema SCADA distribuido con medición inteligente para optimización del consumo y fuentes fotovoltaicas en campus UTN.',
        fechaInicio: new Date('2023-04-01'),
        fechaFin: new Date('2024-12-31'),
        pid: {
          create: {
            codPid: 'PID-UTN-7920',
            tipoActividad: 'Investigación Aplicada',
            completo: true,
            estado: 'Finalizado',
            disposicion: 'Disp. SCyT 089/23',
            prorrogado: false,
          },
        },
        tiene: {
          create: [{ idGrupoInvestigacion: 1 }, { idGrupoInvestigacion: 2 }],
        },
        institucionesAsociadas: {
          create: [{ nombreInstitucion: 'Subsecretaría de Energía de la Provincia del Chaco' }],
        },
        participa: {
          create: [
            { idPersona: personaSixto.idPersona, rol: 'Director', fechaInicio: new Date('2023-04-01'), fechaFin: new Date('2024-12-31') },
            { idPersona: personaAndre.idPersona, rol: 'Codirector', fechaInicio: new Date('2023-04-01'), fechaFin: new Date('2024-12-31') },
            { idPersona: personaTobias.idPersona, rol: 'Investigador', fechaInicio: new Date('2023-04-01'), fechaFin: new Date('2024-12-31') },
            ...(personaMartin ? [{ idPersona: personaMartin.idPersona, rol: 'Investigador', fechaInicio: new Date('2023-05-01'), fechaFin: new Date('2024-12-31') }] : []),
          ],
        },
      },
    });

    // Convenio vinculado a Proyecto 3
    const vinc3 = await prisma.vinculaciones.create({
      data: {
        empresaInstitucion: 'Servicios Energéticos del Chaco (SECHEEP)',
        numeroMarco: 1088,
        idProyecto: proyecto3.idProyecto,
        idResponsable: personaSixto?.idPersona,
        convenios: {
          create: [
            {
              tipo: 'Convenio Específico de Asistencia Técnica',
              numero: 'CONV-SECHEEP-2023-04',
            },
          ],
        },
        vinculacionessinfinanciamiento: {
          create: {
            descripcion: 'Acuerdo de cooperación técnica para validación de medidores inteligentes en transformadores urbanos.',
            fechaInicio: new Date('2023-05-01'),
            fechaCierre: new Date('2024-12-31'),
          },
        },
      },
    });

    console.log(`✅ Proyecto 3 creado: ${proyecto3.denominacion} (ID: ${proyecto3.idProyecto})`);

    // PROYECTO 4: Proyecto Externo (Vinculación / Industria)
    const proyecto4 = await prisma.proyectos.create({
      data: {
        denominacion: 'Plataforma Telemática de Trazabilidad Logística Fluvial para la Hidrovía Paraná-Paraguay',
        regional: 'Facultad Regional Resistencia',
        convocatoria: 2024,
        idDirector: personaTobias?.idPersona,
        idCodirector: personaAndre?.idPersona,
        tipoProyecto: 'Integrador Asociado (PID IA) con Incentivo',
        programa: 'Transporte y Logística Regional',
        trl: 'TRL 5',
        descripcionBreve: 'Desarrollo tecnológico conjunto para monitoreo satelital, análisis de carga en tiempo real y certificación electrónica de barcazas.',
        fechaInicio: new Date('2024-06-01'),
        fechaFin: new Date('2026-05-31'),
        proyectoExterno: {
          create: {
            empresaInstitucion: 'Compañía Naviera Fluvial del Norte S.A.',
          },
        },
        tiene: {
          create: [{ idGrupoInvestigacion: 1 }],
        },
        institucionesAsociadas: {
          create: [
            { nombreInstitucion: 'Administración Portuaria del Puerto de Barranqueras' },
          ],
        },
        participa: {
          create: [
            { idPersona: personaTobias.idPersona, rol: 'Director', fechaInicio: new Date('2024-06-01') },
            { idPersona: personaAndre.idPersona, rol: 'Codirector', fechaInicio: new Date('2024-06-01') },
            { idPersona: personaSixto.idPersona, rol: 'Investigador', fechaInicio: new Date('2024-06-01') },
          ],
        },
        propiedadIntelectual: {
          create: [
            {
              tipoPI: 'Modelo de Utilidad',
              numeroExpediente: 'INPI-MU-2024-009988',
              fechaInicio: new Date('2024-08-20'),
              descripcion: 'Carcasa estanca y módulo de telemetría de ultra bajo consumo para barcazas fluviales.',
              investigadores: {
                create: [
                  { idPersona: personaTobias.idPersona, porcentajeParticipacion: 50.0 },
                  { idPersona: personaAndre.idPersona, porcentajeParticipacion: 50.0 },
                ],
              },
            },
          ],
        },
      },
    });

    console.log(`✅ Proyecto 4 creado: ${proyecto4.denominacion} (ID: ${proyecto4.idProyecto})`);

    // PROYECTO 5: PID Equipos en Consolidación con Incentivos (EC)
    const proyecto5 = await prisma.proyectos.create({
      data: {
        denominacion: 'Análisis de Calidad de Aguas del Río Negro Mediante Redes Neuronales y Teledetección',
        regional: 'Facultad Regional Resistencia',
        convocatoria: 2025,
        idDirector: personaSixto?.idPersona,
        idCodirector: personaTobias?.idPersona,
        tipoProyecto: 'PID Equipos en Consolidación con Incentivos (EC)',
        programa: 'Ambiente, Cuencas Hídricas y Sustentabilidad',
        trl: 'TRL 2',
        descripcionBreve: 'Modelado predictivo de dispersión de contaminantes orgánicos y análisis espectral de imágenes Sentinel-2 para el monitoreo de la cuenca hídrica.',
        fechaInicio: new Date('2025-02-01'),
        fechaFin: new Date('2027-01-31'),
        pid: {
          create: {
            codPid: 'PID-UTN-8340',
            tipoActividad: 'Investigación Básica y Aplicada',
            completo: false,
            estado: 'En Ejecución',
            disposicion: 'Disp. SCyT 012/25',
            prorrogado: false,
          },
        },
        tiene: {
          create: [{ idGrupoInvestigacion: 2 }],
        },
        institucionesAsociadas: {
          create: [{ nombreInstitucion: 'APA - Administración Provincial del Agua' }],
        },
        participa: {
          create: [
            { idPersona: personaSixto.idPersona, rol: 'Director', fechaInicio: new Date('2025-02-01') },
            { idPersona: personaTobias.idPersona, rol: 'Codirector', fechaInicio: new Date('2025-02-01') },
            ...(personaMartin ? [{ idPersona: personaMartin.idPersona, rol: 'Investigador', fechaInicio: new Date('2025-02-01') }] : []),
          ],
        },
      },
    });

    console.log(`✅ Proyecto 5 creado: ${proyecto5.denominacion} (ID: ${proyecto5.idProyecto})`);

    console.log('🎉 Carga de proyectos y relaciones completada exitosamente!');
  } catch (error) {
    console.error('❌ Error al cargar proyectos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();
