import { getAllVinculaciones } from '../repository/vinculacionesRepository.js';

export async function getAllVinculacionesService() {
    try {
        const vinculaciones = await getAllVinculaciones();
        return vinculaciones
    } catch (error) {
        throw new Error(error.message);
    }
}
