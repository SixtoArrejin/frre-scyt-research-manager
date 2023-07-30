
import {
    getAllUsuarios
  } from '../repository/usuariosRepository.js';
  
  export async function getAllUsuariosService() {
    try {
      const usuarios = await getAllUsuarios();
      return usuarios
    } catch (error) {
      throw new Error(error.message);
    }
  }