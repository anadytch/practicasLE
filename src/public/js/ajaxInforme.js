$(function () {

    $("#btn-NuevoInforme").click(function () {
        validarForm();
    });

    //listar los informes personales
    listarInformes();
    function listarInformes() {
        $.ajax({
            url: '/informe/listar',
            success: function (data) {
                var valor = '';
                let i = 0;
                console.log(data);
                data.forEach(documents => {
                    i++;
                    valor += "<tr>" +
                        "<th>" + i + "</th>" +
                        "<th>" + documents.tituloInforme + "</th>" +
                        "<th>" + documents.numInforme + "</th>" +
                        "<th>" + documents.descripcionInforme + "</th>" +
                        "<th>" + documents.createdAt + "</th>" +
                        "<th>" +
                        "<div class='btn-group btn-group-sm'>" +
                        "<button class='btn btn-danger btn-sm btn-eliminar' data-id='" + documents._id + "'><i class='fas fa-trash-alt'></i></button>" +
                        "<a href='#' class='btn btn-info btn-editar' role='button'><i class='fas fa-edit'></i></a>" +
                        "</div>" +
                        "<th>" +
                        "<tr>";
                })
                $('#tbodyInforme').html(valor);

            }
        });
    }

    //eliminar un informe
    $('table').on('click', '.btn-eliminar', function (event) {
        event.preventDefault();
        let id = $(this).attr('data-id');
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

//validar el formulario de infUserList.hbs
function validarForm() {
    if ($('#tituloInforme').val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo titulo no puede estar vacio!'
        })
        $("#tituloInforme").focus();
        return false;
    }
    if (!$('#descripcionInforme').val()) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo descripcion no puede estar vacio!'
        })
        $("#descripcionInforme").focus();
        return false;
    }
    if ($('#customFile').get(0).files.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Suba su informe!'
        })
        return false;
    }
    return true;
}