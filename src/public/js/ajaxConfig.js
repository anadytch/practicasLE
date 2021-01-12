$(function () {
    //(UPDATE) editar o actualizar las configuraciones
    $('#formEditConfig').on('submit', function (event) {
        event.preventDefault();
        let urlConfig = '';
        let metodoConfig = '';
        let email1 = '';
        let passwordEmisor_confirmado = "";
        let estadoPassword = false;

        let idConfig = $('#idConfig');
        let emailEmisor = $('#editEmailEmisor');
        let passwordEmisor = $('#editPasswordEmisor');
        let emailDestino = $('#editEmailDestino');
        let asunto = $('#editAsunto');

        let emailEmisorDB = $('#emailEmisorDB');
        let passwordEmisorDB = $('#passwordEmisorDB');
        let emailDestinoDB = $('#emailDestinoDB');
        let asuntoDB = $('#asuntoDB');

        if(passwordEmisor.val() == null || passwordEmisor.val() == ""){
            passwordEmisor_confirmado = passwordEmisorDB.val();
            estadoPassword = false;
        }else{
            passwordEmisor_confirmado = passwordEmisor.val();
            estadoPassword = true;
        }

        if(idConfig.val() == null || idConfig.val() == ""){
            urlConfig = '/config/new';
            metodoConfig = 'POST';
        }else{
            urlConfig = '/config/edit/' + idConfig.val() + '?_method=PUT';
            metodoConfig = 'PUT';
        }

        if(validarFormConfig(emailEmisorDB, emailDestinoDB, asuntoDB) ){
            $.ajax({
                url: urlConfig,
                method: metodoConfig,
                data: {
                    idConfig: idConfig.val(),
                    emailEmisor: emailEmisor.val(),
                    passwordEmisor: passwordEmisor_confirmado,
                    emailDestino: emailDestino.val(),
                    asunto: asunto.val(),
                    estadoPassword: estadoPassword
                },
                success: function(document) {
                    Swal.fire(
                        'Actualizado!',
                        'El área se actualizo exitosamente',
                        'success'
                    );
                    $('#btn-cerrarModalConfig').click();
                    $('#emailEmisor').val(document.emailEmisor);
                    $('#emailDestino').val(document.emailDestino);
                    $('#asunto').val(document.asunto);
                    $('#emailEmisorDB').val(document.emailEmisor);
                    $('#emailDestinoDB').val(document.emailDestino);
                    $('#asuntoDB').val(document.asunto);

                    $('#editPasswordEmisor').val('');
                }
            });
        }
    });

    //Enviar correo electronico
    $('.btn-enviarCorreo').click(function (event) {
        event.preventDefault();
        let idConfig = $('#idConfig');
        let emailEmisorDB = $('#emailEmisorDB');
        let emailDestinoDB = $('#emailDestinoDB');
        let asuntoDB = $('#asuntoDB');
        let mensaje = $('#mensaje');
        
        $.ajax({
            url: '/config/enviar',
            method: 'POST',
            data: {
                idConfig: idConfig.val(),
                emailEmisorDB: emailEmisorDB.val(),
                emailDestinoDB: emailDestinoDB.val(),
                asuntoDB: asuntoDB.val(),
                mensaje: mensaje.val()
            },
            success: function(response) {
                Swal.fire(
                    'Correo Enviado!',
                    response,
                    'success'
                );
            }
        });
    });

});

function validarFormConfig(emailEmisorDB, emailDestinoDB, asuntoDB) {
    if ($('#editEmailEmisor').val() == "") {
        $("#editEmailEmisor").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo Emisor no puede estar vacio!'
        })
        
        return false;
    }
    if ($('#editEmailDestino').val() == "") {
        $("#editEmailDestino").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo Destino no puede estar vacio!'
        })
        return false;
    }
    if ($('#editAsunto').val() == "") {
        $("#editAsunto").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo asunto no puede estar vacio!'
        })
        return false;
    }
    if ($('#editEmailEmisor').val() == emailEmisorDB.val() && $('#editEmailDestino').val() == emailDestinoDB.val() && $('#editAsunto').val() == asuntoDB.val()) {
        $("#editEmailEmisor").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡No se generaron cambios para Guardar!'
        })
        
        return false;
    }
    if ($('#editEmailEmisor').val() != emailEmisorDB.val() && $('#editPasswordEmisor').val() == "") {
        $("#editEmailEmisor").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Le falto poner la contraseña del nuevo EMISOR!'
        })
        
        return false;
    }
    return true;
}