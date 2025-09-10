// Definición de roles y permisos del sistema
export const ROLES = {
  ADMIN: "admin",
  PID: "pid",
  RRHH: "rrhh",
  UVT: "uvt",
  VIEWER: "viewer",
};

// Definición de recursos y acciones
export const RESOURCES = {
  PROYECTOS: "proyectos",
  PERSONAS: "personas",
  VINCULACIONES: "vinculaciones",
  USUARIOS: "usuarios",
  GRUPOS: "grupos",
  CATEGORIAS: "categorias",
  REGIONALES: "regionales",
  TIPOS_PROYECTOS: "tiposProyectos",
  CONVENIOS: "convenios",
};

export const ACTIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
};

// Matriz de permisos: rol -> recurso -> acciones permitidas
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    // Admin puede hacer todo
    [RESOURCES.PROYECTOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.PERSONAS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.VINCULACIONES]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.USUARIOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.GRUPOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.CATEGORIAS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.REGIONALES]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.TIPOS_PROYECTOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.CONVENIOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
  },

  [ROLES.PID]: {
    // PID: especialista en proyectos
    [RESOURCES.PROYECTOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.PERSONAS]: [ACTIONS.READ], // Solo lectura de personas
    [RESOURCES.VINCULACIONES]: [ACTIONS.READ],
    [RESOURCES.GRUPOS]: [ACTIONS.READ],
    [RESOURCES.CATEGORIAS]: [ACTIONS.READ],
    [RESOURCES.REGIONALES]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.TIPOS_PROYECTOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.CONVENIOS]: [ACTIONS.READ],
    // PID no tiene acceso a gestión de usuarios
  },

  [ROLES.RRHH]: {
    // RRHH: especialista en recursos humanos (personas, categorías)
    [RESOURCES.PROYECTOS]: [ACTIONS.READ],
    [RESOURCES.PERSONAS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.VINCULACIONES]: [ACTIONS.READ],
    [RESOURCES.GRUPOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.CATEGORIAS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.REGIONALES]: [ACTIONS.READ],
    [RESOURCES.TIPOS_PROYECTOS]: [ACTIONS.READ],
    [RESOURCES.CONVENIOS]: [ACTIONS.READ],
    // RRHH no tiene acceso a gestión de usuarios
  },

  [ROLES.UVT]: {
    // UVT: especialista en vinculación tecnológica
    [RESOURCES.PROYECTOS]: [ACTIONS.READ],
    [RESOURCES.PERSONAS]: [ACTIONS.READ],
    [RESOURCES.VINCULACIONES]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    [RESOURCES.GRUPOS]: [ACTIONS.READ],
    [RESOURCES.CATEGORIAS]: [ACTIONS.READ],
    [RESOURCES.REGIONALES]: [ACTIONS.READ],
    [RESOURCES.TIPOS_PROYECTOS]: [ACTIONS.READ],
    [RESOURCES.CONVENIOS]: [
      ACTIONS.CREATE,
      ACTIONS.READ,
      ACTIONS.UPDATE,
      ACTIONS.DELETE,
    ],
    // UVT no tiene acceso a gestión de usuarios
  },

  [ROLES.VIEWER]: {
    // Viewer: solo lectura
    [RESOURCES.PROYECTOS]: [ACTIONS.READ],
    [RESOURCES.PERSONAS]: [ACTIONS.READ],
    [RESOURCES.VINCULACIONES]: [ACTIONS.READ],
    [RESOURCES.GRUPOS]: [ACTIONS.READ],
    [RESOURCES.CATEGORIAS]: [ACTIONS.READ],
    [RESOURCES.REGIONALES]: [ACTIONS.READ],
    [RESOURCES.TIPOS_PROYECTOS]: [ACTIONS.READ],
    [RESOURCES.CONVENIOS]: [ACTIONS.READ],
    // Viewer no puede ver usuarios
  },
};

// Función para verificar si un rol tiene permiso para realizar una acción en un recurso
export function hasPermission(userRole, resource, action) {
  const rolePermissions = PERMISSIONS[userRole];
  if (!rolePermissions) return false;

  const resourcePermissions = rolePermissions[resource];
  if (!resourcePermissions) return false;

  return resourcePermissions.includes(action);
}

// Función para obtener todos los permisos de un rol
export function getRolePermissions(role) {
  return PERMISSIONS[role] || {};
}
