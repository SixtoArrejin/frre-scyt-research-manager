import { getAllGruposService } from '../services/gruposService.js';

export async function getGrupos(req, res) {
  try {
    const grupos = await getAllGruposService();
    return res.status(200).json({ message: 'Grupos encontrados', success: true, grupos });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}