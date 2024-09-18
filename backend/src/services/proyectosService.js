import { create, deleteByFilter, deleteById, update } from '../repository/baseRepository.js';
import {
  getAllProyectos,
  getProyectosPids,
  getProyectosExternos,
  getProyectoById,
  createProyecto,
  createProyectoPID,
  createTiene,
  createParticipa,
  createVinculacion,
  createVinculacionConFinanciamiento,
  createVinculacionSinFinanciamiento,
  createProyectoExterno,
  createRegionalesProyectos,
  createPersonaParticipaProyecto,
  delPersonaParticipaProyecto,
  createProyectoTieneGrupo,
  delProyectoTieneGrupo,
} from '../repository/proyectosRepository.js';
import convertToISOString from '../utils/funciones.js';

export async function getAllProyectosService() {
  try {
    const proyectos = await getAllProyectos();

    const proyectoD = proyectos.map(proyecto => {
      const { pid, proyectoExterno, ...restoProyecto } = proyecto;
      if (proyecto.pid) {
        return {
          ...restoProyecto,
          ...pid  // Añadir los atributos de pid al objeto proyecto
        };
      } else {
        return {
          ...restoProyecto,
          ...proyectoExterno
        };
      }
    });

    return proyectoD;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getProyectosPidsService() {
  try {
    const proyectosPids = await getProyectosPids();
    return proyectosPids;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getProyectosExternosService(subtipo) {
  try {
    const proyectosExternos = await getProyectosExternos(subtipo);
    return proyectosExternos;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getProyectoByIdService(idProyecto) {
  try {
    const proyecto = await getProyectoById(idProyecto);
    const { pid, proyectoExterno, ...restoProyecto } = proyecto
    if (proyecto.pid) {
      return {
        ...pid,
        ...restoProyecto
      }
    } else {
      return {
        ...proyectoExterno,
        ...restoProyecto
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createProyectoService(proyectoData) {
  const tipoProyectosConRegionales = [
    'Integrador Asociado (PID IA) con Incentivo',
    'Integrador Asociado (PID IA) sin Incentivo',
    'Inter-institucional (PIC IN) con Incentivos',
    'Inter-institucional (PIC IN) sin Incentivos',
    'PID Tecnología Educativa Multifacultad con Incentivos (PIDA)',
    'PID Tecnología Educativa Multifacultad sin Incentivos (PIDA)',
    'Tutorado con Incentivo',
    'Tutorado sin Incentivo',
  ];
  try {

    const { grupos, investigadores, regionales, ...dataProyecto } = proyectoData;
    dataProyecto.fechaInicio = convertToISOString(dataProyecto.fechaInicio);
    dataProyecto.fechaFin = convertToISOString(dataProyecto.fechaFin);

    const newProyecto = await createProyecto(dataProyecto);
    newProyecto.grupos = [];
    newProyecto.integrantes = [];
    newProyecto.regionales = [];

    if (newProyecto) {

      if (grupos) {
        for (const grupo of grupos || []) {
          const newGroup = await createTieneService({
            idGrupoInvestigacion: grupo.idGrupoInvestigacion,
            idProyecto: newProyecto.idProyecto,
          });
          newProyecto.grupos.push(newGroup);
        }
      }

      if (investigadores) {
        for (const investigador of investigadores || []) {
          const newInvestigador = await createParticipaService({
            idProyecto: newProyecto.idProyecto,
            idPersona: investigador.idPersona,
            rol: investigador.rol,
            fechaInicio: new Date()
          });
          newProyecto.integrantes.push(newInvestigador);
        }
      }


      if (tipoProyectosConRegionales.includes(newProyecto.tipoProyecto)) {
        for (const regional of regionales || []) {
          const newRegionalesProyectos = await createRegionalesProyectosService({
            idProyecto: newProyecto.idProyecto,
            nombreRegional: regional
          });
          newProyecto.regionales.push(newRegionalesProyectos);
        }
      }

    }

    return newProyecto;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createPidService(proyectoPidData) {
  try {
    const newProyectoPID = await createProyectoPID(proyectoPidData);
    return newProyectoPID;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createProyectoExternoService(proyectoPidData) {
  try {
    const newProyectoPID = await createProyectoExterno(proyectoPidData);
    return newProyectoPID;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createTieneService(dataTiene) {
  try {
    const newTiene = await createTiene(dataTiene);
    return newTiene;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createParticipaService(dataParticipa) {
  try {
    const newParticipacion = await createParticipa(dataParticipa);
    return newParticipacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createRegionalesProyectosService(dataP) {
  try {
    const newRP = await createRegionalesProyectos(dataP);
    return newRP;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updatePidService(idProyecto, data) {
  try {
    let projectUpdate = {};
    const proyectoSearch = await getProyectoById(idProyecto)
    if (proyectoSearch && proyectoSearch.idProyecto) { //Si existe el proyecto
      if (data) {
        const dataProyecto = {
          fechaInicio: convertToISOString(data.fechaInicio),
          fechaFin: convertToISOString(data.fechaFin),
          denominacion: data.denominacion,
          regional: data.regional,
          convocatoria: data.convocatoria,
          tipoProyecto: data.tipoProyecto,
          programa: data.programa,
        }
        const dataPID = {
          codPid: data.codPid,
          tipoActividad: data.tipoActividad,
          completo: data.completo,
          estado: data.estado,
          disposicion: data.disposicion,
          prorrogado: data.prorrogado,
        }
        let filter = { idProyecto: idProyecto };
        projectUpdate.proyecto = await update('proyectos', filter, dataProyecto);
        if (projectUpdate) {
          filter = { idPid: idProyecto };
          projectUpdate.pid = await update('pids', filter, dataPID)
        }
      }
    } else {
      throw new Error(`El proyecto con id ${idProyecto} no existe`)
    }

    // console.log(proyectoSearch);

    // const updatedPid = await update('pids', filter, pidData);
    // return updatedPid;
    return projectUpdate
  } catch (error) {
    console.log('maleta')
    throw new Error(error.message);
  }
}

export async function updateProyectoExternoService(idProyecto, data) {
  try {
    let projectUpdate = {};
    const proyectoSearch = await getProyectoById(idProyecto)
    if (proyectoSearch && proyectoSearch.idProyecto) { //Si existe el proyecto
      if (data) {
        const dataProyecto = {
          fechaInicio: convertToISOString(data.fechaInicio),
          fechaFin: convertToISOString(data.fechaFin),
          denominacion: data.denominacion,
          regional: data.regional,
          convocatoria: data.convocatoria,
          tipoProyecto: data.tipoProyecto,
          programa: data.programa,
        }
        const dataExterno = {
          empresaInstitucion: data.empresaInstitucion,
        }
        let filter = { idProyecto: idProyecto };
        projectUpdate.proyecto = await update('proyectos', filter, dataProyecto);
        if (projectUpdate) {
          filter = { idProyectoExterno: idProyecto };
          console.log('asd')
          projectUpdate.pid = await update('proyectosExternos', filter, dataExterno)
        }
      }
    } else {
      throw new Error(`El proyecto con id ${idProyecto} no existe`)
    }

    // console.log(proyectoSearch);

    // const updatedPid = await update('pids', filter, pidData);
    // return updatedPid;
    return projectUpdate
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message);
  }
}

export async function createVinculacionService(idProyecto, dataVinculacion) {
  try {
    const newVinculacion = await createVinculacion(idProyecto, dataVinculacion);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createVinculacionSinFinanciamientoService(idVinculacion, vinculacionData) {
  try {
    const newVinculacion = await createVinculacionSinFinanciamiento(idVinculacion, vinculacionData);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createVinculacionConFinanciamientoService(idVinculacion, vinculacionData) {
  try {
    const newVinculacion = await createVinculacionConFinanciamiento(idVinculacion, vinculacionData);
    return newVinculacion;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createPersonaParticipaProyectoService(idProyecto, dataInvestigador) {
  try {
    const newParticipante = await createPersonaParticipaProyecto(idProyecto, dataInvestigador);
    return newParticipante;
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message);
  }
}

export async function delPersonaParticipaProyectoService(idProyecto, idInvestigador) {
  try {
    const delParticipante = await delPersonaParticipaProyecto(idProyecto, idInvestigador);
    return delParticipante;
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message);
  }
}

export async function createProyectoTieneGrupoService(idProyecto, idGrupo) {
  try {
    const newGrupo = await createProyectoTieneGrupo(idProyecto, idGrupo);
    return newGrupo;
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message);
  }
}

export async function delProyectoTieneGrupoService(idProyecto, idGrupo) {
  try {
    const delGrupo = await delProyectoTieneGrupo(idProyecto, idGrupo);
    return delGrupo;
  } catch (error) {
    console.log(error.message)
    throw new Error(error.message);
  }
}