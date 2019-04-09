const fs = require('fs');
listaCursos = [];

const cargarCursos = () => {
    try {
        listaCursos = require('./cursos');
    } catch (error) {
        listaCursos = [];
    }
    return listaCursos;
}

const mostrarCursosDisponibles = () => {
    cargarCursos();
    let cursosDisponibles = listaCursos.filter(curso => curso.estado == "disponible");
    return cursosDisponibles;
}

const guardarCursos = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('./src/cursos.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo creado con exito')
    });
}

const crearCurso = (curso) => {
    cargarCursos();
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
        guardarCursos();
        return 'Se ha creado el curso ' + 'ID: ' + curso.id + '-' + curso.nombre + 'Correctamente';
    } else {
        return 'Ya existe otro curso con el ID : ' + curso.id;
    }
}

const eliminarCurso = (idCurso) => {
    cargarCursos();
    indice = -1
    for (i = 0; i < listaCursos.length; i++) {
        if (idCurso == listaCursos[i].id) {
            indice = i;
            break;
        }
    }
    if (indice >= 0) {
        listaCursos[i].estado = 'cerrado';
        guardarCursos();
    }
    console.log('indice curso ' +indice);
}

module.exports ={
    mostrarCursosDisponibles,
    crearCurso,
    eliminarCurso
}