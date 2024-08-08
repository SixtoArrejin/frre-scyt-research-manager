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
  createProyectoExterno
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
    return proyecto;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createProyectoService(proyectoData) {
  try {

    const { grupos, investigadores, ...dataProyecto } = proyectoData;
    dataProyecto.fechaInicio = convertToISOString(dataProyecto.fechaInicio);
    dataProyecto.fechaFin = convertToISOString(dataProyecto.fechaFin);

    const newProyecto = await createProyecto(dataProyecto);
    newProyecto.grupos = [];
    newProyecto.integrantes = [];

    if (newProyecto) {

      for (const grupo of grupos || []) {
        const newGroup = await createTieneService({
          idGrupoInvestigacion: grupo.idGrupoInvestigacion,
          idProyecto: newProyecto.idProyecto,
        });
        newProyecto.grupos.push(newGroup);
      }

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

export async function updatePidService(idProyecto, data) {
  try {
    const filter = { idProyecto: idProyecto };
    let projectUpdate = {};
    const proyectoSearch = await getProyectoById(idProyecto)
    if (proyectoSearch && proyectoSearch.idProyecto) { //Si existe el proyecto
      if (data.proyecto) {
        if (data.proyecto.fechaInicio) {
          data.proyecto.fechaInicio = convertToISOString(data.proyecto.fechaInicio)
        };
        if (data.proyecto.fechaFin) {
          data.proyecto.fechaFin = convertToISOString(data.proyecto.fechaFin)
        };
        projectUpdate.proyecto = await update('proyectos', filter, data.proyecto);
        console.log('Buena: ', projectUpdate)
      }
      console.log(data)
      if (data && data.investigadores) {
        console.log("Investigadores: ", data.investigadores)
        let bandera = false;

        try {
          await deleteByFilter('participa', filter)
          bandera = true
          console.log('delete')
        } catch {
          bandera = false
        }
        if (bandera) {
          const investigadoresP = data.investigadores.map(investigador => ({
            ...investigador,
            idProyecto: idProyecto,
          }));
          try {
            for (const investigador of investigadoresP) {
              await create('participa', investigador);
            }
          } catch (error) {
            console.log(error);
          }
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