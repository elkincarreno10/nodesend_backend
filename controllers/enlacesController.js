import Enlace from "../models/Enlace.js"
import shortid from "shortid"

export const nuevoEnlace = async (req, res) => {
    
    // Crear un objeto
    const { nombre_original, nombre } = req.body

    const enlace = new Enlace()
    enlace.url = shortid.generate()
    enlace.nombre = nombre
    enlace.nombre_original = nombre_original

    // Si el usuario está autenticado
    if(req.usuario) {
        const { password, descargas } = req.body
        // Asignar a enlace un número de descragas
        if(descargas) {
            enlace.descargas = descargas
        } 
        if(password) {
            enlace.password = password
        }

        // Asignar el autor
        enlace.autor = req.usuario._id
    }

    // Almacenar en la BD
    try {
        await enlace.save()
        return res.json({msg: `${enlace.url}`})
    } catch (error) {
        console.log(error)
    }
}

// Obtener el enlace
export const obtenerEnlace = async (req, res, next) => {

    const { url } = req.params

    // Verificar si existe el enlace
    const enlace = await Enlace.findOne({ url })
    if(!enlace) {
        const error = new Error('El enlace no existe');
        return res.status(404).json({msg: error.message});
    }

    res.json({enlace: enlace.url, password: false})

    next()
}

// Obtiene un listado de todos los enlaces
export const todosEnlaces = async (req, res) => {
    try {
        const enlaces = await Enlace.find({}).select('url -_id')
        res.json({enlaces})
    } catch (error) {
        console.log(error)
    }
}

// retorna si un enlace tine password
export const tienePassword = async (req, res, next) => {
    const { url } = req.params

    // Verificar si existe el enlace
    const enlace = await Enlace.findOne({ url })
    if(!enlace) {
        const error = new Error('El enlace no existe');
        return res.status(404).json({msg: error.message});
    }

    if(enlace.password) {
        return res.json({password: true, enlace: enlace.url})
    }
    next()
}

// Verrifica si el password es correcto
export const verificarPassword = async (req, res, next) => {
    const { url } = req.params
    const { password } = req.body

    // Consultar por el enlace
    const enlace = await Enlace.findOne({ url })

    // Verificar password
    if(await enlace.comprobarPassword(password)) {
        // Permitir descar el archivo
        next()
    } else {
        return res.status(401).json({msg: 'Password Incorrecto'})
    }

}