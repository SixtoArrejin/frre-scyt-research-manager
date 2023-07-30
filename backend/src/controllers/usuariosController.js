import { getAllUsuariosService } from '../services/usuariosService.js';

export async function getUsuarios(req, res) {
  try {
    const usuarios = await getAllUsuariosService();
    return res.status(200).json({ message: 'Usuarios encontrados', success: true, usuarios });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}