import express from 'express'
import cors from 'cors'
//importamos nuestro enrutador
const app = express()

app.use(cors())
app.use(express.json())

app.get('/api', (req, res) => {
    res.json("Hola mundo")
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>{
    console.log(`El servidor esta escuchando en el puerto ${PORT}`)
})