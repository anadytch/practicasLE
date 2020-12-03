$(function () {
    //(LISTAR) listar a los users
    listarUsers();

    // (LOAD) cargar datos un informe
    $('table').on('click', '.btn-loadUser', function (event) {
        event.preventDefault();
        let id = $(this).attr('idUser');
        $("#mostrarImagenUser").attr('src','');

        $.ajax({
            url: '/users/load/' + id,
            method: 'GET',
            success: function (documents) {
                console.log(documents);
                $("#formEditUser").attr('action','/users/edit/' + documents._id + '?_method=PUT');
                $("#idUser").val(documents._id);
                $("#mostrarImagenUser").attr('src',documents.rutaImgUser);
                $("#editDniUser").val(documents.dniUser);
                $("#editNombreUser").val(documents.nombreUser);
                $("#editEmailUser").val(documents.emailUser);
            }
        })
    })

    // (DELETE) eliminar un area
    $('table').on('click', '.btn-deleteUser', function (event) {
        event.preventDefault();
        let id = $(this).attr('idUser');
        
        Swal.fire({
            title: '¿Estas Seguro?',
            text: "¡Estas seguro que deseas eliminar este usuario!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, bórralo!'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/users/delete/' + id,
                    method: 'DELETE',
                    success: function (data) {
                        Swal.fire(
                            'Eliminado!',
                            data,
                            'success'
                        )
                        listarUsers();
                    }
                })
            }
        })
    })

})

//(FUNCTION LISTAR)
function listarUsers () {
    $('.tableUser_DataTables').DataTable({
        "destroy": true,
        "ajax": {
            "url": "/users/listar",
            "dataSrc": "",
        },
        "columns": [
            { "data": "i" },
            { "data": "dni" },
            { "data": "nombre" },
            { "data": "area" },
            { "data": "perfil" },
            { "data": "estado" },
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
    })    
}