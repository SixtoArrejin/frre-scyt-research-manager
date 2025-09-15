import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { PERMISSIONS_CONFIG } from '../config/permissions';

/**
 * Hook personalizado para manejar permisos de usuario
 * Utiliza el contexto del usuario y la configuración de permisos
 * para determinar si un usuario puede realizar una acción específica
 */
export const usePermissions = () => {
  const { currentUser } = useContext(UserContext);

  /**
   * Verifica si el usuario tiene permisos para realizar una acción específica
   * @param {string} module - El módulo (ej: 'investigadores', 'proyectos', 'grupos', etc.)
   * @param {string} action - La acción (ej: 'create', 'edit', 'view', 'delete')
   * @returns {boolean} - true si el usuario tiene permisos, false si no
   */
  const hasPermission = (module, action) => {
    if (!currentUser || !currentUser.rol) {
      return false;
    }

    const userRole = currentUser.rol.toLowerCase();

    // Verificar si existe la configuración para el módulo
    if (!PERMISSIONS_CONFIG[module]) {
      // eslint-disable-next-line no-console
      console.warn(`Módulo '${module}' no encontrado en la configuración de permisos`);
      return false;
    }

    // Verificar si existe la configuración para la acción
    if (!PERMISSIONS_CONFIG[module][action]) {
      // eslint-disable-next-line no-console
      console.warn(`Acción '${action}' no encontrada para el módulo '${module}'`);
      return false;
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    return PERMISSIONS_CONFIG[module][action].includes(userRole);
  };

  /**
   * Verifica si el usuario puede crear recursos en un módulo específico
   * @param {string} module - El módulo
   * @returns {boolean}
   */
  const canCreate = (module) => hasPermission(module, 'create');

  /**
   * Verifica si el usuario puede editar recursos en un módulo específico
   * @param {string} module - El módulo
   * @returns {boolean}
   */
  const canEdit = (module) => hasPermission(module, 'edit');

  /**
   * Verifica si el usuario puede ver recursos en un módulo específico
   * @param {string} module - El módulo
   * @returns {boolean}
   */
  const canView = (module) => hasPermission(module, 'view');

  /**
   * Verifica si el usuario puede eliminar recursos en un módulo específico
   * @param {string} module - El módulo
   * @returns {boolean}
   */
  const canDelete = (module) => hasPermission(module, 'delete');

  /**
   * Verifica si el usuario es administrador
   * @returns {boolean}
   */
  const isAdmin = () => {
    return currentUser?.rol?.toLowerCase() === 'admin';
  };

  /**
   * Obtiene el rol actual del usuario
   * @returns {string|null}
   */
  const getCurrentRole = () => {
    return currentUser?.rol?.toLowerCase() || null;
  };

  return {
    hasPermission,
    canCreate,
    canEdit,
    canView,
    canDelete,
    isAdmin,
    getCurrentRole,
    userRole: getCurrentRole(),
  };
};
