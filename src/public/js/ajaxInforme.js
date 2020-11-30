$(function () {
    // (LISTAR DE UN USUARIO) listar los informes personales
    listarInformes();

    // (VALIDAR) validar campos del informe
    $("#btn-newInforme").click(function () {
        validarFormNewInforme();
    });

    $("#btn-editInforme").click(function () {
        validarFormEditInforme();
    });

    // (LOAD) cargar datos un informe
    $('table').on('click', '.btn-loadInforme', function (event) {
        event.preventDefault();
        let id = $(this).attr('idInforme');
        $.ajax({
            url: '/informe/edit' + id,
            method: 'GET',
            success: function (documents) {
                $("#formEditInforme").attr('action','/informe/edit/' + documents._id + '?_method=PUT');
                $("#idInforme").val(documents._id);
                $("#editNumInforme").val(documents.numInforme);
                $("#editTituloInforme").val(documents.tituloInforme);
                $("#editDescripcionInforme").val(documents.descripcionInforme);

            }
        })
    })

    // (DELETE) eliminar un informe
    $('table').on('click', '.btn-deleteInforme', function (event) {
        event.preventDefault();
        let id = $(this).attr('idInforme');
        
        Swal.fire({
            title: '¿Estas Seguro?',
            text: "¡Estas seguro que deseas eliminar este informe!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, bórralo!'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/informe/delete' + id,
                    method: 'DELETE',
                    success: function (data) {
                        Swal.fire(
                            'Eliminado!',
                            data,
                            'success'
                        )
                        listarInformes();
                    }
                })
                
            }
        })
    })
})

//(FUNCTION LISTAR) 
function listarInformes(){
    $('.tableinforme_DataTables').DataTable({
        "destroy": true,
        "ajax": {
            "url": "/informe/listPersonal/list",
            "dataSrc": ""
        },
        "columns": [
            { "data": "i" },
            { "data": "titulo" },
            { "data": "numero" },
            { "data": "descripcion" },
            { "data": "fecha" },
            { "data": "botones" }
        ],
        "language": {
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            },
            "buttons": {
                "copy": "Copiar",
                "colvis": "Visibilidad"
            }
        }
    });
}

// (FUNCTION DE VALIDAR) validar el formulario de infUserList.hbs
function validarFormNewInforme() {
    if ($('#tituloInforme').val() == "") {
        $("#tituloInforme").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo titulo no puede estar vacio!'
        })
        
        return false;
    }
    if (!$('#descripcionInforme').val()) {
        $("#descripcionInforme").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo descripcion no puede estar vacio!'
        })
        return false;
    }
    if ($('#informeUser').get(0).files.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Suba su informe!'
        })
        return false;
    }
    return true;
}

function validarFormEditInforme(){
    if ($('#editTituloInforme').val() == "") {
        $("#editTituloInforme").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo titulo no puede estar vacio!'
        })
        
        return false;
    }
    if (!$('#editDescripcionInforme').val()) {
        $("#editDescripcionInforme").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo descripcion no puede estar vacio!'
        })
        return false;
    }
    return true;
}