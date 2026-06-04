# Inicialización de Usuario Administrador (Bootstrap Admin)

## Descripción

El sistema implementa el patrón **Bootstrap Admin Only**. Al iniciar la aplicación, el servidor busca si existe algún usuario administrador inicial creado por el sistema. Si no existe ninguno, crea automáticamente una única cuenta administradora inicial utilizando variables de entorno para configurar sus credenciales.

Esto previene tener contraseñas por defecto harcodeadas en el código y mantiene la seguridad del despliegue en producción.

Una vez iniciada la sesión con este usuario administrador, este será responsable de crear manualmente los usuarios funcionales de la organización (con roles como PID, UVT, RRHH, Viewer) a través del panel de administración del sistema.

## Credenciales del Administrador Inicial

Las credenciales se obtienen de las siguientes variables de entorno en el archivo `.env`:

*   `INITIAL_ADMIN_USER`: Nombre de usuario del administrador inicial (Valor por defecto: `SCyT-Admin`).
*   `INITIAL_ADMIN_PASSWORD`: Contraseña del administrador inicial (Valor por defecto: `scytadmin123`).

> [!WARNING]
> En entornos de producción o desarrollo expuestos, es **mandatorio** sobrescribir estas variables en tu archivo `.env` local con valores seguros antes de levantar el servidor por primera vez.

## Roles del Sistema

Una vez que el administrador inicial accede, puede gestionar y crear usuarios con los siguientes roles provistos por la plataforma:

| Rol | Descripción |
| :--- | :--- |
| **Admin** | Acceso completo a todos los recursos, auditorías y gestión de usuarios. |
| **PID** | Gestión de proyectos de investigación y desarrollo (PID) (Crear, editar, ver). |
| **UVT** | Gestión de vinculaciones tecnológicas (UVT) y convenios (Crear, editar, ver). |
| **RRHH** | Gestión de investigadores, personas, categorías y grupos de investigación. |
| **Viewer** | Acceso de solo lectura en todos los recursos (sin permisos de edición/creación). |

## Ejecución del Script de Inicialización

### Automática

El usuario administrador inicial se inicializa automáticamente al iniciar la aplicación (`npm start` o `node src/app.js`), comprobando primero si ya existe algún administrador con el flag `creadoPor: 'system'`.

### Manual / Pruebas

Para forzar la comprobación o ejecutar la creación de manera independiente, puedes usar los scripts provistos:

```bash
# Ejecutar la inicialización mostrando los logs detallados
node scripts/createDefaultUsers.js

# Ejecutar el script de prueba
node scripts/testDefaultUsers.js
```

## Archivos Relacionados

*   [createDefaultUsers.js](file:///s:/Facu/3er%20a%C3%B1o/Secretar%C3%ADa%20de%20Ciencia%20y%20Tecnolog%C3%ADa/Beca-Secretaria-CyT/scyt-api/scripts/createDefaultUsers.js) - Script de comprobación y creación del administrador.
*   [testDefaultUsers.js](file:///s:/Facu/3er%20a%C3%B1o/Secretar%C3%ADa%20de%20Ciencia%20y%20Tecnolog%C3%ADa/Beca-Secretaria-CyT/scyt-api/scripts/testDefaultUsers.js) - Script de pruebas.
*   [app.js](file:///s:/Facu/3er%20a%C3%B1o/Secretar%C3%ADa%20de%20Ciencia%20y%20Tecnolog%C3%ADa/Beca-Secretaria-CyT/scyt-api/src/app.js) - Inicialización automática al arrancar.
*   [roles.js](file:///s:/Facu/3er%20a%C3%B1o/Secretar%C3%ADa%20de%20Ciencia%20y%20Tecnolog%C3%ADa/Beca-Secretaria-CyT/scyt-api/src/config/roles.js) - Definición de roles y permisos.

## ⚠️ Prácticas de Seguridad

1.  **Cambiar contraseña inicial**: Cambiar la contraseña del usuario `SCyT-Admin` inmediatamente después del primer login.
2.  **No compartir credenciales de sistema**: Evitar el uso compartido de la cuenta administrador del sistema; crear cuentas individuales para cada integrante de la secretaría con su rol respectivo.
3.  **Protección de Variables de Entorno**: Asegurar que los archivos `.env` o configuraciones del orquestador en producción no sean accesibles para usuarios externos o subidos a sistemas de control de versiones.
