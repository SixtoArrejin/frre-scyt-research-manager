import jwt from 'jsonwebtoken';
import { getByUsername } from '../repository/usuariosRepository.js';
import { hasPermission, ACTIONS } from '../config/roles.js';

// Middleware para proteger las rutas con token
export function validateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Token no proporcionado', success: false });
  }

  try {
    const decodedToken = jwt.verify(token, 'secreto'); //Establecer una clave mas seguro que "secreto" y colocarlo en variables de entorno
    req.userData = { usuario: decodedToken.usuario, rol: decodedToken.rol };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido', success: false });
  }
}

// Middleware para verificar permisos específicos
export function requirePermission(resource, action) {
  return async (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.userData || !req.userData.usuario) {
        return res
          .status(401)
          .json({ message: 'Usuario no autenticado', success: false });
      }

      // Obtener los datos del usuario de la base de datos para asegurar que el rol esté actualizado
      const usuario = await getByUsername(req.userData.usuario);
      if (!usuario || !usuario.activo) {
        return res
          .status(401)
          .json({
            message: 'Usuario no encontrado o inactivo',
            success: false,
          });
      }

      // Verificar permisos
      if (!hasPermission(usuario.rol, resource, action)) {
        return res.status(403).json({
          message: `No tienes permisos para ${action} en ${resource}`,
          success: false,
        });
      }

      // Agregar el rol actualizado al request
      req.userData.rol = usuario.rol;
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message, success: false });
    }
  };
}

// Middleware específico para operaciones de lectura
export function requireReadPermission(resource) {
  return requirePermission(resource, ACTIONS.READ);
}

// Middleware específico para operaciones de escritura
export function requireWritePermission(resource) {
  return requirePermission(resource, ACTIONS.CREATE);
}

// Middleware específico para operaciones de actualización
export function requireUpdatePermission(resource) {
  return requirePermission(resource, ACTIONS.UPDATE);
}

// Middleware específico para operaciones de eliminación
export function requireDeletePermission(resource) {
  return requirePermission(resource, ACTIONS.DELETE);
}
