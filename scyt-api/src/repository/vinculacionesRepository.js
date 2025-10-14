import { prisma } from '../db.js';
import {
  create,
  getAll,
  getByField,
  getById,
  update,
} from './baseRepository.js';

export async function getAllVinculaciones() {
  const includeRelations = [
    'proyectos',
    'vinculacionesconfinanciamiento',
    'vinculacionessinfinanciamiento',
    'convenios',
    'responsable',
  ];
  return await getAll('vinculaciones', includeRelations);
}

export async function getVinculacionById(idVinculacion) {
  const includeRelations = [
    'proyectos',
    { vinculacionesconfinanciamiento: ['desembolsos'] },
    'vinculacionessinfinanciamiento',
    'convenios',
    'responsable',
  ];
  return await getById(
    'vinculaciones',
    'idVinculacion',
    idVinculacion,
    includeRelations,
  );
}

export async function createDesembolso(desembolsoData) {
  try {
    const newDesembolso = await create('desembolsos', desembolsoData);
    const { idDesembolso, idConFinanciamiento } = newDesembolso;

    const desembolsoPrevio = await prisma.desembolsos.findFirst({
      where: {
        idConFinanciamiento: idConFinanciamiento,
        idDesembolso: { lt: idDesembolso }, // Filtrar solo los que tienen un ID menor
      },
      orderBy: { idDesembolso: 'desc' }, // Ordenar de mayor a menor y tomar el primero
    });
    
    if (desembolsoPrevio && desembolsoPrevio.idDesembolso) {
      await update('desembolsos', { idDesembolso: desembolsoPrevio.idDesembolso }, { estado: 'Aprobado' });
    }

    return newDesembolso;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function getDesembolsoById(idDesembolso) {
  return await getById('desembolsos', 'idDesembolso', idDesembolso);
}

export async function getDesembolsosByIdVinculacion(idVinculacion) {
  return await getByField('desembolsos', 'idConFinanciamiento', idVinculacion);
}