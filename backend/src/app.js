import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import Grupos from './routes/gruposRoutes.js'
import Personas from './routes/personasRoutes.js'

//importamos nuestro enrutador
const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use('/api/grupos', Grupos)
app.use('/api/personas', Personas)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>{
    console.log(`El servidor esta escuchando en el puerto ${PORT}`)
})