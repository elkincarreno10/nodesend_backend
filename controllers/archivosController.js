import multer from "multer"
import shortid from "shortid"
import fs from 'fs'
import Enlace from "../models/Enlace.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname+'/../uploads')
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, `${shortid.generate()}${extension}` );
    }
})

export const subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits : { fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024},
        storage: fileStorage
    }
    
    const upload = multer(configuracionMulter).single('archivo')

    upload( req, res, async error => {

        if(!error) {
            res.json({archivo: req.file.filename})
        } else {
            console.log(error)
            return next()
        }
    })
}


export const eliminarArchivo = async (req, res) => {

    try {
        fs.unlinkSync(__dirname+`/../uploads/${req.archivo}`)
    } catch (error) {
        console.log(error)
    }
}

export const descargar = async (req, res, next) => {

    // Obtiene el enlace
    const enlace = await Enlace.findOne({url: req.params.archivo})

    const archivo = __dirname + '/../uploads/' + enlace.nombre
    res.download(archivo)

    // Eliminar el archivo y la entrada de la base de datos
    const { descargas, nombre } = enlace

    // Lógica de descargas
    if(descargas === 1) {
        // Eliminar el archivo
        req.archivo = nombre
        // Eliminar la entrada
        await Enlace.findOneAndRemove(enlace.id)

        next()
    } else {
        enlace.descargas--;
        await enlace.save()
    }
}