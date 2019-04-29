const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session')
const sgMail = require('@sendgrid/mail');
var multer = require('multer')



//Modelos
const Estudiante = require('../models/estudiante');
const Curso = require('../models/curso');
const Matricula = require('../models/matricula');
const Usuario = require('../models/usuario');


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



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.listen(3000, (error, resultado) => {
    if (error) {
        return console.log('Error al conectarse a el servidor ' + error);
    }
    console.log('Escuchando en el puerto 3000');
});

mongoose.connect('mongodb://localhost:27017/asignaturas', { useNewUrlParser: true }, (error, resultado) => {
    if (error) {
        return console.log('Error al conectarse al la BD ' + error);
    }
    console.log('Conectado a DB Asignaturas');

});

app.use(session({
    cookie: { maxAge: 86400000 },
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))


app.use((req, res, next) => {
    if (req.session.usuario) {
        res.locals.sesion = true
        res.locals.nombre = req.session.nombre
        res.locals.rol = req.session.rol
        res.locals.documento = req.session.documento
    }
    next()
})


app.get('/', (req, res) => {
    res.render('home', {
        titulo: 'Bienvenido a la aplicacion',
        mensaje: 'Bienvenido a la entrega 2'
    });
});

app.post('/', (req, res) => {
    res.render('home', {
        titulo: 'Bienvenido a la aplicacion',
        mensaje: 'Bienvenido a la entrega 2'
    });
});


app.get('/listarCursosDisponibles', (req, res) => {
    var promise = getCursosDisponibles();
    promise.then(function (respuesta) {
        res.render('listarCursos', {
            listado: respuesta,
            titulo: 'Listar Cursos'
        });
    }).catch(function (error) {
        console.log('Error al buscar cursos' + error)
    })
});

app.get('/listarCursos', (req, res) => {
    var promise = getCursos();
    promise.then(function (respuesta) {
        res.render('listarCursos', {
            listado: respuesta,
            titulo: 'Listar Cursos'
        });
    }).catch(function (error) {
        console.log('Error al buscar cursos' + error)
    })
});

function getCursosDisponibles() {
    var promise = Curso.find({ estado: 'disponible' }).exec();
    return promise;
}

function getCursos() {
    var promise = Curso.find({}).exec();
    return promise;
}

function getCursoById(idCurso) {
    var promise = Curso.find({'id':idCurso}).exec();
    return promise;
}

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
    var promiseCursos = getCursosDisponibles();
    promiseCursos.then(function (cursosDisponibles) {
        res.render('inscribirCurso', {
            listado: cursosDisponibles,
            titulo: 'Vista de aspirante'
        });
    }).catch(function (error) {
        console.log('Error al inscribir cursos' + error)
    })
});

var uploadMatriculas = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        cb(null, false)
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            cb(new Error('No es un archivo con extencion valida'))
        }
        cb(null, true)
    }
})

app.post('/inscribirCurso', uploadMatriculas.single('comprobante'), (req, res) => {
    console.log(req.file);
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
            "CursoID": body.idCurso,
            "comprobante": req.file.buffer
        }
    )

    var query = { 'dni': estudiante.dni },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };

    Estudiante.findOneAndUpdate(query, body, options, function (error, result) {
        if (error) return console.log(err);
    });

    var promise = getCursosDisponibles();
    promise.then(function (cursosDisponibles) {
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
    }).catch(function (error) {
        console.log('Error al inscribir cursos' + error);
    })
});


app.get('/listarMatriculas', (req, res) => {
    var promise = getCursosDisponibles();
    promise.then(function (cursosDisponibles) {
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
    }).catch(function (error) {
        console.log('Error al listar Matriculas' + error);
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
                var promise = getCursosDisponibles();
                promise.then(function (cursosDisponibles) {
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
    var promise = getCursosDisponibles();
    promise.then(function (cursosDisponibles) {
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
    var promise = getCursosDisponibles();
    promise.then(function (cursosDisponibles) {
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


app.get('/crearUsuario', (req, res) => {
    res.render('crearUsuario', {
        titulo: 'Registro de usuarios nuevos',
        mensaje: ''
    });
});



var upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {
        cb(null, false)
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            cb(new Error('No es un archivo con extencion valida'))
        }
        cb(null, true)
    }
})

app.post('/crearUsuario', upload.single('archivo'), (req, res) => {
    if (req.file) {
        var archivo = req.file.buffer;
    }

    const msg = {
        to: req.body.correo,
        from: 'afarboledac@unal.edu.co',
        subject: 'Bienvenido a la entrega final',
        text: 'Entrega final del curso de node',
        html: '<strong> ' + req.body.usuario +'!Bienvenido a la Entrega final del curso de node</strong>',
    };

    let usuario = new Usuario({
        dni: req.body.dni,
        nombre: req.body.nombre,
        usuario: req.body.usuario,
        password: bcrypt.hashSync(req.body.password, 10),
        correo: req.body.correo,
        telefono: req.body.telefono,
        rol: req.body.rol,
        documento: archivo
    })

    usuario.save((err, resultado) => {
        if (err) {
            console.log('error');
            console.log(err);
            res.render('crearUsuario', {
                titulo: 'Registro de usuarios nuevos',
                mensaje: 'El dni ingresado ya fue registrado'
            });
        } else {
            sgMail.send(msg);
            res.render('crearUsuario', {
                titulo: 'Registro de usuarios nuevos',
                mensaje: 'Usuario : ' + resultado.nombre + ' Creado correctamente'
            })
        }
    })
});


app.post('/ingresar', (req, res) => {
    Usuario.findOne({ usuario: req.body.usuario }, (err, resultados) => {
        if (err) {
            return console.log(err)
        }
        if (!resultados) {
            return res.render('home', {
                mensaje: "Usuario no encontrado"
            })
        }
        if (!bcrypt.compareSync(req.body.password, resultados.password)) {
            return res.render('home', {
                mensaje: "Contraseña no es correcta"
            })
        }
        //Para crear las variables de sesión
        req.session.usuario = resultados._id;
        req.session.nombre = resultados.nombre;

        documento = resultados.documento.toString('base64');
        req.session.documento = documento;
        let rol = asignarRol(resultados);
        req.session.rol = rol;
        console.log('Session ' + req.session.rol);
        console.log('Rol ' + rol)
        res.render
        res.render('home', {
            mensaje: "Bienvenido " + resultados.rol + ' ' + resultados.nombre.toUpperCase(),
            nombre: resultados.nombre,
            sesion: true,
            rol: rol,
            documento: documento
        })
    })
})


app.get('/salir', (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err)
    })
    res.redirect('/')
})


app.get('*', (req, res) => {
    res.render('error', {
        titulo: 'error'
    });
});


function asignarRol(resultados) {
    if (resultados.rol === 'coordinador') {
        return true;
    } else {
        return false;
    }
}