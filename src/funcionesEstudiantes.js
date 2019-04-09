const fs = require('fs');

listaEstudiantes = [];


const listarEstudiantes = () => {
    try {
        listaEstudiantes = require('./estudiantes.json');
    } catch (error) {
        listaEstudiantes = [];
    }
    return listaEstudiantes;
}
const guardarEstudiante = () => {
    let datos = JSON.stringify(listaEstudiantes);
    fs.writeFile('./src/estudiantes.json', datos, (err) => {
        if (err) throw (err);
        console.log('Archivo creado con exito')
    });
}

const crearEstudiante = (estudiante) => {
    listarEstudiantes();
    console.log(listarEstudiantes);
    let duplicado = listaEstudiantes.find(estudiantesGuardados => estudiantesGuardados.dni == estudiante.dni)
    if (!duplicado) {
        listaEstudiantes.push(estudiante)
        guardarEstudiante()
        return true
    }
    else {
        console.log("La identificacion ya fue registrada")
        return false
    }
}

const buscarEstudiante = (dniEstudiante) => {
    listarEstudiantes();
    return listaEstudiantes.find(est => est.dni == dniEstudiante);
}

module.exports = {
    listarEstudiantes,
    crearEstudiante,
    buscarEstudiante
}
