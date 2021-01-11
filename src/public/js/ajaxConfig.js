$(function () {
    //(UPDATE) editar o actualizar las configuraciones
    $('#formEditConfig').on('submit', function (event) {
        event.preventDefault();
        let passwordEmisor_confirmado = "";
        let estadoPassword = false;

        let idConfig = $('#idConfig');
        let emailEmisor = $('#emailEmisor');
        let passwordEmisor = $('#passwordEmisor');
        let emailDestino = $('#emailDestino');
        let asunto = $('#asunto');

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

        if(validarFormConfig(emailEmisorDB, emailDestinoDB, asuntoDB) ){
            $.ajax({
                url: '/config/edit/' + idConfig + '?_method=PUT',
                method: 'PUT',
                data: {
                    idConfig: idConfig.val(),
                    emailEmisor: emailEmisor.val(),
                    passwordEmisor: passwordEmisor_confirmado,
                    emailDestino: emailDestino.val(),
                    asunto: asunto.val(),
                    estadoPassword: estadoPassword
                },
                success: function(response) {
                    $('#passwordEmisor').val('');
                    Swal.fire(
                        'Actualizado!',
                        'El área se actualizo exitosamente',
                        'success'
                    );
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
    if ($('#emailEmisor').val() == "") {
        $("#emailEmisor").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo Emisor no puede estar vacio!'
        })
        
        return false;
    }
    if ($('#emailDestino').val() == "") {
        $("#emailDestino").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo Destino no puede estar vacio!'
        })
        return false;
    }
    if ($('#asunto').val() == "") {
        $("#asunto").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo asunto no puede estar vacio!'
        })
        return false;
    }
    if ($('#emailEmisor').val() == emailEmisorDB.val() && $('#emailDestino').val() == emailDestinoDB.val() && $('#asunto').val() == asuntoDB.val()) {
        $("#emailEmisor").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡No se generaron cambios para Guardar!'
        })
        
        return false;
    }
    if ($('#emailEmisor').val() != emailEmisorDB.val() && $('#passwordEmisor').val() == "") {
        $("#emailEmisor").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡Le falto poner la contraseña del nuevo EMISOR!'
        })
        
        return false;
    }
    return true;
}