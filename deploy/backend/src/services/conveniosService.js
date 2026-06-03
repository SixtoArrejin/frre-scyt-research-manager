import { createConvenio, deleteConvenio } from '../repository/conveniosRepository.js';

export async function createConvenioService(idVinculacion, convenioData) {
  try {
    const newConvenio = await createConvenio(idVinculacion, convenioData);
    return newConvenio;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteConvenioService(idConvenio) {
  try {
    await deleteConvenio(idConvenio);
  } catch (error) {
    throw new Error(error.message);
  }
}