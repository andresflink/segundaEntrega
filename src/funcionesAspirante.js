const fs = require('fs');
const funciones = require('./funciones');

listaAspirantes = [];
const path = require('path');


const listarAspirantes = () => {
    try {
        listaAspirantes = require('./aspirantes.json');
    } catch (error) {
        listaAspirantes = [];
    }
    return listaAspirantes;
}
const guardar = () => {
    let datos = JSON.stringify(listaAspirantes);
    fs.writeFile('./src/aspirantes.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo creado con exito')
    });
}


const matricular = (aspirante, idCurso) => {
    listarAspirantes();
    let asp = {
        nombre: aspirante.nombre,
        dni: aspirante.dni,
        descripcion: aspirante.descripcion,
        correo: aspirante.correo,
        descripcion: aspirante.descripcion,
        telefono: aspirante.telefono,
        descripcion: aspirante.descripcion,
        cursos:[idCurso]
    };
    let isCursoExistente = funciones.validarCursoExistente(idCurso);
    let encontrado = listaAspirantes.find(a => a.dni == aspirante.dni);




    if (isCursoExistente) {
        if(encontrado){
            let isAspiranteInscrito = encontrado.cursos.find(function(element) {
                return element == idCurso;});
                console.log(encontrado);
                console.log(isAspiranteInscrito);
                if(isAspiranteInscrito == null){
                    encontrado.cursos.push(idCurso);
                    guardar();
                }else{
                    return 'Ya se encuentra registrado en el curso ' + idCurso; 

                }

        }else{
            console.log(asp);
            listaAspirantes.push(asp)
            guardar();
        }

        return 'Se ha inscrito al el curso ' + 'ID: ' + idCurso+ '-' + 'Correctamente';
    } else { 
        return 'El curso ingresado no existe: ' + idCurso; 
    }
}

module.exports = {
    listarAspirantes,
    matricular
}
