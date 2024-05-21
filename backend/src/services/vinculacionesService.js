import { getAllVinculaciones,
    getVinculacionById,
 } from '../repository/vinculacionesRepository.js';

export async function getAllVinculacionesService() {
    try {
        const vinculaciones = await getAllVinculaciones();
        return vinculaciones
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getVinculacionByIdService(idVinculacion) {
    try {
      const vinculacion = await getVinculacionById(idVinculacion);
      return vinculacion
    } catch (error) {
      throw new Error(error.message);
    }
  }