$( function () {
    
    // (LISTAR NOTES) listar las notas
    listarNotes();
    function listarNotes() {
        $.ajax({
            url: '/notes/listNote',
            success: function (data) {
                var valor = '';
                if(data.length != 0){
                    data.forEach(documents => {
                        valor += "<div class='col-md-3'>" +
                            "<div class='card bg-light mb-3'>" +
                                "<div class='card-body'>" +
                                    "<h4 class='card-title d-flex justify-content-between align-items-center'>" +
                                        documents.tituloNote +
                                        "<a data-toggle='modal' data-target='#editNote'><i class='fas fa-edit'></i></a>" +
                                    "</h4>" +
                                    "<p>" +
                                        documents.descripcionNote +
                                    "</p>" +
                                    "<button class='btn btn-warning btn-block btn-sm btn-deleteNotes' idNotes='" + documents._id + "'>Eliminar</button>" +
                                "</div>" +
                            "</div>" +
                        "</div>";
                    })

                }else{
                    valor += "<div class='card mx-auto'>" +
                        "<div class='card-body'>" +
                            "<p class='lead'> No hay notas aún.</p>" +
                            "<a href='/notes/add' class='btn btn-success btn-block'>Nueva nota</a>" +
                        "</div>" +
                    "</div>";
                }
                $('#listNotes').html(valor);
            }
        });
    }

    //(NEW) guardar una nueva note
    $('#formNotes').on('submit', function (event) {
        event.preventDefault();
        let tituloNote = $('#tituloNote');
        let descripcionNote = $('#descripcionNote');
        $.ajax({
            url: '/notes/nuevo',
            method: 'POST',
            data: {
                tituloNote: tituloNote.val(),
                descripcionNote: descripcionNote.val()
            },
            success: function(response) {
                tituloNote.val('');
                descripcionNote.val('');
                listarNotes();
            }
        });
    })

    // (VALIDAR) validar y cerrar el modal
    $('#btn-newNote').click( function () {
        $('#newNote').modal('hide');
    });

    // (DELETE) eliminar un notas
    $('div').on('click', '.btn-deleteNotes' , function (event) {
        event.preventDefault();
        let id = $(this).attr('idNotes');
        
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
                    url: '/notes/deletes/' + id,
                    method: 'DELETE',
                    success: function (data) {
                        Swal.fire(
                            'Eliminado!',
                            data,
                            'success'
                        )
                        listarNotes();
                    }
                })
                
            }
        })
    });

})  //fin