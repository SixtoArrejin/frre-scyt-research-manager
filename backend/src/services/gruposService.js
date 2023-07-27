
import { getAllGrupos} from '../repository/gruposRepository.js';

 
export async function getAllGruposService() {
    try {
      const grupos = await getAllGrupos();
        return grupos
    } catch (error) {
      throw new Error(error.message);
    }
  }