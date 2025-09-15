# Sistema de Permisos - Documentación

## Descripción General

Se ha implementado un sistema completo de permisos para el frontend que permite controlar qué usuarios pueden ver y realizar acciones específicas según su rol.

## Componentes del Sistema

### 1. Hook `usePermissions`

Ubicación: `src/hooks/usePermissions.js`

Proporciona métodos para verificar permisos:

- `hasPermission(module, action)` - Verifica si el usuario tiene permisos para una acción específica
- `canCreate(module)` - Verifica si puede crear recursos
- `canEdit(module)` - Verifica si puede editar recursos
- `canView(module)` - Verifica si puede ver recursos
- `canDelete(module)` - Verifica si puede eliminar recursos
- `isAdmin()` - Verifica si es administrador
- `getCurrentRole()` - Obtiene el rol actual del usuario

### 2. Configuración de Permisos

Ubicación: `src/config/permissions.js`

Define los permisos por módulo y acción. Los roles disponibles son:

- **admin**: Acceso completo a todos los recursos
- **rrhh**: Gestión de investigadores y grupos
- **pid**: Gestión de proyectos
- **uvt**: Gestión de vinculaciones tecnológicas
- **viewer**: Solo lectura (excepto usuarios)

### 3. Componente `PermissionGate`

Ubicación: `src/components/PermissionGate.jsx`

Componente wrapper que condiciona la renderización de elementos según permisos.

## Ejemplos de Uso

### Uso Básico con PermissionGate

```jsx
import PermissionGate from '../../components/PermissionGate';

// Mostrar botón solo si el usuario puede crear investigadores
<PermissionGate module='investigadores' action='create'>
  <Button>Crear Investigador</Button>
</PermissionGate>

// Mostrar elemento solo para administradores
<PermissionGate allowedRoles={['admin']}>
  <AdminPanel />
</PermissionGate>

// Ocultar elemento para viewers
<PermissionGate deniedRoles={['viewer']}>
  <EditButton />
</PermissionGate>
```

### Uso con Hook usePermissions

```jsx
import { usePermissions } from "../hooks/usePermissions";

function MyComponent() {
  const { canCreate, canEdit, isAdmin } = usePermissions();

  return (
    <div>
      {canCreate("proyectos") && <CreateProjectButton />}
      {canEdit("investigadores") && <EditButton />}
      {isAdmin() && <AdminSettings />}
    </div>
  );
}
```

## Configuración de Permisos por Módulo

### Investigadores

- **Vista**: admin, rrhh, pid, uvt, viewer
- **Crear/Editar**: admin, rrhh
- **Eliminar**: admin

### Proyectos

- **Vista**: admin, rrhh, pid, uvt, viewer
- **Crear/Editar**: admin, pid
- **Eliminar**: admin

### Grupos

- **Vista**: admin, rrhh, pid, uvt, viewer
- **Crear/Editar**: admin, rrhh
- **Eliminar**: admin

### Vinculaciones

- **Vista**: admin, rrhh, pid, uvt, viewer
- **Crear/Editar**: admin, uvt
- **Eliminar**: admin

### Usuarios

- **Vista/Crear/Editar/Eliminar**: admin únicamente

## Archivos Modificados

### Páginas Principales

- `src/pages/investigadores/ListaInvestigadores.jsx`
- `src/pages/investigadores/DetalleInvestigador.jsx`
- `src/pages/proyectos/Proyectos.jsx`
- `src/pages/grupos/ListaGrupos.jsx`
- `src/pages/usuarios/ListaUsuarios.jsx`

### Componentes y Hooks Creados

- `src/hooks/usePermissions.js`
- `src/components/PermissionGate.jsx`
- `src/config/permissions.js`

## Implementación en Páginas Existentes

### Botones de Creación

Todos los botones "+" para crear nuevos recursos están envueltos con `PermissionGate`:

```jsx
<PermissionGate module="investigadores" action="create">
  <Link to={"nuevo"}>
    <Button colorScheme="blue" variant="outline">
      Investigador +
    </Button>
  </Link>
</PermissionGate>
```

### Enlaces de Visualización

Los enlaces "Ver Más" en las tablas están protegidos:

```jsx
<PermissionGate key={item.id} module="investigadores" action="view">
  <Link to={`/investigadores/${item.id}`}>
    <PlusSquareIcon />
  </Link>
</PermissionGate>
```

### Botones de Edición y Eliminación

Los íconos de edición y eliminación están condicionados:

```jsx
<PermissionGate module='investigadores' action='edit'>
  <EditIcon onClick={handleEdit} />
</PermissionGate>

<PermissionGate module='investigadores' action='delete'>
  <DeleteIcon onClick={handleDelete} />
</PermissionGate>
```

## Beneficios del Sistema

1. **Centralizado**: Toda la lógica de permisos está en un lugar
2. **Reutilizable**: Se puede usar en cualquier componente
3. **Mantenible**: Fácil agregar nuevos roles o modificar permisos
4. **Flexible**: Soporta múltiples formas de verificación (módulo+acción, roles específicos)
5. **Consistente**: Misma API en toda la aplicación
6. **Profesional**: Sigue patrones estándar de la industria

## Próximos Pasos

Si necesitas:

1. Agregar nuevos módulos: Actualiza `src/config/permissions.js`
2. Crear nuevos roles: Añádelos a `AVAILABLE_ROLES` y configura permisos
3. Implementar en más páginas: Usa `PermissionGate` o `usePermissions`
4. Permisos más complejos: Extiende la lógica en `usePermissions.js`
