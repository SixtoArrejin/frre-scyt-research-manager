import { getAll, create } from './baseRepository.js';
import { prisma } from '../db.js'

export async function getAllPersonas() {
  const includeRelations = ['grupoinvestigacion', 'categorias', 'participa']
  return await getAll('persona', includeRelations);
}

export async function createPersona(personaData) {
  try {
    const newPersona = await create('persona', personaData);
    return newPersona;
  } catch (error) {
    throw new Error(error.message);
  }
}
