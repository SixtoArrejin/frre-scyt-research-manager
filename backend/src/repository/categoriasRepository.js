import {
    create,
  } from './baseRepository.js';
  import { prisma } from '../db.js'

  export async function createCategoria(categoriaData) {
    try {
      const newCategoria = await create('categorias', categoriaData);
      return newCategoria;
    } catch (error) {
      throw new Error(error.message);
    }
  }