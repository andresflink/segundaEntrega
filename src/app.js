const funciones = require('./funciones');
const funcionesAspirante= require('./funcionesAspirante');
const funcionesCoordinador= require('./funcionesCoordinador');


const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

require('./helpers/helperInteresado');
require('./helpers/helperCoordinador');
require('./helpers/helperAspirante');



app.set('view engine', 'hbs');
const directorioPublico = path.join(__dirname, '../public');
app.use(express.static(directorioPublico));

const directorioPartials = path.join(__dirname, '../partials');
hbs.registerPartials(directorioPartials);

app.use(bodyParser.urlencoded({ extended: true }));


const dirNode_modules = path.join(__dirname , '../node_modules')
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));




app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});


app.get('/', (req, res) => {
    res.render('interesado', {
        titulo: 'Vista de interesados'
    });
});

app.get('/interesado', (req, res) => {
    res.render('interesado', {
        titulo: 'Vista de interesados'
    });
});

app.get('/coordinador', (req, res) => {
    res.render('coordinador', {
        titulo: 'Vista de coordinador'
    });
});

app.post('/coordinador', (req, res) => {
    const curso = {
        nombre: req.body.nombre,
        id: req.body.id,
        descripcion: req.body.descripcion,
        valor: req.body.valor,
        modalidad: req.body.modalidad,
        estado: 'disponible',
        intensidad: req.body.intensidad
    };
    let mensajeCrear = funciones.crearCurso(curso);
    res.render('coordinador', {
        titulo: 'Vista de coordinador',
        mensajeCrear:mensajeCrear
    });
});

app.get('/aspirante', (req, res) => {
    res.render('aspirante', {
        titulo: 'Vista de aspirante'
    });
});

app.post('/aspirante', (req, res) => {
    const aspirante = {
        dni: req.body.dni,
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: req.body.telefono
    };
    const idCursoInscribir = req.body.idcurso;
    let mensajeMatricula = funcionesAspirante.matricular(aspirante, idCursoInscribir);
    res.render('aspirante', {
        titulo: 'Vista de aspirante',
        mensajeMatricula:mensajeMatricula
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        titulo: 'Error'
    });
});