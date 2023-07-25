import { readAll } from './baseRepository.js';
import {prisma} from '../db.js'

export async function readAllGrupos() {
    return await readAll('grupoinvestigacion');
}
