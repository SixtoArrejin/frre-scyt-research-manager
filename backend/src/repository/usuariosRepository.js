import {
    getAll
} from './baseRepository.js';
import { prisma } from '../db.js'

export async function getAllUsuarios() {
    try {
        const data = await prisma['usuarios'].findMany();
        return data
    } catch (error) {
        throw new Error(`Error al obtener todos los registros de usuarios en la BD: ${error.message}`);
    }
}