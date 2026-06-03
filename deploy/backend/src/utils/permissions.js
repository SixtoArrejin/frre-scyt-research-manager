// Utilidades para verificar permisos en el frontend
import { ROLES, RESOURCES, ACTIONS, hasPermission } from './roles.js';

// Función para verificar si el usuario actual puede realizar una acción
export function canUserPerform(userRole, resource, action) {
  return hasPermission(userRole, resource, action);
}

// Funciones específicas para facilitar el uso en componentes
export function canCreateProjects(userRole) {
  return canUserPerform(userRole, RESOURCES.PROYECTOS, ACTIONS.CREATE);
}

export function canEditProjects(userRole) {
  return canUserPerform(userRole, RESOURCES.PROYECTOS, ACTIONS.UPDATE);
}

export function canDeleteProjects(userRole) {
  return canUserPerform(userRole, RESOURCES.PROYECTOS, ACTIONS.DELETE);
}

export function canCreatePersons(userRole) {
  return canUserPerform(userRole, RESOURCES.PERSONAS, ACTIONS.CREATE);
}

export function canEditPersons(userRole) {
  return canUserPerform(userRole, RESOURCES.PERSONAS, ACTIONS.UPDATE);
}

export function canDeletePersons(userRole) {
  return canUserPerform(userRole, RESOURCES.PERSONAS, ACTIONS.DELETE);
}

export function canCreateVinculaciones(userRole) {
  return canUserPerform(userRole, RESOURCES.VINCULACIONES, ACTIONS.CREATE);
}

export function canEditVinculaciones(userRole) {
  return canUserPerform(userRole, RESOURCES.VINCULACIONES, ACTIONS.UPDATE);
}

export function canDeleteVinculaciones(userRole) {
  return canUserPerform(userRole, RESOURCES.VINCULACIONES, ACTIONS.DELETE);
}

export function canManageUsers(userRole) {
  return (
    canUserPerform(userRole, RESOURCES.USUARIOS, ACTIONS.CREATE) ||
    canUserPerform(userRole, RESOURCES.USUARIOS, ACTIONS.UPDATE) ||
    canUserPerform(userRole, RESOURCES.USUARIOS, ACTIONS.DELETE)
  );
}

export function isAdmin(userRole) {
  return userRole === ROLES.ADMIN;
}

export function isPID(userRole) {
  return userRole === ROLES.PID;
}

export function isRRHH(userRole) {
  return userRole === ROLES.RRHH;
}

export function isUVT(userRole) {
  return userRole === ROLES.UVT;
}

export function isViewer(userRole) {
  return userRole === ROLES.VIEWER;
}

// Función para obtener un mensaje descriptivo del rol
export function getRoleDescription(role) {
  const descriptions = {
    [ROLES.ADMIN]: 'Administrador del sistema',
    [ROLES.PID]: 'Especialista en Proyectos de I+D',
    [ROLES.RRHH]: 'Especialista en Recursos Humanos',
    [ROLES.UVT]: 'Especialista en Vinculación Tecnológica',
    [ROLES.VIEWER]: 'Usuario con permisos de solo lectura',
  };

  return descriptions[role] || 'Rol desconocido';
}

// Función para obtener las capacidades de un rol en formato legible
export function getRoleCapabilities(role) {
  const capabilities = {
    [ROLES.ADMIN]: [
      'Gestión completa del sistema',
      'Crear y administrar usuarios',
      'Acceso total a todos los módulos',
    ],
    [ROLES.PID]: [
      'Crear y modificar proyectos',
      'Gestionar tipos de proyectos y regionales',
      'Ver información de personas y vinculaciones',
    ],
    [ROLES.RRHH]: [
      'Gestionar personas e investigadores',
      'Administrar grupos de investigación',
      'Gestionar categorías de personal',
      'Ver proyectos y vinculaciones',
    ],
    [ROLES.UVT]: [
      'Gestionar vinculaciones tecnológicas',
      'Administrar convenios',
      'Gestionar desembolsos',
      'Ver proyectos y personal',
    ],
    [ROLES.VIEWER]: [
      'Solo lectura de la información',
      'No puede modificar datos',
      'Acceso limitado a usuarios',
    ],
  };

  return capabilities[role] || ['Capacidades no definidas'];
}
