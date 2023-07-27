import { getAll } from './baseRepository.js';
import {prisma} from '../db.js'

export async function getAllGrupos() {
    const includeRelations = ['persona', 'tiene']
    return await getAll('grupoinvestigacion', includeRelations);
}
