# Usuarios por Defecto del Sistema

## Descripción

El sistema crea automáticamente 5 usuarios por defecto al iniciar la aplicación. Estos usuarios solo se crean si no existen previamente en la base de datos.

## Usuarios Creados

| Usuario       | Contraseña      | Rol    | Descripción                                        |
| ------------- | --------------- | ------ | -------------------------------------------------- |
| `SCyT-Admin`  | `scytadmin123`  | admin  | Usuario administrador del sistema                  |
| `SCyT-PID`    | `scytpid123`    | pid    | Usuario para gestión de proyectos PID              |
| `SCyT-UVT`    | `scytuvt123`    | uvt    | Usuario para gestión de vinculaciones tecnológicas |
| `SCyT-RRHH`   | `scytrrhh123`   | rrhh   | Usuario para gestión de recursos humanos           |
| `SCyT-VIEWER` | `scytviewer123` | viewer | Usuario con permisos de solo lectura               |

## Permisos por Rol

### Admin

- Acceso completo a todos los recursos
- Gestión de usuarios
- Todas las operaciones CRUD

### PID

- Gestión de proyectos
- Crear, editar y ver proyectos
- Ver otros recursos (solo lectura)

### UVT (Unidad de Vinculación Tecnológica)

- Gestión de vinculaciones tecnológicas
- Crear, editar y ver vinculaciones
- Ver otros recursos (solo lectura)

### RRHH (Recursos Humanos)

- Gestión de investigadores/personas
- Gestión de grupos de investigación
- Gestión de categorías
- Ver otros recursos (solo lectura)

### Viewer

- Solo lectura en todos los recursos
- No puede acceder a la gestión de usuarios
- No puede crear, editar o eliminar contenido

## Implementación

### Automática

Los usuarios se crean automáticamente cuando se inicia la aplicación (`npm start` o `node src/app.js`).

### Manual

Para ejecutar solo la creación de usuarios:

```bash
# Ejecutar script completo (con detalles)
node scripts/createDefaultUsers.js

# Ejecutar script de prueba
node scripts/testDefaultUsers.js
```

### Programática

```javascript
import { createDefaultUsers } from "./scripts/createDefaultUsers.js";

// Modo silencioso (para inicialización automática)
await createDefaultUsers(true);

// Modo detallado (muestra toda la información)
await createDefaultUsers(false);
```

## Archivos Relacionados

- `scripts/createDefaultUsers.js` - Script principal de creación
- `scripts/testDefaultUsers.js` - Script de prueba
- `src/app.js` - Inicialización automática
- `src/config/roles.js` - Definición de roles y permisos

## ⚠️ Importante

1. **Cambiar contraseñas**: Es fundamental cambiar las contraseñas después del primer login
2. **Producción**: En ambiente de producción, considerar usar contraseñas más seguras
3. **Seguridad**: Estos usuarios son para facilitar el setup inicial del sistema
4. **Base de datos**: Los usuarios solo se crean si no existen previamente

## Próximos Pasos

- [ ] Implementar forzado de cambio de contraseña en primer login
- [ ] Implementar política de contraseñas más estricta
- [ ] Considerar usar variables de entorno para contraseñas por defecto
- [ ] Implementar auditoría de accesos por usuario
