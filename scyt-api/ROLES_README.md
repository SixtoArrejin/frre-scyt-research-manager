# Sistema de Roles y Usuarios - SCYT API

## 📋 Descripción

Este sistema implementa un manejo completo de usuarios con diferentes roles y permisos granulares para el sistema de gestión de investigación de la Secretaría de Ciencia y Tecnología.

## 🔐 Roles Disponibles

### 1. **ADMIN** - Administrador

- **Descripción**: Acceso completo a todas las funcionalidades del sistema
- **Permisos**: Crear, leer, actualizar y eliminar en todos los recursos
- **Casos de uso**: Gestión general del sistema, administración de usuarios

### 2. **PID** - Proyectos de I+D

- **Descripción**: Especialista en gestión de proyectos de investigación y desarrollo
- **Permisos**:
  - ✅ PROYECTOS: Crear, leer, actualizar, eliminar
  - ✅ REGIONALES: Crear, leer, actualizar, eliminar
  - ✅ TIPOS_PROYECTOS: Crear, leer, actualizar, eliminar
  - 👁️ PERSONAS: Solo lectura
  - 👁️ VINCULACIONES: Solo lectura
  - 👁️ OTROS: Solo lectura

### 3. **RRHH** - Recursos Humanos

- **Descripción**: Especialista en gestión de personal investigador y becarios
- **Permisos**:
  - ✅ PERSONAS: Crear, leer, actualizar, eliminar
  - ✅ GRUPOS: Crear, leer, actualizar, eliminar
  - ✅ CATEGORIAS: Crear, leer, actualizar, eliminar
  - 👁️ PROYECTOS: Solo lectura
  - 👁️ VINCULACIONES: Solo lectura
  - 👁️ OTROS: Solo lectura

### 4. **UVT** - Unidad de Vinculación Tecnológica

- **Descripción**: Especialista en vinculación tecnológica y convenios
- **Permisos**:
  - ✅ VINCULACIONES: Crear, leer, actualizar, eliminar
  - ✅ CONVENIOS: Crear, leer, actualizar, eliminar
  - 👁️ PROYECTOS: Solo lectura
  - 👁️ PERSONAS: Solo lectura
  - 👁️ OTROS: Solo lectura

### 5. **VIEWER** - Visualizador

- **Descripción**: Usuario con permisos de solo lectura
- **Permisos**:
  - 👁️ Todos los recursos: Solo lectura
  - ❌ USUARIOS: Sin acceso

## 🚀 Inicialización Automática

El sistema crea automáticamente un usuario administrador al iniciar la aplicación:

```
Usuario: admin
Contraseña: admin123
Rol: admin
```

**⚠️ IMPORTANTE**: Cambiar la contraseña después del primer login en producción.

## 🛠️ Uso de la API

### Autenticación

#### Login

```http
POST /api/usuarios/login
Content-Type: application/json

{
  "usuario": "admin",
  "contrasena": "admin123"
}
```

**Respuesta:**

```json
{
  "message": "Inicio de sesión exitoso",
  "success": true,
  "usuario": "admin",
  "rol": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Uso del Token

Incluir en todas las peticiones autenticadas:

```http
Authorization: Bearer <token>
```

### Gestión de Usuarios

#### Obtener todos los usuarios

```http
GET /api/usuarios
Authorization: Bearer <admin_token>
```

#### Crear nuevo usuario

```http
POST /api/usuarios
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "usuario": "nuevo_usuario",
  "contrasena": "contraseña123",
  "rol": "pid"
}
```

#### Actualizar usuario

```http
PUT /api/usuarios/{usuario}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "rol": "rrhh",
  "activo": true
}
```

#### Obtener perfil propio

```http
GET /api/usuarios/profile/me
Authorization: Bearer <token>
```

#### Obtener roles disponibles

```http
GET /api/usuarios/roles
```

## 🔒 Middleware de Permisos

### Implementación en Rutas

```javascript
import {
  validateToken,
  requirePermission,
} from "../middleware/authMiddleware.js";
import { RESOURCES, ACTIONS } from "../config/roles.js";

