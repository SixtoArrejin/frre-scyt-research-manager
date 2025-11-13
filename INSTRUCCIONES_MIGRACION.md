# Instrucciones para Aplicar las Migraciones de Propiedad Intelectual

## ⚠️ Importante
La base de datos de Render no respondió durante la implementación en CI/CD. Necesitas aplicar las migraciones manualmente desde tu máquina local.

## Pasos para Aplicar las Migraciones

### Opción 1: Usando Prisma (Recomendado)

1. **Asegúrate de tener el código actualizado:**
   ```bash
   git checkout copilot/add-propiedad-intelectual-management
   git pull origin copilot/add-propiedad-intelectual-management
   ```

2. **Navega al directorio de la API:**
   ```bash
   cd scyt-api
   ```

3. **Verifica que el archivo .env existe y tiene la URL correcta:**
   ```bash
   cat .env
   ```
   Debería mostrar:
   ```
   DATABASE_URL=postgresql://dbscyt_user:1TKfA6y51sJg5ouEHzHeKyNeRNxi1WEK@dpg-d3mhm0ruibrs73e04vi0-a.oregon-postgres.render.com/dbscyt
   PORT=8000
   ```

4. **Aplica el schema a la base de datos:**
   ```bash
   npx prisma db push
   ```
   
   Si ves el error de conexión, espera 30-60 segundos y vuelve a intentar (la DB de Render puede estar durmiendo).

5. **Regenera el cliente Prisma:**
   ```bash
   npx prisma generate
   ```

6. **Verifica que las tablas se crearon correctamente:**
   ```bash
   npx prisma studio
   ```
   Busca las tablas `propiedadintelectual` e `investigadorespi`

### Opción 2: Usando el Script Automatizado

Simplemente ejecuta:
```bash
./scripts/apply-pi-migrations.sh
```

Este script hace todo automáticamente y te muestra mensajes claros de éxito o error.

### Opción 3: Usando SQL Directo

Si Prisma no funciona, puedes aplicar el script SQL directamente:

```bash
psql postgresql://dbscyt_user:1TKfA6y51sJg5ouEHzHeKyNeRNxi1WEK@dpg-d3mhm0ruibrs73e04vi0-a.oregon-postgres.render.com/dbscyt < database/migration_add_propiedad_intelectual.sql
```

## Verificar la Instalación

### 1. Inicia el Backend
```bash
cd scyt-api
npm start
```

Deberías ver:
```
El servidor esta escuchando en el puerto 8000
🚀 Aplicación inicializada correctamente
```

### 2. Inicia el Frontend
```bash
cd scyt-web
npm run dev
```

### 3. Prueba la Funcionalidad

1. Abre el navegador en `http://localhost:5173`
2. Login con:
   - Usuario: `SCyT-Admin`
   - Contraseña: `scytadmin123`
3. Navega a un proyecto
4. Verás una nueva sección "Propiedad Intelectual" debajo de "Vinculaciones"
5. Haz clic en "Nueva PI" para crear una propiedad intelectual

## Solución de Problemas

### Error: "Can't reach database server"
**Causa:** La base de datos de Render está durmiendo.
**Solución:** 
1. Espera 30-60 segundos
2. Intenta conectarte de nuevo
3. Si persiste, ve al dashboard de Render y verifica el estado del servicio

### Error: "Table already exists"
**Causa:** Las tablas ya fueron creadas anteriormente.
**Solución:** No es un error real, puedes continuar. Si quieres recrearlas:
```bash
# CUIDADO: Esto borra las tablas existentes
DROP TABLE IF EXISTS investigadorespi CASCADE;
DROP TABLE IF EXISTS propiedadintelectual CASCADE;
# Luego ejecuta el script de migración
```

### Error: "Module not found"
**Causa:** Las dependencias no están instaladas.
**Solución:**
```bash
cd scyt-api
npm install
npx prisma generate

cd ../scyt-web
npm install
```

## Estructura de las Tablas Creadas

### Tabla: propiedadintelectual
- `idPI` (PRIMARY KEY, SERIAL)
- `tipoPI` (VARCHAR 100, NOT NULL)
- `numeroExpediente` (VARCHAR 256, NULLABLE)
- `fechaInicio` (DATE, NULLABLE)
- `fechaCierre` (DATE, NULLABLE)
- `descripcion` (VARCHAR 1000, NULLABLE)
- `idProyecto` (INTEGER, FOREIGN KEY → proyectos)

### Tabla: investigadorespi
- `idPI` (INTEGER, PRIMARY KEY compuesta)
- `idPersona` (INTEGER, PRIMARY KEY compuesta)
- `porcentajeParticipacion` (REAL/FLOAT, NULLABLE)
- FOREIGN KEY a `propiedadintelectual` (ON DELETE CASCADE)
- FOREIGN KEY a `personas`

## Recursos

- **Documentación completa:** `PROPIEDAD_INTELECTUAL_README.md`
- **Script SQL de migración:** `database/migration_add_propiedad_intelectual.sql`
- **Script bash automático:** `scripts/apply-pi-migrations.sh`

## Contacto para Soporte

Si tienes problemas aplicando las migraciones:
1. Verifica los logs de errores
2. Asegúrate de que puedes conectarte a la base de datos con otras herramientas (DBeaver, psql, etc.)
3. Revisa que la URL de conexión sea correcta
4. Verifica que tienes permisos en la base de datos
