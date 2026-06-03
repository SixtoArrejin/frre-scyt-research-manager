# Guía de entregables

Este directorio contiene los entregables listos para el despliegue del sistema en los servidores.

## Estructura de Carpetas en este Directorio
*   `README.md`: Este archivo con las instrucciones.
*   `estructura_db.sql`: Script SQL nativo con la estructura de la base de datos vacía (PostgreSQL).
*   `frontend/`: Carpeta con los archivos estáticos de la web compilados con la ruta relativa `/api`.
*   `backend/`: Código fuente de la API Node.js/Express listo para producción (excluye dependencias locales).

---

## 1. Inicialización de la Base de Datos (PostgreSQL 17)

Hay dos opciones independientes para crear las tablas en la base de datos de producción:
- En cambos caso se requere que primeramente se cree la base de datos en el servidor de PostgreSQL.

### Opción A: Sincronización Automática con Prisma
Esta opción no requiere importar archivos SQL. Prisma crea la estructura leyendo el archivo `schema.prisma`.
1.  En la carpeta de la API (`backend/`), edita o crea el archivo `.env` configurando la variable de conexión `DATABASE_URL`.
2.  Ejecuta el siguiente comando para generar las tablas automáticamente:
    ```bash
    npx prisma db push
    ```
3.  Al iniciar la API por primera vez, el servidor sembrará de manera automática los roles, regionales, tipos de proyecto y el usuario administrador inicial.

### Opción B: Importación del Script SQL Nativo
1.  Importa el script `estructura_db.sql` provisto en esta carpeta:
    ```bash
    psql -U usuario -d nombre_db -f estructura_db.sql
    ```

---

## 2. Despliegue del Backend (API)

El backend es un servicio en Node.js.

1.  Copia el contenido de la carpeta `backend/` a la ruta del servidor (ejemplo: `/opt/scyt-api`).
2.  Crea un archivo `.env` en la raíz de esa carpeta basándote en el archivo de ejemplo `.env.example` incluido en la carpeta `backend/`:
    ```env
    PORT=8000
    DATABASE_URL=postgresql://usuario:contraseña@servidor_db:5432/nombre_db?schema=public
    JWT_SECRET=una_clave_secreta_segura_para_jwt
    ```
3.  Instala las dependencias de producción y genera el cliente local de Prisma:
    ```bash
    npm ci --omit=dev
    npx prisma generate
    ```
4.  Ejecuta el servicio en segundo plano (ejemplo con PM2):
    ```bash
    pm2 start src/app.js --name "scyt-api"
    ```

---

## 3. Despliegue del Frontend (Web)

El frontend se entrega pre-compilado en la carpeta `frontend/` y está configurado para realizar peticiones de forma relativa a la ruta `/api` de la web.

1.  Copia todo el contenido de la carpeta `frontend/` al directorio de archivos estáticos de tu servidor web.
2.  Configura el servidor web para realizar dos tareas fundamentales:
    *   **Proxy Inverso**: Redirigir todas las peticiones entrantes a `/api/` hacia la dirección interna del backend (ej. `http://localhost:8000/api/`).
    *   **Fallback SPA**: Redirigir cualquier otra ruta que no corresponda a un archivo físico hacia `index.html` para permitir el enrutamiento de React (React Router).

### Ejemplo de Configuración Nginx:
```nginx
server {
  listen 80;
  server_name tu-dominio-facultad.edu.ar;

  root /var/www/scyt-web;
  index index.html;

  # Proxy inverso para la API
  location /api/ {
    proxy_pass http://localhost:8000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  # SPA Fallback
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```
*(Nota: En la carpeta `scyt-web/` del código original del repositorio se puede encontrar plantillas completas de `nginx.conf` y `apache.conf` para referencia).*
