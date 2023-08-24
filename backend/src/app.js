import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import Grupos from './routes/gruposRoutes.js'
import Personas from './routes/personasRoutes.js'
import Usuarios from './routes/usuariosRoutes.js'
import Categorias from './routes/categoriasRouter.js'
import Proyectos from './routes/proyectosRouter.js'

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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`El servidor esta escuchando en el puerto ${PORT}`)
})