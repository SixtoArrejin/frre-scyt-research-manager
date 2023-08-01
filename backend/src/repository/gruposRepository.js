import { getAll } from './baseRepository.js';
import {prisma} from '../db.js'

export async function getAllGrupos() {
    const includeRelations = ['personas', 'tiene']
    return await getAll('gruposinvestigacion', includeRelations);
}
