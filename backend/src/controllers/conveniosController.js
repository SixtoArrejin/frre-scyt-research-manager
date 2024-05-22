import { getById } from '../repository/baseRepository.js';
import { deleteConvenioService } from '../services/conveniosService.js';

export async function deleteConvenio(req, res) {
  try {
    const idConvenio = parseInt(req.params.idConvenio, 10);
    const convenio = await getById('convenios', 'idConvenio', idConvenio); //-- ACA QUEDE
    console.log(convenio)
    if (!convenio) {
      return res.status(404).json({ message: 'Convenio no encontrado', success: false });
    }

    await deleteConvenioService(idConvenio);

    return res.status(200).json({ message: 'Convenio eliminado exitosamente', success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}