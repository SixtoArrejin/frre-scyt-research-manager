import { readAll } from './baseRepository.js';
import {prisma} from '../db.js'

export async function readAllPersonas() {
    const includeRelations = ['grupoinvestigacion', 'categorias', 'participa']
    return await readAll('persona', includeRelations);
} 
