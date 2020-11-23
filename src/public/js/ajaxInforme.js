$(function () {

    // (MOSTRAR NOMBRE DEL ARCHIVO) mostrar el nombre de archivo a subir
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    // (VALIDAR) validar campos del informe
    $("#btn-newInforme").click(function () {
        validarForm()
    });

    $("#btn-editInforme").click(function () {
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

    // (LISTAR DE UN USUARIO) listar los informes personales
    listarInformes();
    function listarInformes() {
        $.ajax({
            url: '/informe/listPersonal/list',
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
                        "<button class='btn btn-danger btn-sm btn-deleteInforme' idInforme='" + documents._id + "'><i class='fas fa-trash-alt'></i></button>" +
                        "<button class='btn btn-info btn-sm btn-loadInforme' idInforme='" + documents._id + "' data-toggle='modal' data-target='#editInforme'><i class='fas fa-edit'></i></button>" +
                        "</div>" +
                        "</td>" +
                        "<tr>";
                })
                $('#tbodyInforme').html(valor);

            }
        });
    }

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

// (FUNCTION DE VALIDAR) validar el formulario de infUserList.hbs
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