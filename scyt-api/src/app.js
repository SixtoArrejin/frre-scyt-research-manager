import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Grupos from './routes/gruposRoutes.js';
import Personas from './routes/personasRoutes.js';
import Usuarios from './routes/usuariosRoutes.js';
import Categorias from './routes/categoriasRouter.js';
import Proyectos from './routes/proyectosRouter.js';
import Regionales from './routes/regionalesRouter.js';
import TiposProyectos from './routes/tiposProyectosRouter.js';
import Vinculaciones from './routes/vinculacionesRouter.js';
import Convenios from './routes/conveniosRouter.js';
import { initDatabase } from './repository/initDB.js';
import { createDefaultUsers } from '../scripts/createDefaultUsers.js';

//importamos nuestro enrutador
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Función para inicializar la aplicación
async function initializeApp() {
  try {
    // Inicializar base de datos
    await initDatabase();

    // Crear usuarios por defecto automáticamente
    await createDefaultUsers(true); // true = modo silencioso

    console.log('🚀 Aplicación inicializada correctamente');
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
  }
}

// Ejecutar inicialización
initializeApp();

app.use('/api/usuarios', Usuarios);
app.use('/api/grupos', Grupos);
app.use('/api/personas', Personas);
app.use('/api/categorias', Categorias);
app.use('/api/proyectos', Proyectos);
app.use('/api/regionales', Regionales);
app.use('/api/tiposProyectos', TiposProyectos);
app.use('/api/vinculaciones', Vinculaciones);
app.use('/api/convenios', Convenios);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`El servidor esta escuchando en el puerto ${PORT}`);
});
