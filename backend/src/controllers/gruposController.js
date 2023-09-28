import { getAllGruposService, getGrupoByIdService, updateGrupoService, createGrupoService } from '../services/gruposService.js';
import convertToISOString from '../utils/funciones.js'

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

  grupoData.fechaCreacion = convertToISOString(grupoData.fechaCreacion); 

  try {
    const updatedGrupo = await updateGrupoService(idGrupo, grupoData);
    return res.status(200).json({ message: 'Grupo actualizado exitosamente', success: true, updatedGrupo });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function createGrupo(req, res) {
  try {
    const grupoData = req.body;
    // grupoData.fechaCreacion = convertToISOString(grupoData.fechaCreacion);
    const newGrupo = await createGrupoService(grupoData);
    return res.status(201).json({ message: 'Grupo creado exitosamente', success: true, newGrupo });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}