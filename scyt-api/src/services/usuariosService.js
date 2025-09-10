import {
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../repository/usuariosRepository.js";
import bcrypt from "bcrypt";

export async function getAllUsuariosService() {
  try {
    const usuarios = await getAllUsuarios();
    // No devolver las contraseñas
    return usuarios.map((usuario) => {
      const { contrasena, ...usuarioSinContrasena } = usuario;
      return usuarioSinContrasena;
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function createUsuarioService(usuarioData) {
  try {
    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(usuarioData.contrasena, 10);
    const usuarioDataWithHashedPassword = {
      ...usuarioData,
      contrasena: hashedPassword,
    };

    const newUsuario = await createUsuario(usuarioDataWithHashedPassword);

    // No devolver la contraseña
    const { contrasena, ...usuarioSinContrasena } = newUsuario;
    return usuarioSinContrasena;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateUsuarioService(usuario, usuarioData) {
  try {
    // Si se está actualizando la contraseña, encriptarla
    if (usuarioData.contrasena) {
      const hashedPassword = await bcrypt.hash(usuarioData.contrasena, 10);
      usuarioData.contrasena = hashedPassword;
    }

    const updatedUsuario = await updateUsuario(usuario, usuarioData);

    // No devolver la contraseña
    const { contrasena, ...usuarioSinContrasena } = updatedUsuario;
    return usuarioSinContrasena;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteUsuarioService(usuario) {
  try {
    return await deleteUsuario(usuario);
  } catch (error) {
    throw new Error(error.message);
  }
}
