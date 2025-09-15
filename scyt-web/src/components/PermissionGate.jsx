import PropTypes from 'prop-types';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Componente wrapper que condicionalmente renderiza elementos basado en permisos
 * Permite mostrar u ocultar elementos de la UI según el rol del usuario
 */
const PermissionGate = ({
  children,
  module,
  action,
  fallback = null,
  allowedRoles = null,
  deniedRoles = null,
}) => {
  const { hasPermission, getCurrentRole } = usePermissions();

  let hasAccess = false;

  // Si se especificaron roles permitidos específicos
  if (allowedRoles) {
    const currentRole = getCurrentRole();
    hasAccess = allowedRoles.includes(currentRole);
  } else if (deniedRoles) {
    // Si se especificaron roles denegados específicos
    const currentRole = getCurrentRole();
    hasAccess = !deniedRoles.includes(currentRole);
  } else if (module && action) {
    // Usar el sistema de permisos estándar
    hasAccess = hasPermission(module, action);
  } else {
    // Si no se especifica nada, mostrar por defecto
    hasAccess = true;
  }

  return hasAccess ? children : fallback;
};

PermissionGate.propTypes = {
  children: PropTypes.node.isRequired,
  module: PropTypes.string,
  action: PropTypes.string,
  fallback: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  deniedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PermissionGate;
