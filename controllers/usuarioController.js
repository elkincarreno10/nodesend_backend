import Usuario from "../models/Usuario.js"
import generarJWT from "../helpers/generarJWT.js"

export const nuevoUsuario = async (req, res) => {

    // Verificar si el usuario ya estuvo registrado
    const { email } = req.body

    const existeUsuario = await Usuario.findOne({email})
    if(existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    const usuario = new Usuario(req.body)

    try {
        await usuario.save()
        res.json({msg: 'Usuario Creado Correctamente'})
    } catch (error) {
        console.log(error)
    }
}

export const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({email});
    if(!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({msg: error.message});
    }

    // Revisar el password
    if(await usuario.comprobarPassword(password)) {
        // Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });
    } else {
        const error = new Error('El Password es Incorrecto');
        return res.status(403).json({msg: error.message});
    }
}

export const perfil = async (req, res) => {
    const { usuario } = req;

    res.json(usuario);
}