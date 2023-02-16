import express from 'express'
import checkAuth from '../middleware/authMiddleware.js'
import { subirArchivo, descargar, eliminarArchivo } from '../controllers/archivosController.js'

const router = express.Router()


router.post('/', checkAuth, subirArchivo)

router.get('/:archivo', descargar, eliminarArchivo)


export default router