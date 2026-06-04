# Especificación Técnica y Guía de Despliegue

Repositorio del proyecto:
- https://github.com/SixtoArrejin/frre-scyt-research-manager

## 1) Resumen

Este sistema está compuesto por:

- **Frontend**: aplicación web tipo SPA (React) compilada a archivos estáticos (HTML/CSS/JS) para servir con un servidor web (Nginx o Apache).
- **Backend/API**: servicio HTTP en Node.js (Express) que expone endpoints (`/api/...`).
- **Base de datos**: PostgreSQL 17.

La comunicación es:

- Navegador → Frontend (Nginx/Apache)
- Navegador → Backend/API (HTTP/HTTPS)
- Backend/API → PostgreSQL 17

---

## 2) Tecnologías y versiones

### Frontend (scyt-web)

- Herramientas utilizadas (para compilar el frontend):
  - Node.js: recomendado **Node.js 20 LTS**
  - Vite: **7.1.2**
  - React: **18.2.0**
  - React Router DOM: **6.14.1**
  - Chakra UI: **2.7.1**

Entregable (build) del frontend:

- Una web estática compilada (HTML/CSS/JS) lista para servir con un servidor web.
- Ubicación por defecto del build en el repo: `scyt-web/build/`

### Backend/API (scyt-api)

- Runtime / herramientas utilizadas:
  - Node.js (runtime): recomendado **Node.js 20 LTS**
  - Express: **4.18.2**
  - Prisma Client: **5.0.0**
  - Prisma CLI (operación): **5.0.0**
  - bcrypt: **5.1.0**
  - jsonwebtoken: **9.0.1**

Entregable del backend:

- Una aplicación Node.js (código JavaScript) que se ejecuta como servicio.
- Se despliega copiando el contenido de `scyt-api/` al servidor y ejecutando la instalación de dependencias (`npm ci --omit=dev`) + generación del cliente de Prisma (`npx prisma generate`) + sincronización de base de datos (`npx prisma db push`).

### Base de datos

- PostgreSQL: **17.x**

---

## 3) Requisitos de infraestructura

### 3.1 Servidor para el frontend (archivos estáticos)

Se puede usar cualquiera de estas opciones:

- **Nginx** (cualquier versión moderna) sirviendo una carpeta de archivos estáticos.
- **Apache HTTP Server** sirviendo una carpeta de archivos estáticos.

### 3.2 Servidor para el backend (servicio Node.js)

Requisitos:

- Linux (recomendado) o Windows Server.
- **Node.js 20 LTS** instalado.
- Acceso saliente a la base PostgreSQL.

Dependencias del sistema (Linux) importantes:

- **OpenSSL / libssl / certificados CA** (requerido por Prisma):
  - **Qué es**: Prisma usa un “engine” nativo que depende de librerías del sistema (OpenSSL). Si faltan, la API puede arrancar pero fallar al acceder a la base de datos (errores tipo `libssl.so... cannot open shared object file`).
  - **Paquetes típicos**:
    - `openssl`: utilidades y librerías de OpenSSL.
    - `libssl` (ej. `libssl1.1` o `libssl3` según el SO): librería requerida por el engine de Prisma.
    - `ca-certificates`: certificados raíz para conexiones TLS (recomendado, especialmente si la DB usa TLS).
  - **Instalación (ejemplos)**:
    - Debian 11 (bullseye): `sudo apt-get update; sudo apt-get install -y libssl1.1 openssl ca-certificates`
    - Ubuntu 20.04: `sudo apt-get update; sudo apt-get install -y libssl1.1 openssl ca-certificates`

### 3.3 Base de datos (PostgreSQL 17)

Requisitos:

- PostgreSQL 17 accesible desde el servidor del backend.
- Usuario con permisos de lectura/escritura sobre el esquema utilizado por la app.

Formato de URL de conexión (Prisma) usado por el backend:

- `DATABASE_URL=postgresql://USUARIO:CLAVE@HOST:PUERTO/NOMBRE_DB?schema=public`

---

## 4) Puertos y red

- Todos los puertos son **configurables** según sea necesario.
- Frontend (Nginx/Apache): HTTP 80 y/o HTTPS 443.
- Backend/API (Node/Express): puerto configurable (por defecto **8000**).
- Base de datos: PostgreSQL TCP típicamente **5432**.

---

## 5) Configuración (variables necesarias)

### 5.1 Backend/API

