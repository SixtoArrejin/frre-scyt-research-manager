# Propiedad Intelectual (PI) - Documentación de Implementación

## Descripción General

Se ha implementado un sistema completo de gestión de Propiedad Intelectual (PI) para proyectos de investigación, similar al sistema de Vinculaciones existente. Esta funcionalidad permite registrar y gestionar diferentes tipos de propiedad intelectual asociados a proyectos, así como los investigadores involucrados con sus porcentajes de participación.

## Tipos de Propiedad Intelectual

El sistema soporta los siguientes tipos de PI:
- **Derecho de Autor**
- **Modelo de Utilidad**
- **Modelo Industrial**
- **Patente**
- **Otros**

## Características Principales

### 1. Gestión de PI
- Crear nueva propiedad intelectual asociada a un proyecto
- Ver lista de todas las propiedades intelectuales
- Ver detalles de una PI específica
- Modificar datos de una PI existente
- Eliminar una PI

### 2. Datos de PI
Cada propiedad intelectual registra:
- **Tipo de PI**: Selección de los tipos predefinidos
- **Número de Expediente**: Campo opcional para el número de expediente
- **Fecha de Inicio**: Fecha opcional de inicio
- **Fecha de Cierre**: Fecha opcional de cierre
- **Descripción**: Campo de texto para describir la PI
- **Proyecto**: Relación con el proyecto de investigación

### 3. Investigadores Involucrados
- Permite agregar investigadores que participan en la PI
- Los investigadores NO necesitan pertenecer al proyecto original
- Cada investigador tiene un **porcentaje de participación**
- Se puede agregar, modificar o eliminar investigadores de la PI

### 4. Integración con Proyectos
- En la vista de detalle de un proyecto se muestra una sección de PI
- Similar a la sección de Vinculaciones
- Incluye tabla con lista de PIs del proyecto
- Botón para crear nueva PI desde el proyecto

## Estructura de Base de Datos

### Tabla: `propiedadintelectual`
```sql
CREATE TABLE propiedadintelectual (
    idPI SERIAL PRIMARY KEY,
    tipoPI VARCHAR(100) NOT NULL,
    numeroExpediente VARCHAR(256),
    fechaInicio DATE,
    fechaCierre DATE,
    descripcion VARCHAR(1000),
    idProyecto INTEGER,
    FOREIGN KEY (idProyecto) REFERENCES proyectos(idProyecto)
);
```

### Tabla: `investigadorespi`
```sql
CREATE TABLE investigadorespi (
    idPI INTEGER NOT NULL,
    idPersona INTEGER NOT NULL,
    porcentajeParticipacion REAL,
    PRIMARY KEY (idPI, idPersona),
    FOREIGN KEY (idPI) REFERENCES propiedadintelectual(idPI) ON DELETE CASCADE,
    FOREIGN KEY (idPersona) REFERENCES personas(idPersona)
);
```

## Backend (API)

### Endpoints

#### GET `/api/propiedadIntelectual`
Obtiene todas las propiedades intelectuales.

**Permisos**: Todos los roles autenticados pueden leer

**Respuesta**:
```json
{
  "success": true,
  "message": "Propiedad intelectual encontrada",
  "propiedadIntelectual": [...]
}
```

#### GET `/api/propiedadIntelectual/:idPI`
Obtiene una PI específica por ID.

#### GET `/api/propiedadIntelectual/proyecto/:idProyecto`
Obtiene todas las PIs de un proyecto específico.

#### POST `/api/propiedadIntelectual`
Crea una nueva propiedad intelectual.

**Permisos**: Solo ADMIN y UVT

**Body**:
```json
{
  "tipoPI": "Patente",
  "numeroExpediente": "EXP-2024-001",
  "fechaInicio": "2024-01-01",
  "fechaCierre": "2025-01-01",
  "descripcion": "Descripción de la patente",
  "idProyecto": 1,
  "investigadores": [
    {
      "idPersona": 5,
      "porcentajeParticipacion": 50.0
    },
    {
      "idPersona": 10,
      "porcentajeParticipacion": 50.0
    }
  ]
}
```

#### PUT `/api/propiedadIntelectual/:idPI`
Actualiza una PI existente.

**Permisos**: Solo ADMIN y UVT

#### DELETE `/api/propiedadIntelectual/:idPI`
Elimina una PI.

**Permisos**: Solo ADMIN y UVT

### Estructura de Archivos Backend

```
scyt-api/src/
├── controllers/
│   └── propiedadIntelectualController.js
├── services/
│   └── propiedadIntelectualService.js
├── repository/
│   └── propiedadIntelectualRepository.js
├── routes/
│   └── propiedadIntelectualRouter.js
└── config/
    └── roles.js (actualizado con permisos PI)
```

## Frontend

### Páginas

#### 1. Lista de PI (`/propiedadIntelectual`)
- Tabla con todas las propiedades intelectuales
- Filtros por número de expediente y tipo de PI
- Botón para crear nueva PI

#### 2. Nueva PI (`/propiedadIntelectual/nueva`)
- Formulario para crear nueva PI
- Selector de proyecto (si no se viene desde un proyecto)
- Formulario de datos de PI
- Sección para agregar investigadores con tabla
- Validación de datos

#### 3. Detalle PI (`/propiedadIntelectual/:idPI`)
- Vista de todos los datos de la PI
- Tabla de investigadores involucrados con porcentajes
- Botón para modificar (con permisos)

