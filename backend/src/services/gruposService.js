
import { getAllGrupos, getGrupoById, createGrupo} from '../repository/gruposRepository.js';
import { update } from '../repository/baseRepository.js';

 
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

  export async function updateGrupoService(idGrupoInvestigacion, grupoData) {
    try {
      const filter = { idGrupoInvestigacion };
      const updatedGrupo = await update('gruposinvestigacion', filter, grupoData);
      return updatedGrupo;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  export async function createGrupoService(grupoData) {
    try {
      const newGrupo = await createGrupo(grupoData);
      return newGrupo;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  