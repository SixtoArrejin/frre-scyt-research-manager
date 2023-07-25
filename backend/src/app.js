import express from 'express'
import cors from 'cors'
import Grupos from './routes/gruposRoutes.js'
//importamos nuestro enrutador
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/grupos', Grupos)

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>{
    console.log(`El servidor esta escuchando en el puerto ${PORT}`)
})