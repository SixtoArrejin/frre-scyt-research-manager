import { createConvenioService } from '../services/conveniosService.js';
import {
  getAllProyectosService,
  getProyectosPidsService,
  getProyectosExternosService,
  getProyectoByIdService,
  createProyectoService,
  createTieneService,
  createParticipaService,
  updatePidService,
  createVinculacionService,
  createVinculacionConFinanciamientoService,
  createVinculacionSinFinanciamientoService,
  createPidService,
  createProyectoExternoService,
  updateProyectoExternoService,
  updateInstitucionesProyectoService,
  createPersonaParticipaProyectoService,
  delPersonaParticipaProyectoService,
  bajaPersonaParticipaProyectoService,
  createProyectoTieneGrupoService,
  delProyectoTieneGrupoService,
} from '../services/proyectosService.js';
import convertToISOString from '../utils/funciones.js';

export async function getProyectos(req, res) {
  try {
    const proyectos = await getAllProyectosService();
    return res
      .status(200)
      .json({ message: 'Proyectos encontrados', success: true, proyectos });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
  /* try {
    const { tipo, subtipo } = req.query;
    console.log(tipo, subtipo);
    let proyectos;

    if (tipo === "pid") {
      proyectos = await getProyectosPidsService();
    } else if (tipo === "externo") {
      if (subtipo === "financiamiento") {
        proyectos = await getProyectosExternosService(subtipo);
      } else if (subtipo === "sinfinanciamiento") {
        proyectos = await getProyectosExternosService(subtipo);
      } else {
        proyectos = await getProyectosExternosService();
      }
    } else {
      proyectos = await getAllProyectosService();
    }

    res
      .status(200)
      .json({
        message: `Proyectos encontrados. ${tipo ? `Tipo: ${tipo} ${subtipo ? `- Subtipo: ${subtipo}` : ""} ` : ""
          }`,
        success: true,
        proyectos,
      });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  } */
}

export async function getProyectosDeGrupo(req, res) {
  try {
    const { idGrupo } = req.params;
    console.log(idGrupo);

    // Obtener todos los proyectos y luego filtrar por idGrupo
    const proyectos = await getAllProyectosService();
    const proyectosFiltrados = proyectos.filter((proyecto) =>
      proyecto.tiene.some((item) => item.idGrupoInvestigacion == idGrupo),
    );

    res.status(200).json({
      message: `Proyectos encontrados para el idGrupoInvestigacion ${idGrupo}.`,
      success: true,
      proyectos: proyectosFiltrados,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function getProyectosDePersona(req, res) {
  try {
    const { personaId } = req.params;
    console.log(personaId);

    // Obtener todos los proyectos y luego filtrar por idGrupo
    const proyectos = await getAllProyectosService();
    const proyectosFiltrados = proyectos.filter((proyecto) =>
      proyecto.participa.some((item) => item.idPersona == personaId),
    );

    // Mapear los proyectos para mostrar solo el rol correspondiente al ID del proyecto actual
    const proyectosConRoles = proyectosFiltrados.map((proyecto) => {
      const participacion = proyecto.participa.find(
        (item) => item.idPersona == personaId,
      );
      return {
        idProyecto: proyecto.idProyecto,
        tipoActividad: proyecto.tipoActividad,
        fechaInicio: proyecto.fechaInicio,
        fechaFin: proyecto.fechaFin,
        denominacion: proyecto.denominacion,
        completo: proyecto.completo,
        regional: proyecto.regional,
        convocatoria: proyecto.convocatoria,
        estado: proyecto.estado,
        rol: participacion.rol,
        fechaIngreso: participacion.fechaInicio,
      };
    });

    res.status(200).json({
      message: `Proyectos encontrados para la personaId ${personaId}.`,
      success: true,
      proyectos: proyectosConRoles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function getProyectoPorId(req, res) {
  try {
    const { idProyecto } = req.params;
    console.log(idProyecto);

    const proyecto = await getProyectoByIdService(Number(idProyecto));
    res.status(200).json({
      message: `Proyecto encontrado para el proyecto con ID ${idProyecto}.`,
      success: true,
      proyecto: proyecto,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function crearProyectos(req, res) {
  try {
    let dataProyecto = req.body;
    const newProyecto = await createProyectoService(dataProyecto);

    if (newProyecto) {
      dataProyecto.idProyecto = newProyecto.idProyecto;
      if (dataProyecto.tipo === 'pid') {
        newProyecto.pid = await createPidService(dataProyecto);
      } else {
        newProyecto.externo = await createProyectoExternoService(dataProyecto);
      }
    }

    res
      .status(200)
      .json({
        message: 'Proyecto creado.',
        success: true,
        proyecto: newProyecto,
      });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function updateProyectoController(req, res) {
  const idProyecto = parseInt(req.params.idProyecto, 10);
  const dataP = req.body;
  console.log(dataP);
  try {
    let updatedP;
    if (dataP.proyecto) {
      if (dataP.proyecto.codPid) {
        updatedP = await updatePidService(idProyecto, dataP.proyecto);
      } else {
        updatedP = await updateProyectoExternoService(idProyecto, dataP.proyecto);
      }
    }
    if (dataP.investifadores) {
      console.log('investigadores');
    }
    if (dataP.grupos) {
      console.log('grupos');
    }
    // Manejar actualización de instituciones
    const instituciones = dataP.instituciones || dataP.proyecto?.instituciones;
    if (instituciones !== undefined) {
      await updateInstitucionesProyectoService(idProyecto, instituciones);
    }
    return res
      .status(200)
      .json({
        message: 'Proyecto actualizado exitosamente',
        success: true,
        updatedP,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function crearVinculaciones(req, res) {
  const idProyecto = parseInt(req.params.idProyecto, 10);
  try {
    const dataVinculacion = req.body;
    const newVinculacionG = await createVinculacionService(idProyecto, dataVinculacion);
    var newVinculacion = {};
    var convenios = [];
    if (newVinculacionG) {
      const idVinculacion = newVinculacionG.idVinculacion;
      if (dataVinculacion.financiamiento) {
        newVinculacion = await createVinculacionConFinanciamientoService(idVinculacion, dataVinculacion);
      } else {
        newVinculacion = await createVinculacionSinFinanciamientoService(idVinculacion, dataVinculacion);
      }
      if (dataVinculacion.convenios && dataVinculacion.convenios.length > 0) {
        for (const convenioData of dataVinculacion.convenios) {
          const newConvenio = await createConvenioService(idVinculacion, convenioData);
          convenios.push(newConvenio);
        }
      }
    }
    console.log(newVinculacionG);
    console.log(newVinculacion);
    res
      .status(200)
      .json({
        message: 'Vinculación creada.',
        success: true,
        vinculacion: newVinculacion,
      });

  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function addInvestigador(req, res) {
  const idProyecto = parseInt(req.params.idProyecto, 10);
  const dataInvestigador = req.body;
  console.log('id: ', idProyecto);
  console.log('data: ', dataInvestigador);
  try {
    const newParticipa = await createPersonaParticipaProyectoService(idProyecto, dataInvestigador);
    res
      .status(200)
      .json({
        message: 'Integrante agregado.',
        success: true,
        vinculacion: newParticipa,
      });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function delInvestigador(req, res) {
  const idProyecto = parseInt(req.params.idProyecto, 10);
  const idInvestigador = parseInt(req.params.idInvestigador, 10);
  console.log('idProyecto: ', idProyecto);
  console.log('idInvestigador: ', idInvestigador);
  try {
    const delParticipa = await delPersonaParticipaProyectoService(idProyecto, idInvestigador);
    res
      .status(200)
      .json({
        message: 'Integrante eliminado.',
        success: true,
        vinculacion: delParticipa,
      });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function bajaInvestigadorController(req, res) {
  const idProyecto = parseInt(req.params.idProyecto, 10);
  const idInvestigador = parseInt(req.params.idInvestigador, 10);
  const { fechaFin, motivoBaja } = req.body;
  try {
    const bajaParticipa = await bajaPersonaParticipaProyectoService(idProyecto, idInvestigador, fechaFin, motivoBaja);
    res
      .status(200)
      .json({
        message: 'Investigador dado de baja correctamente.',
        success: true,
        vinculacion: bajaParticipa,
      });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function addGrupo(req, res) {
  const idProyecto = parseInt(req.params.idProyecto, 10);
  const {idGrupo} = req.body;
  console.log('id del grupo a agregar: ', idGrupo);
  try {
    const newGrupo = await createProyectoTieneGrupoService(idProyecto, idGrupo);
    res
      .status(200)
      .json({
        message: 'Grupo agregado.',
        success: true,
        vinculacion: newGrupo,
      });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, success: false });
  }
}

export async function delGrupo(req, res) {
  const idProyecto = parseInt(req.params.idProyecto, 10);
  const idGrupo = parseInt(req.params.idGrupo, 10);
  console.log('idProyecto: ', idProyecto);
  console.log('idGrupo: ', idGrupo);
  try {
    const delGrupo = await delProyectoTieneGrupoService(idProyecto, idGrupo);
    res
      .status(200)
      .json({
        message: 'Grupo eliminado.',
        success: true,
        vinculacion: delGrupo,
      });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message, success: false });
  }
}