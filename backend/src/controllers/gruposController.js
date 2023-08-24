import { getAllGruposService, getGrupoByIdService, updateGrupoService } from '../services/gruposService.js';

export async function getGrupos(req, res) {
  try {
    const grupos = await getAllGruposService();
    return res.status(200).json({ message: 'Grupos encontrados', success: true, grupos });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function getGruposById(req, res) {
  try {
    const {idGrupoInvestigacion} = req.params;
    const grupoId = parseInt(idGrupoInvestigacion);
    const grupo = await getGrupoByIdService(grupoId);
    return res.status(200).json({ message: 'Grupo encontrado', success: true, grupo });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function updateGrupoController(req, res) {
  const idGrupo = parseInt(req.params.idGrupoInvestigacion, 10);
  const grupoData = req.body;

  try {
    const updatedGrupo = await updateGrupoService(idGrupo, grupoData);
    return res.status(200).json({ message: 'Grupo actualizado exitosamente', success: true, updatedGrupo });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}