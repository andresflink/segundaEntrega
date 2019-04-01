const hbs = require('hbs');
const funciones = require('../funciones.js');
const funcionesCoordinador = require('../funcionesCoordinador');
const fs = require('fs');
const funcionesAspirante = require('../funcionesAspirante');


hbs.registerHelper('crearCurso', (curso) => {
    funciones.crearCurso(curso);
});


hbs.registerHelper('listarCursos', () => {
    listaCursos = funciones.listarCursos()
    let texto = "<table class='table table-hover'> \
                    <thead class='thead-dark'>\
                        <th> Nombre </th>\
                        <th> ID </th>\
                        <th> Descripcion </th>\
                        <th> Valor </th>\
                        <th> Modalidad </th>\
                        <th> Intensidad </th>\
                        <th> Estado </th>\
                    </thead>\
                    <tbody>";

    listaCursos.forEach(curso => {
        texto = texto +
            '<tr>' +
            '<td>' + curso.nombre + '</td>' +
            '<td>' + curso.id + '</td>' +
            '<td>' + curso.descripcion + '</td>' +
            '<td>' + curso.valor + '</td>' +
            '<td>' + curso.modalidad + '</td>' +
            '<td>' + curso.intensidad + '</td>' +
            '<td>' + curso.estado + '</td>' +
            '</tr>';

    })
    return texto = texto + '</tbody></table>';
});

hbs.registerHelper('listarEstudiantesCursos', () => {    listaAspirantes = funcionesAspirante.listarAspirantes();
    listaCursos = funciones.listarCursos();
    var inscritos = {}
    let texto;
    listaCursos.forEach(curso => {
        let idcurso = curso.id;
        texto += '<h3>' +"Curso: "+ idcurso+ ' Dni estudiantes Inscritos :'+funcionesCoordinador.listarAspiranteInscrito(idcurso).inscritos + '</h3>'; 
    });
    return texto;
});