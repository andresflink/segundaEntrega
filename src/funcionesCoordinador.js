const fs = require('fs');
const funciones = require('./funciones');
const funcionesAspirante = require('./funcionesAspirante');




const listarEstudiantesCursos = () => {
    listaAspirantes = funcionesAspirante.listarAspirantes();
    listaCursos = funciones.listarCursos();
    var inscritos = {}
    listaCursos.forEach(curso => {
        let idcurso = curso.id;
        console.log(listarAspiranteInscrito(idcurso)); 
    });
}

function listarAspiranteInscrito(idcurso) {
    let inscritos = {
        "curso":idcurso,
        "inscritos":[]
    };
    listaAspirantes.forEach(aspirante => {
        if (aspirante.cursos.indexOf(idcurso) >= 0) {
            inscritos.inscritos.push(aspirante.dni);
        }
    });
    return inscritos;
}

module.exports = {
    listarEstudiantesCursos,
    listarAspiranteInscrito
}


