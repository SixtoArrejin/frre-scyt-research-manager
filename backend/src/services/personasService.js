
import { readAllPersonas} from '../repository/personasRepository.js';

export async function readAllPersonasService() {
    try {
      const personas = await readAllPersonas();
        return personas
    } catch (error) {
      throw new Error(error.message);
    }
  }