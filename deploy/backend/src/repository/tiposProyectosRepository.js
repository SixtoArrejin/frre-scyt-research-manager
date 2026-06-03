import {
  getAll,
  create,
  update,
  getById,
} from './baseRepository.js';
import { prisma } from '../db.js';

export async function getAllTiposProyectos() {
  const includeRelations = [];
  return await getAll('tiposproyectos', includeRelations);
}