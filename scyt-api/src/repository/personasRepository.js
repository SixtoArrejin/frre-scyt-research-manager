import {
  getAll,
  create,
  update,
  getById,
  getByField
} from './baseRepository.js';
import { prisma } from '../db.js'

export async function getAllPersonas() {
  const includeRelations = ['gruposinvestigacion', 'categorias', 'participa']
  return await getAll('personas', includeRelations);
}

export async function getPersonaById(idPersona) {
  const includeRelations = ['gruposinvestigacion', 'categorias', 'participa']
  return await getById('personas', 'idPersona', idPersona, includeRelations);
}

export async function getPersonasByGroup(idGrupo) {
  const includeRelations = ['gruposinvestigacion', 'categorias', 'participa']
  return await getByField('personas', 'idGrupoInvestigacion', idGrupo, includeRelations);
}

export async function createPersona(personaData) {
  try {
    const newPersona = await create('personas', personaData);
    return newPersona;
  } catch (error) {
    throw new Error(error.message);
  }
}