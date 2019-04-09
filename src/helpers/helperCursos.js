const hbs = require('hbs');
const funcionesCursos = require('../funcionesCursos');
const funcionesMatriculas = require('../funcionesMatriculas');
const funcionesEstudiantes = require('../funcionesEstudiantes');

hbs.registerHelper('listarCursosDisponibles', () => {
    listaCursos = funcionesCursos.mostrarCursosDisponibles()
    let texto = '<div class="accordion" id="accordionExample">';
    i = 1;
    listaCursos.forEach(curso => {
        texto = texto +
            `<div class="card">
            <div class="card-header" id="heading${i}">
                <h4 class="mb-0">
                    <button class="btn" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                    <h5 align=left>Nombre : ${curso.nombre} </h5>
                    <h5 align=left>Descripcion : ${curso.descripcion}</h5>
                    <h5 align=left>Valor : ${curso.valor}</h5>
                    
                    </button>
                </h4>
            </div>
        </div>
        <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
            <div class="card-body">
                <table class='table table-hover'>
                <thead class='thead-dark'>
                    <th> Descripcion </th>
                    <th> Modalidad </th>
                    <th> Intensidad </th>

                </thead>
                <tbody>
                    <tr>
                        <td>${curso.descripcion} </td>
                        <td>${curso.modalidad} </td>
                        <td>${curso.intensidad} </td>
                    </tr>
                </tbody>
            </table>
            </div>
      </div>`
        i += 1;
    })
    return texto = texto + '</div>';
});

hbs.registerHelper('NombresCursos', () => {
    cursosDisponibles = funcionesCursos.mostrarCursosDisponibles()
    let texto = ""
    cursosDisponibles.forEach(curso => {

        texto += `<option value ="${curso.id}"> ${curso.nombre} </option>`

    })
    return texto
});

hbs.registerHelper('listarMatriculas', () => {
    texto = ""
    listaCursos = funcionesCursos.mostrarCursosDisponibles();
    listaMatriculas = funcionesMatriculas.listarMatriculas();

    listaCursos.forEach(curso => {

        texto += 
        `<table class='table table-hover'> 
            <thead class='thead-dark'>
                <tr>
                    <th colspan="5" style="text-align:center">${curso.nombre}</th>
                </tr>
                <td>
                <form class="form-inline" action = "/cerrarCurso" method="POST">
                    <input type="hidden" name="idEliminar" value="${curso.id}">
                    <button class="btn btn-outline-warning" type="submit">Cerrar</button>
                </form>
            </td>
            </thead>`

        texto += `<tr>
                        <td>Documento</td>
                        <td>Nombre</td>
                        <td>Correo</td>
                        <td>Telefono</td>
                        <td></td>
                    </tr>`
        listaMatriculas.forEach(matricula => {
            if (curso.id === matricula.CursoID) {

                let estudiante = funcionesEstudiantes.buscarEstudiante(matricula.dniEstudiante);


                texto += `<tr>
                        <td>${estudiante.dni}</td>
                        <td>${estudiante.nombre}</td>
                        <td>${estudiante.correo}</td>
                        <td>${estudiante.telefono}</td>
                        <td><form class="form-inline" action = "/eliminarMatricula" method="POST">
                            <input type="hidden" name="dniEstudiante" value="${estudiante.dni}">
                            <input type="hidden" name="cursoID" value="${curso.id}">
                            <button class="btn btn-info" type="submit">Eliminar</button>
                        </form></td>
                        </tr>`}
        })
        texto += `</table>`


    })

    return texto

});