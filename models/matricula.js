const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const matriculaSchema = new Schema({
    dniEstudiante: {
        type: String,
        require: true,
        trim: true

    },
    CursoID: {
        type: String,
        require: true,
        trim: true
    },
    comprobante : {
        type : Buffer,
        require: true
    }
});

matriculaSchema.index({ dniEstudiante: 1, CursoID: 1 }, { unique: true })

const Matricula = mongoose.model('Matricula', matriculaSchema);

module.exports = Matricula;