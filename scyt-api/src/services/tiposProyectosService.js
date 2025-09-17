
import {
  getAllTiposProyectos,
} from '../repository/tiposProyectosRepository.js';

export async function getAllTiposProyectosService() {
  try {
    const tipos = await getAllTiposProyectos();
    return tipos;
  } catch (error) {
    throw new Error(error.message);
  }
}
