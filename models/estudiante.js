const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const estudianteSchema = new Schema({  
    nombre : {
        type : String,
        require :true
    },
    dni : {
        type : String,
        require :true,
        trim :true
    }, 
    correo : {
        type : String,
        require :true,
        trim :true
    },
    telefono : {
        type : String,
        require :true,
        trim :true
    }  
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);

module.exports = Estudiante;