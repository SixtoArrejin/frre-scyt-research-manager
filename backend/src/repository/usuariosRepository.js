import {
    getAll, create
  } from './baseRepository.js';
  import { prisma } from '../db.js'
  
  export async function getAllUsuarios() {
    return await getAll('usuarios');
  }
  
  export async function createUsuario(personaData) {
    try {
      const newPersona = await create('usuarios', personaData);
      return newPersona;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  export async function getByUsername(username) {
    try {
      const usuarioData = await prisma.usuarios.findUnique({
        where: { usuario: username },
      });
      return usuarioData;
    } catch (error) {
      throw new Error(error.message);
    }
  }