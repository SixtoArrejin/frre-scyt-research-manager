import {
  getAllUsuariosService,
  createUsuarioService,
  updateUsuarioService,
  deleteUsuarioService,
} from "../services/usuariosService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getByUsername } from "../repository/usuariosRepository.js";
import { ROLES } from "../config/roles.js";

export async function getUsuarios(req, res) {
  try {
    const usuarios = await getAllUsuariosService();
    return res
      .status(200)
      .json({ message: "Usuarios encontrados", success: true, usuarios });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function createUsuario(req, res) {
  try {
    const userData = req.body;

    // Validar que el rol sea válido
    if (userData.rol && !Object.values(ROLES).includes(userData.rol)) {
      return res.status(400).json({
        message:
          "Rol inválido. Roles válidos: " + Object.values(ROLES).join(", "),
        success: false,
      });
    }

    // Agregar información del creador
    userData.creadoPor = req.userData.usuario;

    const newUser = await createUsuarioService(userData);
    return res
      .status(201)
      .json({ message: "Usuario creado exitosamente", success: true, newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function updateUsuario(req, res) {
  try {
    const { usuario } = req.params;
    const userData = req.body;

    // Validar que el rol sea válido si se está actualizando
    if (userData.rol && !Object.values(ROLES).includes(userData.rol)) {
      return res.status(400).json({
        message:
          "Rol inválido. Roles válidos: " + Object.values(ROLES).join(", "),
        success: false,
      });
    }

    // Solo admin puede cambiar roles de admin
    const targetUser = await getByUsername(usuario);
    if (targetUser?.rol === ROLES.ADMIN && req.userData.rol !== ROLES.ADMIN) {
      return res.status(403).json({
        message: "Solo un administrador puede modificar a otro administrador",
        success: false,
      });
    }

    const updatedUser = await updateUsuarioService(usuario, userData);
    return res.status(200).json({
      message: "Usuario actualizado exitosamente",
      success: true,
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

export async function deleteUsuario(req, res) {
  try {
    const { usuario } = req.params;

    // Prevenir que un usuario se elimine a sí mismo
    if (usuario === req.userData.usuario) {
      return res.status(400).json({
        message: "No puedes eliminar tu propio usuario",
        success: false,
      });
    }

    // Solo admin puede eliminar otros admins
    const targetUser = await getByUsername(usuario);
    if (targetUser?.rol === ROLES.ADMIN && req.userData.rol !== ROLES.ADMIN) {
      return res.status(403).json({
        message: "Solo un administrador puede eliminar a otro administrador",
        success: false,
      });
    }

    await deleteUsuarioService(usuario);
    return res
      .status(200)
      .json({ message: "Usuario eliminado exitosamente", success: true });
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
      return res.status(400).json({
        message: "Se requiere usuario y contraseña en el body",
        success: false,
      });
    }

    if (!usuarioData) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", success: false });
    }

    if (!usuarioData.activo) {
      return res
        .status(401)
        .json({ message: "Usuario inactivo", success: false });
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(
      contrasena,
      usuarioData.contrasena
    );

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Credenciales incorrectas", success: false });
    }

    // Generar el token JWT incluyendo el rol
    const token = jwt.sign(
      {
        usuario: usuarioData.usuario,
        rol: usuarioData.rol,
      },
      "secreto",
      { expiresIn: "1h" }
    );

    const { contrasena: contrasenaExcluir, ...usuarioDataSinContrasena } =
      usuarioData; // Excluir la contraseña del objeto de usuario
    console.log(usuarioDataSinContrasena);
    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      success: true,
      usuario: usuarioDataSinContrasena,
      token,
    });
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
}

// Nuevo endpoint para obtener los roles disponibles
export async function getRoles(req, res) {
  try {
    return res.status(200).json({
      message: "Roles disponibles",
      success: true,
      roles: Object.values(ROLES),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}

// Nuevo endpoint para obtener el perfil del usuario actual
export async function getProfile(req, res) {
  try {
    const usuarioData = await getByUsername(req.userData.usuario);
    if (!usuarioData) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", success: false });
    }

    // No devolver la contraseña
    const { contrasena, ...userProfile } = usuarioData;

    return res.status(200).json({
      message: "Perfil de usuario",
      success: true,
      perfil: userProfile,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
}
