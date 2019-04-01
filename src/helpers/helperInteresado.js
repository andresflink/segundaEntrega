const hbs = require('hbs');
const funciones = require('../funciones.js');

hbs.registerHelper('listarCursosDisponibles', () => {
    listaCursos = funciones.mostrarCursosDisponibles()
    let texto = "<table class='table table-hover'> \
                    <thead class='thead-dark'>\
                        <th> Nombre </th>\
                        <th> Descripcion </th>\
                        <th> Valor </th>\
                    </thead>\
                    <tbody>";

    listaCursos.forEach(curso => {
        texto = texto +
            '<tr>' +
            '<td>' + curso.nombre + '</td>' +
            '<td>' + curso.descripcion + '</td>' +
            '<td>' + curso.valor + '</td>' +
            '</tr>';

    })
    return texto = texto + '</tbody></table>';
});


hbs.registerHelper('listarCursosDisponibles2', () => {
    listaCursos = funciones.mostrarCursosDisponibles()
    let texto = '<div class="accordion" id="accordionExample">';
    i=1;
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





hbs.registerHelper('listarCursosDisponibles3', () => {
    listaCursos = funciones.mostrarCursosDisponibles()
    let texto = '<div class="accordion" id="accordionExample">';
    i=1;
    listaCursos.forEach(curso => {
        texto = texto +
        `<div class="card">
            <div class="card-header" id="heading${i}">
                <h4 class="mb-0">
                    <button class="btn" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse{i}">
                    <h5>Nombre : ${curso.nombre} Descripcion : ${curso.descripcion} Valor : ${curso.valor}<h5/>
                    </button>
                </h4>
        </div>
        <div id="collapse${i}" class="collapse show" aria-labelledby="heading${i}" data-parent="#accordionExample">
            <div class="card-body">
            ${curso.id}
            </div>
      </div>`
        i += 1;
    })
    return texto = texto + '</div>';
});
