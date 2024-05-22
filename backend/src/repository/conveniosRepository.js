
import { getAll, create, update, getById } from './baseRepository.js';
import { prisma } from '../db.js';

export async function createConvenio(idVinculacion, dataConvenio) {
    const convenioData = {
      tipo: dataConvenio.tipoConvenio,
      numero: dataConvenio.nroConvenio,
      idVinculacion: idVinculacion
    }
    console.log(convenioData)
    try {
      const newVinculacion = await create('convenios', convenioData);
      return newVinculacion;
    } catch (error) {
      throw new Error(error.message);
    }
  }