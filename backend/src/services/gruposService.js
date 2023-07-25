
import { readAllGrupos} from '../repository/gruposRepository.js';

 
export async function readAllGruposService() {
    try {
      const grupos = await readAllGrupos();
        return grupos
    } catch (error) {
      throw new Error(error.message);
    }
  }