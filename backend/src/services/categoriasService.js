
import { createCategoria } from '../repository/categoriasRepository.js';
import { update } from '../repository/baseRepository.js';

export async function createCategoriaService(categoriaData) {
    try {
        const newCategoria = await createCategoria(categoriaData);
        return newCategoria;
    } catch (error) {
        throw new Error(error.message);
    }
}
