import { update } from '../repository/baseRepository.js';
import {
  getAllVinculaciones,
  getVinculacionById,
  createDesembolso,
  getDesembolsoById,
} from '../repository/vinculacionesRepository.js';
import convertToISOString from '../utils/funciones.js';

export async function getAllVinculacionesService() {
  try {
    const vinculaciones = await getAllVinculaciones();
    return vinculaciones
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getVinculacionByIdService(idVinculacion) {
  try {
    const vinculacion = await getVinculacionById(idVinculacion);
    return vinculacion
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createDesembolsoService(desembolsoData) {
  try {
    desembolsoData.fechaDesembolso = convertToISOString(desembolsoData.fechaDesembolso);
    // desembolsoData.fechaAprobado = convertToISOString(desembolsoData.fechaAprobado);
    desembolsoData.estado = "En ejecución"
    console.log(desembolsoData.fechaDesembolso)
    const newDesembolso = await createDesembolso(desembolsoData);
    return newDesembolso;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDesembolsoByIdService(idDesembolso) {
  try {
    const desembolso = await getDesembolsoById(idDesembolso);
    return desembolso
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateDesembolsoService(idDesembolso, desembolsoData) {
  try {
    const filter = { idDesembolso };
    const updatedDesembolso = await update('desembolsos', filter, desembolsoData);
    return updatedDesembolso;
  } catch (error) {
    throw new Error(error.message);
  }
}