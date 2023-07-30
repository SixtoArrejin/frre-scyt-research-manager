import { getAllUsuariosService, createUsuarioService } from '../services/usuariosService.js';

export async function getUsuarios(req, res) {
  try {
    const usuarios = await getAllUsuariosService();
    return res.status(200).json({ message: 'Usuarios encontrados', success: true, usuarios });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function createUsuario(req, res) {
    try {
      const userData = req.body;
      const newUser = await createUsuarioService(userData);
      return res.status(201).json({ message: 'Usuario creado exitosamente', success: true, newUser });
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  }