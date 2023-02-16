import express from 'express'
import checkAuth from '../middleware/authMiddleware.js'
import { nuevoUsuario, autenticar, perfil } from '../controllers/usuarioController.js'


const router = express.Router()

router.post('/', nuevoUsuario)
router.post('/login', autenticar)


router.get('/perfil', checkAuth, perfil)

export default router