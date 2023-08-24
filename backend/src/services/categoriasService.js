
import { createCategoria, deleteCategoria, getCategoriaById } from '../repository/categoriasRepository.js';
import { update } from '../repository/baseRepository.js';

export async function createCategoriaService(categoriaData) {
    try {
        const newCategoria = await createCategoria(categoriaData);
        return newCategoria;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function deleteCategoriaService(idCategoria) {
    try {
      await deleteCategoria(idCategoria);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  export async function getCategoriaByIdService(idCategoria) {
    try {
      const categoria = await getCategoriaById(idCategoria);
      return categoria
    } catch (error) {
      throw new Error(error.message);
    }
  }