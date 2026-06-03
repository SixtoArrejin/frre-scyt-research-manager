import {
    getAll,
    create,
    update,
    getById,
  } from './baseRepository.js';
  import { prisma } from '../db.js';
  
  export async function getAllRegionales() {
    const includeRelations = [];
    return await getAll('regionales', includeRelations);
  }