const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');


const usuarioSchema = new Schema({  
    nombre : {
        type : String,
        require :true
    },
    usuario : {
        type : String,
        require :true
    },
    password : {
        type : String,
        require :true
    },        
    dni : {
        type : String,
        require :true,
        unique: true,
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
    },
    rol: {
        type: String,
        enum: { values: ['aspirante', 'coordinador'] }
    }  
});
usuarioSchema.plugin(uniqueValidator, { message: 'Error, el dni: {VALUE} ya fue registrado.' });
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;