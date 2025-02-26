# Beca-Secretaria-CyT

Aplicación web para la Secretaria de Ciencia y Tecnología de la UTN Facultad Regional de Resistencia. Trabajo realizado como parte de la Beca Manuel Belgrano 2023.

## Levantar la app en entorno local

NOTA: Tener en cuenta que las variables de entorno que se muestran acá tienen valores placeholders o defaults.

1. Clonar el repositorio: 

```
git clone https://github.com/SixtoArrejin/Beca-Secretaria-CyT
```

### Crear la base de datos sql

La aplicación se debe conectar a una base de datos MySQL. Conviene además tener una interfaz como Workbench o [DBeaver](https://dbeaver.io/download/).

2. Acceder a la carpeta `database/`, en ella hay un archivo `secCyT.sql` con las definiciones para crear la base de datos requerida, en el caso de contar con una conviene eliminarla y volver a crearla por los cambios que podrían llegar a introducirse.

### Iniciar el back end

3. Crear en la carpeta `backend/` un archivo `.env` con las siguientes variables de entorno:

```shell
DATABASE_URL="mysql://user:password@localhost:3306/database_name?schema=public"
```

4. Obtener las dependencias:

```
cd backend
npm install
npx prisma generate
```

5. Levantar el servidor:

```
npm start
```

### Iniciar el front end

6. Obtener las dependencias:

```javascript
cd frontend
npm install
```

7. Levantar el servidor:

```
npm start
```

### Crear usuario

Para acceder al sistema es necesario que se cree un usuario y contraseña. No se puede cargar directo a la base de datos ya que las contraseñas son encriptadas para ser almacenadas. Para ello necesitamos una erramientra como Thunder Client (extensión de visual) o Postman para enviar peticiones al servidor.

8. Enviar una petición `POST` al backend (previamente debemos levantarlo). La petisión debe ser enviada a la siguiente ruta (puede variar el puerto, verificar en el back):

```
http://localhost:8000/api/usuarios
```

Y en el body se debe incluir el usuario y contraseña en este formato: 

```javascript
{
  "usuario": "Administrador",
  "contrasena": "administrador"
}
```

9. Si todo va bien, ya puede acceder al sistema desde el front con las credenciales creadas

## Links Relevantes

- DER y diseños de pantallas: https://app.diagrams.net/#G1GBpzemllR0f6B8dmBNpIyXd0STP2SUEG
