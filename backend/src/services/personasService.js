
import {
  getAllPersonas,
  createPersona,
} from '../repository/personasRepository.js';
import { update } from '../repository/baseRepository.js';

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

export async function updatePersonaService(idPersona, personaData) {
  try {
    const filter = { idPersona };
    const updatedPersona = await update('personas', filter, personaData);
    return updatedPersona;
  } catch (error) {
    throw new Error(error.message);
  }
}