$(function () {
    //(UPDATE) editar o actualizar las configuraciones
    $('#formEditConfig').on('submit', function (event) {
        event.preventDefault();
        let idConfig = $('#idConfig');
        let emailEmisor = $('#emailEmisor');
        let emailDestino = $('#emailDestino');
        let asunto = $('#asunto');
        if(true){
            $.ajax({
                url: '/config/edit/' + idConfig + '?_method=PUT',
                method: 'PUT',
                data: {
                    idConfig: idConfig.val(),
                    emailEmisor: emailEmisor.val(),
                    emailDestino: emailDestino.val(),
                    asunto: asunto.val()
                },
                success: function(response) {
                    console.log(response);
                    Swal.fire(
                        'Actualizado!',
                        'El área se actualizo exitosamente',
                        'success'
                    );
                }
            });
        }
    })
});