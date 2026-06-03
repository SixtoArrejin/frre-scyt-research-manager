# Info para deploy

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
- Se despliega copiando el contenido de `scyt-api/` al servidor y ejecutando instalación de dependencias (`npm ci --omit=dev`) + generación de Prisma (`npx prisma generate`).

### Base de datos

- PostgreSQL: **17.x**

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
  - `USUARIO`: usuario de la DB
  - `CLAVE`: contraseña
  - `HOST`: servidor o IP
  - `PUERTO`: normalmente `5432`
  - `NOMBRE_DB`: nombre de la base

## 4) Puertos y red

- Todos los puertos son **configurables** según sea necesario.

- Frontend (Nginx/Apache): típicamente HTTP 80 y/o HTTPS 443, pero puede publicarse en otro puerto si se desea.
- Backend/API (Node/Express): puerto configurable (por defecto **8000**).
- Base de datos: PostgreSQL TCP típicamente **5432** (o el que se configure).

## 5) Configuración (variables necesarias)

### 5.1 Backend/API

Variables esperadas por el backend:

- `PORT`: puerto HTTP del servicio (ejemplo: `8000`)
- `DATABASE_URL`: string de conexión PostgreSQL (formato Prisma)
- `JWT_SECRET`: secreto para firmar/verificar JWT (clave para encriptar las contraseñas)

Ejemplo:

- `DATABASE_URL=postgresql://USUARIO:CLAVE@HOST:5432/NOMBRE_DB?schema=public`

### 5.2 Frontend

El frontend es una aplicación de React compilada con Vite. En las SPA (Single Page Applications) clásicas, las variables de entorno se inyectan en los archivos estáticos **en tiempo de compilación (build-time)**. 

Para solucionar esto sin tener que reconstruir la web o saber la URL del backend de antemano, **la mejor práctica implementada es usar una URL relativa y un Proxy Inverso (Nginx o Apache)**.

1. **Compilar con URL relativa**:
   Se compila la aplicación estableciendo:
   - `VITE_API_BASE_URL=/api`
   Esto hace que el navegador intente llamar al backend usando el mismo host y puerto en el que está corriendo el frontend (ej. `http://DOMINIO_FACULTAD/api/...`).
   
2. **Proxy Inverso en el Servidor Web (Recomendado)**:
   El servidor web de la facultad (Nginx o Apache) se configura para que todas las peticiones que vayan a `/api/` sean redirigidas internamente al backend (Node.js) que corre en su respectivo puerto (ej. `http://localhost:8000/api/`).
   
*Nota: Si prefieres inyectar una URL absoluta en la compilación, deberás definir `VITE_API_BASE_URL=https://url-del-back.facultad.edu.ar` antes de ejecutar el comando `npm run build`.*

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
4. El comando generará una carpeta llamada `build/` (o `dist/` según la configuración de Vite, configurada en `build/` en este proyecto). El contenido de esta carpeta son los archivos HTML/CSS/JS listos para ser copiados al servidor web.

#### Destinos típicos en producción:
- Nginx: `/usr/share/nginx/html` o `/var/www/scyt-web`
- Apache: `/var/www/html` o el DocumentRoot del VirtualHost

#### Configuración mínima de SPA fallback y Proxy (Nginx):
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

*Nota: Contamos con los archivos completos `nginx.conf` y `apache.conf` de ejemplo en la raíz de `scyt-web/`.*

### 6.2 Backend/API (Node.js como servicio)

Se entrega el código del backend en una carpeta con el contenido de `scyt-api/`. 

#### Paso a paso para compilar y ejecutar:
1. Copiar los archivos a la carpeta de destino en el servidor (ej: `/opt/scyt-api`). No es necesario copiar `node_modules`.
2. Crear un archivo `.env` en la raíz de la carpeta en el servidor con las variables:
   ```env
   PORT=8000
   DATABASE_URL=postgresql://USUARIO:CLAVE@HOST:5432/NOMBRE_DB?schema=public
   JWT_SECRET=tu_clave_secreta_muy_segura
   ```
3. Instalar dependencias de producción y generar Prisma Client:
   ```bash
   cd /opt/scyt-api
   npm ci --omit=dev
   npx prisma generate
   ```
4. Ejecutar el servicio (se recomienda usar un administrador de procesos como `pm2` para producción):
   ```bash
   # Con Node directamente:
   npm start
   
   # O con PM2 (recomendado):
   pm2 start src/app.js --name "scyt-api"
   ```

### 6.3 Base de Datos (PostgreSQL 17)

Para inicializar la base de datos en el servidor de la facultad, tienes dos opciones principales:

#### Opción A: A través de Prisma (Recomendada y automatizada)
Dado que el proyecto utiliza Prisma ORM, no necesitas scripts SQL manuales para crear las tablas. Prisma puede sincronizar y estructurar la base de datos de producción leyendo la definición del modelo en `schema.prisma`.

1. Asegúrate de configurar correctamente la variable `DATABASE_URL` en el archivo `.env` del backend apuntando a la base de datos PostgreSQL de la facultad (esta base de datos debe existir previamente, aunque esté vacía).
2. Desde la carpeta del backend (`scyt-api/`), ejecuta el comando:
   ```bash
   npx prisma db push
   ```
   *Esto creará automáticamente todas las tablas, índices y relaciones en la base de datos PostgreSQL.*
3. Para insertar los datos iniciales obligatorios (roles, regiones, tipos de proyecto y usuario admin por defecto), inicia la aplicación API. El script interno `initializeApp()` en `src/app.js` se encargará de crearlos en el primer inicio de forma automática.

#### Opción B: Exportar script SQL desde tu base de datos local
Si el personal de TI de la facultad solicita obligatoriamente un script `.sql` para importarlo directamente en el motor de base de datos PostgreSQL, puedes exportarlo usando la herramienta nativa `pg_dump`:

1. **Exportar solo la estructura (tablas, claves, etc.) sin registros:**
   Abre una terminal en tu computadora (donde tienes corriendo la DB local) y ejecuta:
   ```bash
   pg_dump -U postgres -d dbscyt-dev -s -f database/estructura_db.sql
   ```
   *(Reemplaza `postgres` por tu usuario local y `dbscyt-dev` por el nombre de tu base de datos).*

2. **Exportar estructura Y datos (backup completo):**
   ```bash
   pg_dump -U postgres -d dbscyt-dev -f database/backup_completo.sql
   ```

3. **Importar el script SQL en el servidor de la facultad:**
   El personal de TI (o tú) puede ejecutar el script en el servidor de base de datos con:
   ```bash
   psql -U usuario_facultad -d nombre_db_facultad -f backup_completo.sql
   ```
