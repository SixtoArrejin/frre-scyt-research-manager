import { getAllUsuariosService, createUsuarioService } from '../services/usuariosService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getByUsername } from '../repository/usuariosRepository.js';

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

export async function login(req, res) {
  const { usuario, contrasena } = req.body;

  try {
    // Buscar el usuario en la base de datos por su nombre de usuario
    const usuarioData = await getByUsername(usuario);

    if (!usuario || !contrasena) {
      return res.status(400).json({ message: 'Se requiere usuario y contraseña en el body', success: false });
    }

    if (!usuarioData) {
      return res.status(404).json({ message: 'Usuario no encontrado', success: false });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(contrasena, usuarioData.contrasena);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas', success: false });
    }

    // Generar el token JWT
    const token = jwt.sign({ usuario: usuarioData.usuario }, 'secreto', { expiresIn: '1h' });

    return res.status(200).json({ message: 'Inicio de sesión exitoso', success: true, usuario: usuarioData.usuario, token });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}