import { getAll, create, update, getById } from './baseRepository.js';
import { prisma } from '../db.js';

export async function getAllProyectos() {
  const includeRelations = ['participa', 'proyectosexternos', 'pids', 'personas_proyectos_idDirectorTopersonas', 'personas_proyectos_idCodirectorTopersonas', 'tiene'];
  return await getAll('proyectos', includeRelations);
}

export async function getProyectosPids() {
  const includeRelations = ["proyectos"];
  return await getAll('pids', includeRelations);
}

export async function getProyectosExternos(subtipo = null) {
  if (subtipo === 'financiamiento') {
    const includeRelations = [{proyectosexternos: ["proyectos"]}];
    return await getAll('proyectosconfinanciamiento', includeRelations);
  };
  //falta el caso en que el subtipo='sinFinanciamiento' pero aún no implementamos esa tabla
  const includeRelations = ['proyectos', 'proyectosconfinanciamiento'];
  return await getAll('proyectosexternos', includeRelations);
}

export async function getProyectoById(idProyecto){
  const includeRelations = [ 'pids', 'proyectosexternos', {participa: [{personas: ['categorias']}]}, {tiene: ['gruposinvestigacion']}];
  return await getById('proyectos', 'idProyecto', idProyecto, includeRelations);
}

export async function createProyecto(proyectoData) {
  try {
    const newProyecto = await create('proyectos', proyectoData);
    return newProyecto;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createProyectoPID(proyectoPIDData) {
  try {
    const newProyectoPID = await create('pids', proyectoPIDData);
    return newProyectoPID;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createTiene(tieneData) {
  try {
    const newTine = await create('tiene', tieneData);
    return newTine;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createParticipa(dataParticipa) {
  try {
    const newParticipacion = await create('participa', dataParticipa);
    return newParticipacion;
  } catch (error) {
    throw new Error(error.message);
  }
}