import express from 'express'
import checkAuth from '../middleware/authMiddleware.js'
import { nuevoEnlace, obtenerEnlace, todosEnlaces, tienePassword, verificarPassword } from '../controllers/enlacesController.js'

const router = express.Router()

router.post('/', checkAuth, nuevoEnlace)

router.get('/', todosEnlaces)

router.get('/:url', checkAuth, tienePassword, obtenerEnlace)

router.post('/:url', verificarPassword, obtenerEnlace)


export default router
