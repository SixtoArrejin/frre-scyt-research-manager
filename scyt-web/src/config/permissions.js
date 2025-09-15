/**
 * Configuración de permisos del sistema
 * Define qué roles pueden realizar qué acciones en cada módulo
 *
 * Roles disponibles:
 * - admin: Pueden crear y modificar cualquier recurso y acceder especialmente a los usuarios
 * - rrhh: Pueden crear y modificar la info de los investigadores y los grupos de investigación
 * - pid: Pueden crear y modificar los datos de los proyectos
 * - uvt: Pueden crear y modificar la info de las vinculaciones tecnológicas de los proyectos
 * - viewer: Puede ver únicamente todas las áreas (menos la de usuarios) pero no puede crear ni modificar ningún tipo de dato
 */

export const PERMISSIONS_CONFIG = {
  // Módulo de Usuarios
  usuarios: {
    view: ['admin'],
    create: ['admin'],
    edit: ['admin'],
    delete: ['admin'],
  },

  // Módulo de Investigadores/Personas
  investigadores: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin', 'rrhh'],
    edit: ['admin', 'rrhh'],
    delete: ['admin', 'rrhh'],
  },

  // Módulo de Grupos de Investigación
  grupos: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin', 'rrhh'],
    edit: ['admin', 'rrhh'],
    delete: ['admin', 'rrhh'],
  },

  // Módulo de Proyectos
  proyectos: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin', 'pid'],
    edit: ['admin', 'pid'],
    delete: ['admin', 'pid'],
  },

  // Módulo de Vinculaciones Tecnológicas
  vinculaciones: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin', 'uvt'],
    edit: ['admin', 'uvt'],
    delete: ['admin', 'uvt'],
  },

  // Módulo de Desembolsos
  desembolsos: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin', 'uvt'],
    edit: ['admin', 'uvt'],
    delete: ['admin', 'uvt'],
  },

  // Módulo de Categorías
  categorias: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin', 'rrhh'],
    edit: ['admin', 'rrhh'],
    delete: ['admin', 'rrhh'],
  },

  // Módulo de Regionales
  regionales: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin', 'pid'],
    edit: ['admin', 'pid'],
    delete: ['admin', 'pid'],
  },

  // Módulo de Tipos de Proyecto
  tiposProyectos: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin'],
    edit: ['admin'],
    delete: ['admin'],
  },

  // Módulo de Convenios
  convenios: {
    view: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
    create: ['admin', 'uvt'],
    edit: ['admin', 'uvt'],
    delete: ['admin', 'uvt'],
  },
};

/**
 * Lista de roles disponibles en el sistema
 */
export const AVAILABLE_ROLES = ['admin', 'rrhh', 'pid', 'uvt', 'viewer'];

/**
 * Configuración de acceso a módulos
 * Define qué roles pueden acceder a cada módulo principal
 */
export const MODULE_ACCESS = {
  usuarios: ['admin'],
  investigadores: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
  grupos: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
  proyectos: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
  vinculaciones: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
  desembolsos: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],
};

/**
 * Configuración de permisos especiales
 */
// export const SPECIAL_PERMISSIONS = {
//   // Roles que pueden ver información sensible
//   canViewSensitiveInfo: ['admin'],

//   // Roles que pueden exportar datos
//   canExport: ['admin', 'rrhh', 'pid', 'uvt'],

//   // Roles que pueden imprimir reportes
//   canPrint: ['admin', 'rrhh', 'pid', 'uvt', 'viewer'],

//   // Roles que pueden ver estadísticas
//   canViewStats: ['admin', 'rrhh', 'pid', 'uvt'],
// };
