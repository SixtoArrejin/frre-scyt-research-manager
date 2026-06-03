import { prisma } from '../db.js';
import {
  create,
  getAll,
  getByField,
  getById,
  update,
  deleteRecord,
} from './baseRepository.js';

export async function getAllPropiedadIntelectual() {
  const includeRelations = [
    'proyectos',
    {
      investigadores: ['personas'],
    },
  ];
  return await getAll('propiedadintelectual', includeRelations);
}

export async function getPropiedadIntelectualById(idPI) {
  const includeRelations = [
    'proyectos',
    {
      investigadores: ['personas'],
    },
  ];
  return await getById(
    'propiedadintelectual',
    'idPI',
    idPI,
    includeRelations,
  );
}

export async function createPropiedadIntelectual(piData) {
  try {
    const newPI = await create('propiedadintelectual', piData);
    return newPI;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function createInvestigadorPI(investigadorData) {
  try {
    const newInvestigador = await create('investigadorespi', investigadorData);
    return newInvestigador;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function deleteInvestigadorPI(idPI, idPersona) {
  try {
    const deleted = await prisma.investigadorespi.delete({
      where: {
        idPI_idPersona: {
          idPI: idPI,
          idPersona: idPersona,
        },
      },
    });
    return deleted;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function deletePropiedadIntelectual(idPI) {
  try {
    const deleted = await prisma.propiedadintelectual.delete({
      where: { idPI },
    });
    return deleted;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}