// Ejemplo para proyectos
router.get(
  "/",
  validateToken,
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.READ),
  getProyectos
);

router.post(
  "/",
  validateToken,
  requirePermission(RESOURCES.PROYECTOS, ACTIONS.CREATE),
  createProyecto
);
```

### Middlewares Disponibles

- `validateToken`: Valida el JWT y autentica al usuario
- `requirePermission(resource, action)`: Verifica permisos específicos
- `requireReadPermission(resource)`: Atajo para permisos de lectura
- `requireWritePermission(resource)`: Atajo para permisos de escritura
- `requireUpdatePermission(resource)`: Atajo para permisos de actualización
- `requireDeletePermission(resource)`: Atajo para permisos de eliminación

## 🏗️ Arquitectura del Sistema

### Archivos Principales

```
src/
├── config/
│   └── roles.js              # Definición de roles y permisos
├── middleware/
│   └── authMiddleware.js     # Middlewares de autenticación y autorización
├── controllers/
│   └── usuariosController.js # Controladores de usuarios
├── services/
│   └── usuariosService.js    # Lógica de negocio de usuarios
├── repository/
│   └── usuariosRepository.js # Acceso a datos de usuarios
└── routes/
    └── usuariosRoutes.js     # Rutas de la API de usuarios

scripts/
├── createAdminUser.js        # Script para crear usuario admin
└── createExampleUsers.js     # Script para crear usuarios de ejemplo
```

### Base de Datos

```sql
-- Tabla usuarios actualizada
CREATE TABLE usuarios (
  usuario VARCHAR(20) PRIMARY KEY,
  contrasena VARCHAR(255),
  rol VARCHAR(20) DEFAULT 'viewer',
  activo BOOLEAN DEFAULT true,
  creadoEn TIMESTAMP DEFAULT NOW(),
  creadoPor VARCHAR(20)
);
```

## 🔧 Configuración y Personalización

### Modificar Permisos

Editar el archivo `src/config/roles.js`:

```javascript
export const PERMISSIONS = {
  [ROLES.CUSTOM_ROLE]: {
    [RESOURCES.PROYECTOS]: [ACTIONS.READ, ACTIONS.UPDATE],
    // ... más permisos
  },
};
```

### Agregar Nuevos Recursos

1. Añadir el recurso en `RESOURCES`:

```javascript
export const RESOURCES = {
  // ... recursos existentes
  NUEVO_RECURSO: "nuevoRecurso",
};
```

2. Actualizar `PERMISSIONS` para incluir el nuevo recurso

3. Aplicar middleware en las rutas:

```javascript
router.get(
  "/nuevo-recurso",
  validateToken,
  requirePermission(RESOURCES.NUEVO_RECURSO, ACTIONS.READ),
  controller
);
```

## 🧪 Scripts de Utilidad

### Crear Usuario Administrador

```bash
node scripts/createAdminUser.js
```

### Crear Usuarios de Ejemplo

```bash
node scripts/createExampleUsers.js
```

## 📝 Notas de Seguridad

1. **Contraseñas**: Se encriptan con bcrypt antes de almacenar
2. **JWT**: Tokens con expiración de 1 hora
3. **Secreto JWT**: Cambiar la clave "secreto" por una más segura en producción
4. **Variables de entorno**: Mover configuraciones sensibles a `.env`
5. **HTTPS**: Usar HTTPS en producción para proteger tokens

## 🔄 Próximas Mejoras

- [ ] Refresh tokens para sesiones más largas
- [ ] Historial de actividad de usuarios
- [ ] Permisos más granulares por registro específico
- [ ] Sistema de notificaciones por rol
- [ ] Integración con Active Directory/LDAP
- [ ] Auditoría de cambios con usuario responsable
