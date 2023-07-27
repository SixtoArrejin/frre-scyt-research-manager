# Beca-Secretaria-CyT

Aplicación web para la Secretaria de Ciencia y Tecnología de la UTN Facultad Regional de Resistencia. Trabajo realizado como parte de la Beca Manuel Belgrano 2023.

## Levantar la app en entorno local

NOTA: Tener en cuenta que las variables de entorno que se muestran acá tienen valores placeholders o defaults.

1. Clonar el repositorio:

```
git clone https://github.com/SixtoArrejin/Beca-Secretaria-CyT
```

### Iniciar el back end

Requisitos: tener en local una base de datos MySQL. Conviene además tener una interfaz como Workbench o [DBeaver](https://dbeaver.io/download/).

2. Crear en la carpeta `backend/` un archivo `.env` con las siguientes variables de entorno:

```shell
DATABASE_URL="mysql://user:password@localhost:3306/database_name?schema=public"
```

3. Obtener las dependencias:

```
cd backend
npm install
npx prisma db pull
npx prisma generate
```

4. Levantar el servidor:

```
npm start
```

### Iniciar el front end

5. Obtener las dependencias:

```
cd frontend
npm install
```

6. Levantar el servidor:

```
npm start
```

## Links Relevantes

- DER y diseños de pantallas: https://app.diagrams.net/#G1GBpzemllR0f6B8dmBNpIyXd0STP2SUEG