Variables esperadas por el backend en el archivo `.env`:

- `PORT`: puerto HTTP del servicio (ejemplo: `8000`).
- `DATABASE_URL`: string de conexión PostgreSQL (formato Prisma).
- `JWT_SECRET`: secreto para firmar/verificar JWT.
- `INITIAL_ADMIN_USER`: nombre de usuario para el administrador inicial ("Bootstrap Admin").
- `INITIAL_ADMIN_PASSWORD`: contraseña del administrador inicial.

### 5.2 Frontend

El frontend es una aplicación de React compilada con Vite. En las SPA (Single Page Applications) clásicas, las variables de entorno se inyectan en los archivos estáticos **en tiempo de compilación (build-time)**. 

Para solucionar esto sin tener que reconstruir la web o saber la URL del backend de antemano, **la mejor práctica implementada es usar una URL relativa y un Proxy Inverso (Nginx o Apache)**.

1. **Compilar con URL relativa**:
   Se compila la aplicación estableciendo:
   - `VITE_API_BASE_URL=/api`
   Esto hace que el navegador intente llamar al backend usando el mismo host y puerto en el que está corriendo el frontend (ej. `http://DOMINIO_FACULTAD/api/...`).
   
2. **Proxy Inverso en el Servidor Web (Recomendado)**:
   El servidor web de la facultad (Nginx o Apache) se configura para que todas las peticiones que vayan a `/api/` sean redirigidas internamente al backend (Node.js) que corre en su respectivo puerto (ej. `http://localhost:8000/api/`).

---

## 6) Despliegue

### 6.1 Frontend (Nginx o Apache)

#### Paso a paso para compilar:
1. Ir a la carpeta del frontend:
   ```bash
   cd scyt-web
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Generar la compilación estática (inyectando la ruta relativa `/api`):
   ```bash
   VITE_API_BASE_URL=/api npm run build
   ```
   *(En Windows PowerShell: `$env:VITE_API_BASE_URL="/api"; npm run build`)*
4. El comando generará una carpeta llamada `build/`. El contenido de esta carpeta son los archivos HTML/CSS/JS listos para ser copiados al servidor web.

#### Configuración de SPA fallback y Proxy (Nginx):
```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # Proxy de API para redirigir peticiones a la API de Node.js
  location /api/ {
    proxy_pass http://localhost:8000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  # SPA fallback para React Router
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### 6.2 Backend/API (Node.js como servicio)

#### Paso a paso para desplegar y ejecutar:
1. Copiar los archivos de `scyt-api/` (excepto `node_modules` y `.env` locales) a la carpeta de destino en el servidor (ej: `/opt/scyt-api`).
2. Crear un archivo `.env` en la raíz de la carpeta en el servidor con las variables descritas en la sección 5.1.
3. Instalar dependencias de producción, compilar Prisma Client y sincronizar la base de datos:
   ```bash
   cd /opt/scyt-api
   npm ci --omit=dev
   npx prisma generate
   npx prisma db push
   ```
4. Ejecutar el servicio en segundo plano (PM2 recomendado):
   ```bash
   pm2 start src/app.js --name "scyt-api"
   ```

### 6.3 Base de Datos (PostgreSQL 17)

#### Sincronización automática de tablas (Recomendada)
Dado que el proyecto utiliza Prisma ORM, la sincronización se realiza mediante `npx prisma db push`. Esto crea automáticamente todas las tablas, índices y relaciones en la base de datos PostgreSQL de manera idéntica al modelo de datos de la aplicación.

#### Datos semilla e inicialización del Administrador
Al arrancar el servidor backend por primera vez, el sistema realiza lo siguiente de forma automática:
1. Inserta los datos fijos iniciales (roles, regionales y tipos de proyecto).
2. Comprueba si existe algún usuario administrador en la base de datos. Si no existe, crea el administrador inicial ("Bootstrap Admin") utilizando las credenciales configuradas en las variables `INITIAL_ADMIN_USER` e `INITIAL_ADMIN_PASSWORD` en el archivo `.env`.

#### Backup manual mediante script SQL (Backup / Entornos restringidos)
Si se requiere de forma mandatoria un archivo `.sql` por parte de los administradores de sistemas de la facultad para crear la estructura de forma aislada, se puede utilizar el script `estructura_db.sql` disponible en la carpeta de entregables:
```bash
psql -U usuario_facultad -d nombre_db_facultad -f estructura_db.sql
```
