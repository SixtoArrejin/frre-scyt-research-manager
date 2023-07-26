import { readAll } from './baseRepository.js';
import {prisma} from '../db.js'

export async function readAllGrupos() {
    const includeRelations = ['persona', 'tiene']
    return await readAll('grupoinvestigacion', includeRelations);
}
