import {
  getAllProyectos,
  getProyectosPids,
  getProyectosExternos,
  getProyectoById,
  createProyecto,
  createProyectoPID,
  createTiene,
} from '../repository/proyectosRepository.js';

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
    const newProyecto = await createProyecto(proyectoData);
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