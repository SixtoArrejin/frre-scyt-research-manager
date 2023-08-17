import { getAll, getById} from './baseRepository.js';
import {prisma} from '../db.js'

export async function getAllGrupos() {
    const includeRelations = ['personas', 'tiene']
    return await getAll('gruposinvestigacion', includeRelations);
}

export async function getGrupoById(idGrupoInvestigacion) {
    const includeRelations = []
    return await getById('gruposinvestigacion', 'idGrupoInvestigacion', idGrupoInvestigacion, includeRelations);
  }
  