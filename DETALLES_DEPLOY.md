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

El frontend **necesita conocer la URL base del backend al momento de compilar el build** (si TI recibe el build ya compilado, esta URL ya viene “embebida” en los archivos):

- `VITE_API_BASE_URL`

Ejemplos:

- Si frontend y backend están en el mismo dominio (por ejemplo, API publicada bajo `/api/`): `VITE_API_BASE_URL=https://DOMINIO`
- Si el backend está separado: `VITE_API_BASE_URL=https://api.DOMINIO` (o `http://HOST:PUERTO`)

## 6) Despliegue recomendado (modo “clásico”)

### 6.1 Frontend (Nginx o Apache)

En este proyecto, el entregable del frontend es el contenido de `scyt-web/build/` (HTML/CSS/JS). TI puede recibirlo como `.zip` y:

- Descomprimir/copiar el contenido del build al DocumentRoot del servidor web.

Ejemplos de destinos típicos:

- Nginx: `/usr/share/nginx/html` o `/var/www/scyt-web`
- Apache: `/var/www/html` o el DocumentRoot del VirtualHost

Configuración mínima de SPA fallback (ejemplo Nginx):

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Configuración mínima de SPA fallback (ejemplo Apache 2.4 con `mod_rewrite`):

```apache
<Directory "/var/www/html">
  AllowOverride None
  Require all granted
  RewriteEngine On

  # Si existe archivo/carpeta, servirlo
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Si parece un archivo (tiene extensión), no aplicar fallback (dejar 404 si no existe)
  RewriteCond %{REQUEST_URI} \.\w+$ [NC]
  RewriteRule ^ - [L]

  # Si no existe, mandar a index.html
  RewriteRule ^ /index.html [L]
</Directory>
```

Nota importante (SPA + assets):

- El “fallback” a `index.html` debe aplicarse **solo** cuando el recurso solicitado **no existe**.
- No debe reescribir pedidos a archivos estáticos (por ejemplo `/assets/*.js`, `/assets/*.css`, `/favicon.ico`).
  - Si un asset no existe, lo correcto es que sea **404**, no devolver `index.html` (eso rompe el navegador por MIME incorrecto).

### 6.2 Backend/API (Node.js como servicio)

TI puede recibir el backend como `.zip` con el contenido de `scyt-api/` y:

1. Copiar/descomprimir a una carpeta de aplicación en el servidor (por ejemplo `/opt/scyt-api`).
2. Definir variables de entorno del servicio:

- `DATABASE_URL`
- `PORT`
- `JWT_SECRET`

3. Instalar dependencias y generar Prisma Client:

```bash
cd /opt/scyt-api
npm ci --omit=dev
npx prisma generate
```

4. Ejecutar como servicio (recomendado systemd). Ejemplo de unidad:

```ini
# /etc/systemd/system/scyt-api.service
[Unit]
Description=SCyT API
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/scyt-api
Environment=PORT=8000
Environment=DATABASE_URL=postgresql://USUARIO:CLAVE@HOST:5432/NOMBRE_DB?schema=public
ExecStart=/usr/bin/node /opt/scyt-api/src/app.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Comandos:

```bash
sudo systemctl daemon-reload
sudo systemctl enable scyt-api
sudo systemctl start scyt-api
sudo systemctl status scyt-api
```
