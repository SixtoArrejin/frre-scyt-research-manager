import {
  create, getById,
} from './baseRepository.js';
import { prisma } from '../db.js';

export async function createCategoria(categoriaData) {
  try {
    const newCategoria = await create('categorias', categoriaData);
    return newCategoria;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCategoriaById(idCategoria) {
  const includeRelations = ['personas'];
  return await getById('categorias', 'idCategoria', idCategoria, includeRelations);
}

export async function deleteCategoria(idCategoria) {
  try {
    const deletedCategoria = await prisma.categorias.delete({
      where: { idCategoria },
    });
    return deletedCategoria;
  } catch (error) {
    throw new Error(`Error al eliminar la categoría de la BD: ${error.message}`);
  }
}