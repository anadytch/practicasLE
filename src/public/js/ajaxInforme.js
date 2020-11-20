$(function () {

    $("#btn-NuevoInforme").click(function (event) {
        validarForm();
    });

    //editar un informe
    $('table').on('click', '.btn-editar', function (event) {
        event.preventDefault();
        let id = $(this).attr('idInforme');
        $.ajax({
            url: '/informe/edit' + id,
            method: 'GET',
            success: function (documents) {
                $("#tituloInforme").val(documents.tituloInforme);
                $("#descripcionInforme").val(documents.descripcionInforme);

            }
        })
    })

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
                        "<td>" + i + "</td>" +
                        "<td>" + documents.tituloInforme + "</td>" +
                        "<td>" + documents.numInforme + "</td>" +
                        "<td>" + documents.descripcionInforme + "</td>" +
                        "<td>" + documents.createdAt + "</td>" +
                        "<td>" +
                        "<div class='btn-group btn-group-sm'>" +
                        "<button class='btn btn-danger btn-sm btn-eliminar' idInforme='" + documents._id + "'><i class='fas fa-trash-alt'></i></button>" +
                        "<button class='btn btn-info btn-sm btn-editar' idInforme='" + documents._id + "' data-toggle='modal' data-target='#nuevoInforme'><i class='fas fa-edit'></i></button>" +
                        "</div>" +
                        "</td>" +
                        "<tr>";
                })
                $('#tbodyInforme').html(valor);

            }
        });
    }

    //eliminar un informe
    $('table').on('click', '.btn-eliminar', function (event) {
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

//validar el formulario de infUserList.hbs
function validarForm() {
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