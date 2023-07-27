
import { getAllPersonas } from '../repository/personasRepository.js';
import { createPersona } from '../repository/personasRepository.js';

export async function getAllPersonasService() {
  try {
    const personas = await getAllPersonas();
    return personas
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createPersonaService(personaData) {
  try {
    const newPersona = await createPersona(personaData);
    return newPersona;
  } catch (error) {
    throw new Error(error.message);
  }
}