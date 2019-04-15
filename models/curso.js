const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const cursoSchema = new Schema({
    nombre: {
        type: String,
        require: true,
        trim: true
    },
    id: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        require: true
    },
    valor: {
        type: Number,
        require: true,
        trim: true
    },
    modalidad: {
        type: String,
        enum: { values: ['presencial', 'virtual', ''] }
    },
    estado: {
        type: String,
        default : 'disponible',
        enum: { values: ['cerrado', 'disponible']}, 
    },
    intensidad: {
        type: Number
    },
});

cursoSchema.plugin(uniqueValidator, { message: 'Error, el ID: {VALUE} ya fue registrado.' });
const Curso = mongoose.model('Curso', cursoSchema);

module.exports = Curso;