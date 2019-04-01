const fs = require('fs');
listaCursos = [];
const path = require('path');

function Curso(nombre, id, descripcion, valor, modalidad, estado, intensidad) {
    this.nombre = curso.nombre;
    this.id = curso.id;
    this.descripcion = curso.descripcion;
    this.valor = curso.valor;
    this.modalidad = curso.modalidad;
    this.estado = curso.estado;
    this.intensidad = curso.intensidad;
}

const listarCursos = () => {
    try {
        listaCursos = require('./cursos');
    } catch (error) {
        listaCursos = [];
    }
    return listaCursos;
}

const mostrarCursosDisponibles = () => {
    listarCursos();
    let cursosDisponibles = listaCursos.filter(curso => curso.estado == "disponible");
    return cursosDisponibles;
}

function validarCursoExistente(idCurso){
    listarCursos();
    return listaCursos.find(c => c.id == idCurso) != null;
}

const guardar = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('./src/cursos.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo creado con exito')
    });
}

const crearCurso = (curso) => {
    listarCursos();
    let cur = {
        nombre: curso.nombre,
        id: curso.id,
        descripcion: curso.descripcion,
        valor: curso.valor,
        modalidad: curso.modalidad,
        estado: curso.estado,
        intensidad: curso.intensidad
    };
    let duplicado = listaCursos.find(c => c.id == curso.id);
    if (!duplicado) {
        listaCursos.push(curso);
        guardar();
        return 'Se ha creado el curso ' + 'ID: ' + curso.id + '-' + curso.nombre + 'Correctamente';
    } else {
        return 'Ya existe otro curso con el ID : ' + curso.id;
    }
}

const listarMatriculados = () => {
    try {
        listaCursos = require('./cursos');
    } catch (error) {
        listaCursos = [];
    }
    return listaCursos;
}


module.exports = {
    mostrarCursosDisponibles,
    crearCurso,
    validarCursoExistente,
    listarCursos
}
