
import { getAllGrupos, getGrupoById} from '../repository/gruposRepository.js';

 
export async function getAllGruposService() {
    try {
      const grupos = await getAllGrupos();
        return grupos
    } catch (error) {
      throw new Error(error.message);
    }
  }

  export async function getGrupoByIdService(idGrupoInvestigacion) {
    try {
      const grupo = await getGrupoById(idGrupoInvestigacion);
      return grupo
    } catch (error) {
      throw new Error(error.message);
    }
  }