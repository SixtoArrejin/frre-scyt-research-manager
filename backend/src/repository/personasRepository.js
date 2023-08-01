import {
  getAll,
  create,
  update,
} from './baseRepository.js';
import { prisma } from '../db.js'

export async function getAllPersonas() {
  const includeRelations = ['gruposinvestigacion', 'categorias', 'participa']
  return await getAll('personas', includeRelations);
}

export async function createPersona(personaData) {
  try {
    const newPersona = await create('personas', personaData);
    return newPersona;
  } catch (error) {
    throw new Error(error.message);
  }
}