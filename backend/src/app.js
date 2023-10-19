import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import Grupos from './routes/gruposRoutes.js'
import Personas from './routes/personasRoutes.js'
import Usuarios from './routes/usuariosRoutes.js'
import Categorias from './routes/categoriasRouter.js'
import Proyectos from './routes/proyectosRouter.js'
import Regionales from './routes/regionalesRouter.js'
import TiposProyectos from './routes/tiposProyectosRouter.js'

//importamos nuestro enrutador
const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use('/api/usuarios', Usuarios)
app.use('/api/grupos', Grupos)
app.use('/api/personas', Personas)
app.use('/api/categorias', Categorias)
app.use('/api/proyectos', Proyectos)
app.use('/api/regionales', Regionales)
app.use('/api/tiposProyectos', TiposProyectos)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`El servidor esta escuchando en el puerto ${PORT}`)
})