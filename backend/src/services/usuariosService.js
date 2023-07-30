import { getAllUsuarios, createUsuario } from '../repository/usuariosRepository.js';
import bcrypt from 'bcrypt';

export async function getAllUsuariosService() {
    try {
        const usuarios = await getAllUsuarios();
        return usuarios
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function createUsuarioService(usuarioData) {
  try {
    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(usuarioData.contrasena, 10);
    const usuarioDataWithHashedPassword = { ...usuarioData, contrasena: hashedPassword };

    const newUsuario = await createUsuario(usuarioDataWithHashedPassword);
    return newUsuario;
  } catch (error) {
    throw new Error(error.message);
  }
}
