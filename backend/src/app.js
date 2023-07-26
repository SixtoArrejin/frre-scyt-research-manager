import express from 'express'
import cors from 'cors'
import Grupos from './routes/gruposRoutes.js'
import morgan from 'morgan'
//importamos nuestro enrutador
const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use('/api/grupos', Grupos)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>{
    console.log(`El servidor esta escuchando en el puerto ${PORT}`)
})