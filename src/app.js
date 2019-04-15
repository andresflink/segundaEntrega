const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Modelos
const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');
const Matricula = require('../models/matricula');




app.set('view engine', 'hbs');
const directorioPublico = path.join(__dirname, '../public');
app.use(express.static(directorioPublico));

const directorioPartials = path.join(__dirname, '../partials');
hbs.registerPartials(directorioPartials);

app.use(bodyParser.urlencoded({ extended: true }));


const dirNode_modules = path.join(__dirname, '../node_modules')
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

//Helpers
require('./helpers/helperCursos');




app.listen(process.env.port, () => {
    console.log('Escuchando en el puerto 3000');
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (error, resultado) => {
    if (error) {
        return console.log(error);
    }
    console.log('Conectado a DB matriculas');

});


app.get('/', (req, res) => {
    res.render('home', {
        titulo: 'Bienvenido a la aplicacion'
    });
});


app.get('/listarCursos', (req, res) => {

    Curso.find({ estado: 'disponible' }).exec((err, respuesta) => {
        if (err) {
            return console.log(err)
        }
        res.render('listarCursos', {
            listado: respuesta,
            titulo: 'Listar Cursos'
        });

    });
});


app.get('/crearCurso', (req, res) => {
    res.render('crearCurso', {
        titulo: 'Vista de coordinador'
    });
});

app.post('/crearCurso', (req, res) => {
    let curso = new Curso({
        nombre: req.body.nombre,
        id: req.body.id,
        descripcion: req.body.descripcion,
        valor: req.body.valor,
        modalidad: req.body.modalidad,
        estado: req.body.estado,
        intensidad: req.body.intensidad
    });

    curso.save((err, resultado) => {
        console.log(err);
        console.log(resultado);

        if (err) {
            res.render('crearCurso', {
                titulo: 'Vista de coordinador',
                mensajeCrear: err
            });
        } else {
            res.render('crearCurso', {
                titulo: 'Vista de coordinador',
                mensajeCrear: 'Curso ' + resultado.nombre + ' creado correctamente'
            });
        }
    });

});

app.get('/inscribirCurso', (req, res) => {
    Curso.find({ estado: 'disponible' }).exec((err, cursosDisponibles) => {
        if (err) {
            return console.log(err)
        }
        res.render('inscribirCurso', {
            listado: cursosDisponibles,
            titulo: 'Vista de aspirante'
        });

    });

});


app.post('/inscribirCurso', (req, res) => {
    body = req.body;
    let estudiante = new Estudiante({
        dni: body.dni,
        nombre: body.nombre,
        correo: body.correo,
        telefono: body.telefono
    });

    let matricula = new Matricula(
        {
            "dniEstudiante": body.dni,
            "CursoID": body.idCurso
        }
    )

    var query = { 'dni': estudiante.dni },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    Estudiante.findOneAndUpdate(query, body, options, function (error, result) {
        if (error) return console.log(err);
    });

    Curso.find({ estado: 'disponible' }).exec((err, cursosDisponibles) => {
        if (err) {
            return console.log(err)
        }

        matricula.save((err, matricula) => {
            if (err) {
                res.render('inscribirCurso', {
                    titulo: 'Vista de aspirante',
                    mensajeMatricula: 'Error en matricula, El estudiante ya se encuentra inscrito en el curso',
                    listado: cursosDisponibles,

                });
            }
            else {
                res.render('inscribirCurso', {
                    listado: cursosDisponibles,
                    titulo: 'Vista de aspirante',
                    mensajeMatricula: 'Estudiante inscrito correctamente en el curso ' + matricula.CursoID
                });
            }
        });


    });

});

app.get('/listarMatriculas', (req, res) => {
    Curso.find({ estado: 'disponible' }).exec((err, cursosDisponibles) => {
        if (err) {
            return console.log(err)
        }
        Matricula.find({}).exec((err, matricu) => {
            if (err) {
                return console.log(err)
            }
            Estudiante.find({}).exec((err, estu) => {
                if (err) {
                    return console.log(err)
                }
                res.render('listarMatriculas', {
                    titulo: 'Lista De Matriculas',
                    cursos: cursosDisponibles,
                    matriculas: matricu,
                    estudiantes: estu
                });
            })


        })
    });
});





app.post('/cerrarCurso', (req, res) => {
    body = req.body;
    console.log(body.idEliminar);

    Matricula.find({}).exec((err, matricu) => {
        if (err) {
            return console.log(err)
        }
        Estudiante.find({}).exec((err, estu) => {
            if (err) {
                return console.log(err)
            }
            Curso.findOneAndUpdate({ id: body.idEliminar }, { 'estado': 'cerrado' }, (err, resultado) => {
                Curso.find({ estado: 'disponible' }).exec((err, cursosDisponibles) => {
                    if (err) {
                        return console.log(err)
                    }
                    res.render('listarMatriculas', {
                        titulo: 'Lista De Matriculas',
                        cursos: cursosDisponibles,
                        matriculas: matricu,
                        estudiantes: estu
                    });
                })
            })
        })
    });
});


app.get('/cerrarCurso', (req, res) => {
    Curso.find({ estado: 'disponible' }).exec((err, cursosDisponibles) => {
        if (err) {
            return console.log(err)
        }
        Matricula.find({}).exec((err, matricu) => {
            if (err) {
                return console.log(err)
            }
            Estudiante.find({}).exec((err, estu) => {
                if (err) {
                    return console.log(err)
                }
                res.render('listarMatriculas', {
                    titulo: 'Lista De Matriculas',
                    cursos: cursosDisponibles,
                    matriculas: matricu,
                    estudiantes: estu
                });
            })
        })
    });
});


app.post('/eliminarMatricula', (req, res) => {
    body = req.body;
    console.log(body.idEliminar);

    Curso.find({ estado: 'disponible' }).exec((err, cursosDisponibles) => {
        if (err) {
            return console.log(err)
        }
        Estudiante.find({}).exec((err, estu) => {
            if (err) {
                return console.log(err)
            }
            Matricula.findOneAndDelete({ dniEstudiante: body.dniEstudiante, CursoID: body.cursoID }, req.body, (err, resultado) => {
                Matricula.find({}).exec((err, matricu) => {
                    if (err) {
                        return console.log(err)
                    }
                    res.render('listarMatriculas', {
                        titulo: 'Lista De Matriculas',
                        cursos: cursosDisponibles,
                        matriculas: matricu,
                        estudiantes: estu
                    });
                })
            })
        })
    });
});


app.get('*', (req, res) => {
    res.render('error', {
        titulo: 'error'
    });
});