#### 4. Modificar PI (`/propiedadIntelectual/:idPI/modificar`)
- Formulario pre-cargado con datos actuales
- Permite modificar todos los campos
- Gestión de investigadores (agregar/eliminar)

### Rutas desde Proyectos

- `/proyectos/:idPid/nueva-propiedad-intelectual` - Crear PI desde proyecto
- `/proyectos/:idPid/propiedad-intelectual/:idPI` - Ver PI desde proyecto
- `/proyectos/:idPid/propiedad-intelectual/:idPI/modificar` - Modificar PI desde proyecto

### Estructura de Archivos Frontend

```
scyt-web/src/
├── pages/
│   └── propiedadIntelectual/
│       ├── Nueva.jsx
│       ├── DetallePropiedadIntelectual.jsx
│       ├── ListaPropiedadIntelectual.jsx
│       └── ModificarPropiedadIntelectual.jsx
├── hooks/
│   └── forms/
│       ├── useNuevaPIForm.js
│       └── useModificarPIForm.js
├── utils/
│   └── api/
│       └── propiedadIntelectualApi.js
└── config/
    └── permissions.js (actualizado)
```

## Permisos y Roles

### Roles con Acceso

| Rol | Ver | Crear | Editar | Eliminar |
|-----|-----|-------|--------|----------|
| admin | ✅ | ✅ | ✅ | ✅ |
| uvt | ✅ | ✅ | ✅ | ✅ |
| pid | ✅ | ❌ | ❌ | ❌ |
| rrhh | ✅ | ❌ | ❌ | ❌ |
| viewer | ✅ | ❌ | ❌ | ❌ |

**Nota**: Los roles ADMIN y UVT tienen permisos completos ya que UVT es el rol especializado en vinculación tecnológica y propiedad intelectual.

## Instalación y Configuración

### 1. Aplicar Migración de Base de Datos

Ejecutar el script SQL proporcionado:
```bash
psql -U usuario -d database < database/migration_add_propiedad_intelectual.sql
```

O usando Prisma:
```bash
cd scyt-api
npx prisma db push
```

### 2. Regenerar Cliente Prisma

```bash
cd scyt-api
npx prisma generate
```

### 3. Instalar Dependencias (si es necesario)

Backend:
```bash
cd scyt-api
npm install
```

Frontend:
```bash
cd scyt-web
npm install
```

### 4. Iniciar Servidores

Backend:
```bash
cd scyt-api
npm start
```

Frontend:
```bash
cd scyt-web
npm run dev
```

## Uso del Sistema

### Crear una Nueva PI

1. Navegar a la sección de Propiedad Intelectual o desde un proyecto específico
2. Clic en "Nueva PI" o "Nueva Propiedad Intelectual"
3. Si no viene desde un proyecto, seleccionar el proyecto de la tabla
4. Completar el formulario:
   - Seleccionar tipo de PI
   - Ingresar número de expediente (opcional)
   - Seleccionar fechas (opcional)
   - Agregar descripción (opcional)
5. Agregar investigadores involucrados:
   - Seleccionar investigador de la lista
   - Ingresar porcentaje de participación (0-100)
   - Clic en "Agregar"
   - Repetir para cada investigador
6. Clic en "Crear Propiedad Intelectual"

### Ver y Modificar PI

1. Desde la lista de PI o desde un proyecto, clic en el ícono de ver más
2. Se muestra el detalle con todos los datos
3. Para modificar, clic en "Modificar" (requiere permisos)
4. Editar los campos necesarios
5. Modificar lista de investigadores si es necesario
6. Clic en "Guardar Cambios"

## Validaciones

- El tipo de PI es requerido
- Los porcentajes de participación deben estar entre 0 y 100
- No se pueden agregar investigadores duplicados
- Las fechas deben estar en formato válido

## Consideraciones Técnicas

1. **Cascada de Eliminación**: Al eliminar una PI, se eliminan automáticamente todas las relaciones con investigadores
2. **Independencia de Proyectos**: Los investigadores de una PI no necesitan estar en el proyecto
3. **Permisos Granulares**: Los permisos se controlan tanto en backend como en frontend
4. **Validación de Datos**: Se valida en cliente y servidor
5. **Diseño Consistente**: La UI sigue el mismo patrón que Vinculaciones

## Testing

Para probar la funcionalidad:

1. Login con usuario admin o UVT:
   - Usuario: `SCyT-Admin`
   - Contraseña: `scytadmin123`

2. Navegar a un proyecto y crear una PI
3. Agregar investigadores con diferentes porcentajes
4. Verificar que se guarda correctamente
5. Modificar la PI
6. Verificar los filtros en la lista de PIs

## Solución de Problemas

### Error: "No se puede conectar a la base de datos"
- Verificar que PostgreSQL esté corriendo
- Verificar la URL de conexión en `.env`
- Si usa Render, esperar a que el servicio despierte

### Error: "Tabla no existe"
- Ejecutar las migraciones: `npx prisma db push`
- Verificar que el script SQL se ejecutó correctamente

### Error de permisos
- Verificar que el usuario tenga rol `admin` o `uvt`
- Revisar la configuración en `src/config/roles.js` (backend) y `src/config/permissions.js` (frontend)

## Recursos Adicionales

- [Prisma Documentation](https://www.prisma.io/docs/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Chakra UI Documentation](https://chakra-ui.com/docs)
