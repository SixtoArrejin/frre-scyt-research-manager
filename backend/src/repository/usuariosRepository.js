import {
    getAll
  } from './baseRepository.js';
  import { prisma } from '../db.js'
  
  export async function getAllUsuarios() {
    return await getAll('usuarios');
  }