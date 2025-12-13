# Deploy “a pedal” (facu) + prueba local

## 1) Prueba local (frontend en Nginx + API, ambos en contenedores)

Requisitos: Docker Desktop.

En la raíz del repo:

```powershell
cd "s:\Facu\3er año\Secretaría de Ciencia y Tecnología\Beca-Secretaria-CyT"
docker compose -f docker-compose.deploytest.yml up -d --build
docker compose -f docker-compose.deploytest.yml ps
```

- Front: `http://localhost:8080`
- API: `http://localhost:8001/api/...`
- La API usa la DB remota vía `DATABASE_URL` desde `scyt-api/.env`.

Para bajar:

```powershell
docker compose -f docker-compose.deploytest.yml down
```

Ver logs (sin tumbar nada):

```powershell
docker compose -f docker-compose.deploytest.yml logs -f --tail 200
```

## 2) Frontend en servidor Nginx (modo “a pedal”, pisando el build)

El build del front queda en `scyt-web/build` (Vite lo genera ahí).

### Build local

```powershell
cd "s:\Facu\3er año\Secretaría de Ciencia y Tecnología\Beca-Secretaria-CyT\scyt-web"
$env:VITE_API_BASE_URL="http://TU_HOST_BACK:8000"  # o la URL real que corresponda
npm ci
npm run build
```

### Copiar al servidor (pisar carpeta)

En el servidor Nginx, el DocumentRoot típico es alguno de estos:

- Debian/Ubuntu: `/var/www/html`
- Nginx oficial: `/usr/share/nginx/html`

Lo que te piden suele ser: **reemplazar el contenido** por el nuevo build.

Ejemplo (en el server Linux):

```bash
rm -rf /var/www/scyt-web/*
cp -R /ruta/al/build/* /var/www/scyt-web/
```

Asegurate de que el Nginx tenga fallback de SPA (React Router):

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 3) API (backend) en servidor (opciones)

### Opción A: con Docker (similar a la prueba local)

- Copiás el repo (o solo `scyt-api/`) al servidor.
- Mantenés un `scyt-api/.env` en el server con `DATABASE_URL` y `PORT`.
- Levantás el servicio (con compose o `docker run`).

### Opción B: sin Docker (Node directo)

En el server:

```bash
cd scyt-api
export DATABASE_URL='...'
export PORT=8000
npm ci
npm start
```

Y lo usual es correrlo con un service manager (systemd/pm2) para que quede “daemon”.
