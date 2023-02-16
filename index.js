import express from 'express'
import conectarDB from './config/db.js'
import dotenv from 'dotenv'
import usuariosRoutes from './routes/usuariosRoutes.js'
import enlacesRoutes from './routes/enlacesRoutes.js'
import archivosRoutes from './routes/archivosRoutes.js'
import cors from 'cors'

// Crear el servidor
const app = express()
app.use(express.json())

// Conectar a la base de datos
dotenv.config()
conectarDB()

// Habilitar CORS
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}
app.use( cors(opcionesCors) )

// Habilitar carpeta pública
app.use(express.static('uploads'))


// Rutas de la app
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/enlaces', enlacesRoutes)
app.use('/api/archivos', archivosRoutes)

// Puerto ed la app
const port = process.env.PORT || 4000

// Arrancar la appp
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está arrancando en el puerto ${port}`)
})