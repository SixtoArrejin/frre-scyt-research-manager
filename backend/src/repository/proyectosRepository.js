import { getAll, create, update, getById } from './baseRepository.js';
import { prisma } from '../db.js';

export async function getAllProyectos() {
  const includeRelations = ['participa', 'proyectosexternos', 'pids', 'personas_proyectos_idDirectorTopersonas', 'personas_proyectos_idCodirectorTopersonas'];
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

