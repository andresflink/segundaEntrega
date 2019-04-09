const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

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

const funcionesCursos = require('./funcionesCursos');
const funcionesEstudiantes = require('./funcionesEstudiantes');
const funcionesMatriculas = require('./funcionesMatriculas');



app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});


app.get('/', (req, res) => {
    res.render('home', {
        titulo: 'Bienvenido a la aplicacion'
    });
});


app.get('/listarCursos', (req, res) => {
    res.render('listarCursos', {
        titulo: 'Listar Cursos'
    });
});


app.get('/crearCurso', (req, res) => {
    res.render('crearCurso', {
        titulo: 'Vista de coordinador'
    });
});

app.post('/crearCurso', (req, res) => {
    const curso = {
        nombre: req.body.nombre,
        id: req.body.id,
        descripcion: req.body.descripcion,
        valor: req.body.valor,
        modalidad: req.body.modalidad,
        estado: 'disponible',
        intensidad: req.body.intensidad
    };
    let mensajeCrear = funcionesCursos.crearCurso(curso);
    res.render('crearCurso', {
        titulo: 'Vista de coordinador',
        mensajeCrear: mensajeCrear
    });
});

app.get('/inscribirCurso', (req, res) => {
    res.render('inscribirCurso', {
        titulo: 'Vista de aspirante'
    });
});

app.post('/inscribirCurso', (req, res) => {
    body = req.body;
    estudiante = {
        dni: body.dni,
        nombre: body.nombre,
        correo: body.correo,
        telefono: body.telefono
    };

    matricula =
        {
            "dniEstudiante": body.dni,
            "CursoID": body.idCurso
        }

    funcionesEstudiantes.crearEstudiante(estudiante);
    mensajeMatricula = funcionesMatriculas.crearMatricula(matricula);

    res.render('inscribirCurso', {
        titulo: 'Vista de aspirante',
        mensajeMatricula: mensajeMatricula
    });
});

app.get('/listarMatriculas', (req, res) => {
    res.render('listarMatriculas', {
        titulo: 'Lista De Matriculas'
    });
});


app.post('/eliminarMatricula', (req, res) => {
    body = req.body;
    funcionesMatriculas.eliminarMatricula(body.dniEstudiante, body.cursoID)
    res.render('listarMatriculas', {
        titulo: 'Lista De Matriculas'
    });
});


app.post('/cerrarCurso', (req, res) => {
    body = req.body;
    console.log(body.idEliminar);
    funcionesCursos.eliminarCurso(body.idEliminar);
    res.render('listarMatriculas', {
        titulo: 'Lista De Matriculas'
    });
});

app.get('/cerrarCurso', (req, res) => {
    res.render('listarMatriculas', {
        titulo: 'Lista De Matriculas'
    });
});