const fs = require('fs');

listaMatriculas = []

const cargarMatriculas = () => {
    try {
        listaMatriculas = require("./matriculas.json")
    }
    catch (error) {
        listaMatriculas = []
    }

}
const listarMatriculas = () => {
    cargarMatriculas();
    return listaMatriculas;
}

const guardarMatriculas = () => {
    let datos = JSON.stringify(listaMatriculas)
    fs.writeFile("src/matriculas.json", datos, (err) => {
        if (err) throw (err)
        console.log("Archivo Matricula con exito")
    })
}

const crearMatricula = (matricula) => {
    cargarMatriculas()
    console.log(listaMatriculas)
    let duplicado = listaMatriculas.find(matriculasGuardadas => matriculasGuardadas.dniEstudiante == matricula.dniEstudiante && matriculasGuardadas.CursoID == matricula.CursoID);
    if (!duplicado) {
        listaMatriculas.push(matricula)
        console.log(listaMatriculas)
        guardarMatriculas()
        return 'El estudiante : ' + matricula.dniEstudiante + ' se ha matriculado correctamente';
    }
    else {
        return 'El estudiante : ' + matricula.dniEstudiante + ' ya se encuentra inscrito al curso';
    }
}

const eliminarMatricula = (dniEstudiante, id) => {
    cargarMatriculas();
    indice = -1
    for (i = 0; i < listaMatriculas.length; i++) {
        if (dniEstudiante == listaMatriculas[i].dniEstudiante && id == listaMatriculas[i].CursoID) {
            indice = i;
            break;
        }
    }
    if (indice >= 0) {
        listaMatriculas.splice(indice, 1);
        guardarMatriculas();
    }
    console.log(listaMatriculas);
}


module.exports = {
    crearMatricula,
    listarMatriculas,
    eliminarMatricula
}