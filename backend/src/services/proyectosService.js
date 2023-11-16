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
} from '../repository/proyectosRepository.js';
import convertToISOString from '../utils/funciones.js';

export async function getAllProyectosService() {
  try {
    const proyectos = await getAllProyectos();
    return proyectos;
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

export async function createPIDService(proyectoPIDData) {
  try {
    const newProyectoPID = await createProyectoPID(proyectoPIDData);
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

export async function updatePidService(idPid, pidData) {
  try {
    const filter = { idProyecto: idPid };
    const projectUpdate = {};

    const proyectoSearch = await getProyectoById(idPid)
    if (proyectoSearch && proyectoSearch.idProyecto) { //Si existe el proyecto
      if (proyectoSearch.pids) { //Si existe el proyecto y es PID
        if (pidData && pidData.proyecto) {
          if (pidData.proyecto.fechaInicio) {
            pidData.proyecto.fechaInicio = convertToISOString(pidData.proyecto.fechaInicio)
          };
          if (pidData.proyecto.fechaFin) {
            pidData.proyecto.fechaFin = convertToISOString(pidData.proyecto.fechaFin)
          };
          projectUpdate.proyecto = await update('proyectos', filter, pidData.proyecto);
        }
        if (pidData && pidData.pid) {
          projectUpdate.pid = await update('pids', { idProyectoPid: idPid }, pidData.pid)
        }
        if (pidData && pidData.investigadores) {
          console.log("Investigadores: ", pidData.investigadores)
          let bandera = false;

          try {
            await deleteByFilter('participa', filter)
            bandera = true
            console.log('delete')
          } catch {
            bandera = false
          }
          if (bandera) {
            const investigadoresP = pidData.investigadores.map(investigador => ({
              ...investigador,
              idProyecto: idPid,
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
      }
    } else {
      throw new Error(`El proyecto con id ${idPid} no existe`)
    }

    // console.log(proyectoSearch);

    // const updatedPid = await update('pids', filter, pidData);
    // return updatedPid;
    return projectUpdate
  } catch (error) {
    throw new Error(error.message);
  }
}