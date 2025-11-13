import { update } from '../repository/baseRepository.js';
import {
  getAllPropiedadIntelectual,
  getPropiedadIntelectualById,
  createPropiedadIntelectual,
  createInvestigadorPI,
  deleteInvestigadorPI,
  deletePropiedadIntelectual,
} from '../repository/propiedadIntelectualRepository.js';
import convertToISOString from '../utils/funciones.js';

export async function getAllPropiedadIntelectualService() {
  try {
    const propiedadIntelectual = await getAllPropiedadIntelectual();
    return propiedadIntelectual;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getPropiedadIntelectualByIdService(idPI) {
  try {
    const pi = await getPropiedadIntelectualById(idPI);
    return pi;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createPropiedadIntelectualService(piData) {
  try {
    // Convert dates
    if (piData.fechaInicio) {
      piData.fechaInicio = convertToISOString(piData.fechaInicio);
    }
    if (piData.fechaCierre) {
      piData.fechaCierre = convertToISOString(piData.fechaCierre);
    }

    // Extract investigators data before creating PI
    const investigadores = piData.investigadores || [];
    delete piData.investigadores;

    // Create PI
    const newPI = await createPropiedadIntelectual(piData);

    // Add investigators
    if (investigadores.length > 0) {
      for (const investigador of investigadores) {
        await createInvestigadorPI({
          idPI: newPI.idPI,
          idPersona: investigador.idPersona,
          porcentajeParticipacion: investigador.porcentajeParticipacion,
        });
      }
    }

    return newPI;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updatePropiedadIntelectualService(idPI, piData) {
  try {
    const filter = { idPI };

    // Convert dates
    if (piData.fechaInicio === '') {
      piData.fechaInicio = null;
    } else if (piData.fechaInicio) {
      piData.fechaInicio = convertToISOString(piData.fechaInicio);
    }

    if (piData.fechaCierre === '') {
      piData.fechaCierre = null;
    } else if (piData.fechaCierre) {
      piData.fechaCierre = convertToISOString(piData.fechaCierre);
    }

    // Extract investigators data
    const investigadores = piData.investigadores;
    delete piData.investigadores;

    // Update PI main data
    const updatedPI = await update('propiedadintelectual', filter, piData);

    // Handle investigators update if provided
    if (investigadores !== undefined) {
      // Get current investigators
      const currentPI = await getPropiedadIntelectualById(idPI);
      const currentInvestigadores = currentPI.investigadores || [];

      // Create maps for comparison
      const currentMap = new Map(
        currentInvestigadores.map((inv) => [inv.idPersona, inv])
      );
      const newMap = new Map(
        investigadores.map((inv) => [inv.idPersona, inv])
      );

      // Remove investigators that are not in the new list
      for (const current of currentInvestigadores) {
        if (!newMap.has(current.idPersona)) {
          await deleteInvestigadorPI(idPI, current.idPersona);
        }
      }

      // Add or update investigators
      for (const investigador of investigadores) {
        if (currentMap.has(investigador.idPersona)) {
          // Update existing
          await update(
            'investigadorespi',
            {
              idPI_idPersona: {
                idPI: idPI,
                idPersona: investigador.idPersona,
              },
            },
            {
              porcentajeParticipacion: investigador.porcentajeParticipacion,
            }
          );
        } else {
          // Add new
          await createInvestigadorPI({
            idPI: idPI,
            idPersona: investigador.idPersona,
            porcentajeParticipacion: investigador.porcentajeParticipacion,
          });
        }
      }
    }

    return updatedPI;
  } catch (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function deletePropiedadIntelectualService(idPI) {
  try {
    const deleted = await deletePropiedadIntelectual(idPI);
    return deleted;
  } catch (error) {
    throw new Error(error.message);
  }
}
