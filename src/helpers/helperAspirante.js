const hbs = require('hbs');
const funciones = require('../funciones.js');

hbs.registerHelper('registrarEncurso', (curso) => {
    funciones.crearCurso(curso);
})