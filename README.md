# FRRe SCyT Research Manager

Sistema de gestión de investigadores y proyectos para la Secretaría de Ciencia y Tecnología (SCyT) de la UTN Facultad Regional de Resistencia. Desarrollado como parte de la Beca Manuel Belgrano 2023.

## Estructura del proyecto

```
📁 frre-scyt-research-manager/
├── 📁 scyt-api/           # Backend (Node.js + Express + Prisma)
├── 📁 scyt-web/           # Frontend (React + Vite)
├── 📁 database/           # Scripts SQL y migraciones de base de datos
├── 📁 deploy/             # Entregables listos para el despliegue en producción
└── 📄 ESPECIFICACION_TECNICA.md # Detalles de infraestructura y despliegue
```

---

## Levantar la app en entorno local

### 1. Clonar el repositorio

```bash
git clone https://github.com/SixtoArrejin/frre-scyt-research-manager
cd frre-scyt-research-manager
```

### 2. Configurar la Base de Datos (PostgreSQL)

El sistema utiliza **PostgreSQL** (versión 17 recomendada).

1.  Asegúrate de tener instalado PostgreSQL localmente y haber creado una base de datos vacía (ej. `dbscyt_dev`).
2.  Para interactuar con la base de datos visualmente, se recomienda utilizar un cliente como [DBeaver](https://dbeaver.io/download/).

### 3. Iniciar el Backend (scyt-api)

1.  Accede a la carpeta del backend:
    ```bash
    cd scyt-api
    ```
2.  Crea un archivo `.env` en la raíz de esta carpeta basándote en el archivo de ejemplo [scyt-api/.env.example](file:///s:/Facu/3er%20a%C3%B1o/Secretar%C3%ADa%20de%20Ciencia%20y%20Tecnolog%C3%ADa/Beca-Secretaria-CyT/scyt-api/.env.example):
    ```env
    PORT=8000
    DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/dbscyt_dev?schema=public"
    JWT_SECRET="secreto_local_para_desarrollo"
    
    # Credenciales del Administrador Inicial (Opcional - Defaults si se omiten)
    INITIAL_ADMIN_USER=SCyT-Admin
    INITIAL_ADMIN_PASSWORD=scytadmin123
    ```
3.  Instala las dependencias y genera el cliente local de Prisma:
    ```bash
    npm install
    npx prisma generate
    ```
4.  Crea y sincroniza la estructura de tablas automáticamente en tu base de datos PostgreSQL:
    ```bash
    npx prisma db push
    ```
5.  Inicia el servidor en modo desarrollo:
    ```bash
    npm start
    ```
    *(Al arrancar por primera vez, el sistema creará automáticamente el usuario administrador inicial y cargará los catálogos fijos en la base de datos).*

### 4. Iniciar el Frontend (scyt-web)

1.  Abre otra terminal en la raíz del proyecto y accede a la carpeta del frontend:
    ```bash
    cd scyt-web
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo local de Vite:
    ```bash
    npm run dev
    ```
    *(Por defecto se levantará en `http://localhost:3000/`)*

---

## Acceso Inicial al Sistema

No es necesario realizar llamadas HTTP externas para crear tu primer usuario. Al levantar el servidor backend por primera vez, se inicializa de forma automática una cuenta administradora única con las credenciales que especificaste en tu archivo `.env` (o sus valores por defecto si no las definiste):

*   **Usuario**: `SCyT-Admin` (o el valor de `INITIAL_ADMIN_USER`)
*   **Contraseña**: `scytadmin123` (o el valor de `INITIAL_ADMIN_PASSWORD`)

Una vez dentro, podrás crear otros usuarios con diferentes roles (PID, UVT, RRHH, Viewer) mediante la interfaz web de gestión de usuarios.

---

## Documentación Relacionada

*   **Especificaciones Técnicas**: Consulta [ESPECIFICACION_TECNICA.md](file:///s:/Facu/3er%20a%C3%B1o/Secretar%C3%ADa%20de%20Ciencia%20y%20Tecnolog%C3%ADa/Beca-Secretaria-CyT/ESPECIFICACION_TECNICA.md) para más detalles sobre dependencias de sistema (OpenSSL), proxy inverso (Nginx/Apache) y puertos.
*   **Guía de Entregables**: Consulta [deploy/README.md](file:///s:/Facu/3er%20a%C3%B1o/Secretar%C3%ADa%20de%20Ciencia%20y%20Tecnolog%C3%ADa/Beca-Secretaria-CyT/deploy/README.md) para instrucciones sobre cómo compilar y empaquetar para producción.
*   **Diseño DER y Pantallas**: [Enlace a diagrams.net](https://app.diagrams.net/#G1GBpzemllR0f6B8dmBNpIyXd0STP2SUEG).
