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
                                        "<a  class='btn-loadNotes' idNotes='"+ documents._id +"' data-toggle='modal' data-target='#editNote'><i class='fas fa-edit'></i></a>" +
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
        if(validarFormNewNote()){
            $.ajax({
                url: '/notes/add',
                method: 'POST',
                data: {
                    tituloNote: tituloNote.val(),
                    descripcionNote: descripcionNote.val()
                },
                success: function(response) {
                    tituloNote.val('');
                    descripcionNote.val('');
                    listarNotes();
                    $('#btn-cerrarModalNewNote').click();
                    Swal.fire(
                        'Guardado!',
                        'La nota se guardo con exito',
                        'success'
                    );
                }
            });
        }
    })

    // (DELETE) eliminar un notas
    $('div').on('click', '.btn-deleteNotes' , function (event) {
        event.preventDefault();
        let id = $(this).attr('idNotes');
        
        Swal.fire({
            title: '¿Estas Seguro?',
            text: "¡Estas seguro que deseas eliminar esta nota!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, bórralo!'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/notes/delete/' + id,
                    method: 'DELETE',
                    success: function (data) {
                        Swal.fire(
                            'Eliminado!',
                            data,
                            'success'
                        );
                        listarNotes();
                    }
                })
                
            }
        })
    });

    //(LOAD) cargar datos listo para ser editados
    $('div').on('click', '.btn-loadNotes', function (event) {
        event.preventDefault();
        let id = $(this).attr('idNotes');
        $("#formEditNote").attr('action','');
        $('#idNote').val('');
        $('#editTituloNote').val('');
        $('#editDescripcionNote').val('');

        $.ajax({
            url: '/notes/load/'+ id,
            method: 'GET',
            success: function(documents){
                $("#formEditNote").attr('action','/notes/edit/' + documents._id + '?_method=PUT');
                $('#idNote').val(documents._id);
                $('#editTituloNote').val(documents.tituloNote);
                $('#editDescripcionNote').val(documents.descripcionNote);
                $('#btn-editNote').attr('idNoteUpdate', documents._id);
            }
        });
    });

    //(UPDATE) editar o actualizar una nota
    $('#formEditNote').on('submit', function (event) {
        event.preventDefault();
        let idNote = $('#idNote').val();
        let tituloNote = $('#editTituloNote');
        let descripcionNote = $('#editDescripcionNote');
        if(validarFormEditNote() ){
            $.ajax({
                url: '/notes/edit/' + idNote,
                method: 'PUT',
                data: {
                    idNote: idNote,
                    tituloNote: tituloNote.val(),
                    descripcionNote: descripcionNote.val()
                },
                success: function(response) {
                    tituloNote.val('');
                    descripcionNote.val('');
                    listarNotes();
                    $('#btn-cerrarModalEditNote').click();
                    Swal.fire(
                        'Actualizado!',
                        'La nota se actualizo exitosamente',
                        'success'
                    );
                }
            });
        }
    })

})  //fin

// (FUNCTION) validar el formulario de noteList.hbs
function validarFormNewNote() {
    if ($('#tituloNote').val() == "") {
        $("#tituloNote").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo titulo no puede estar vacio!'
        })
        
        return false;
    }
    if (!$('#descripcionNote').val()) {
        $("#descripcionNote").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo descripcion no puede estar vacio!'
        })
        return false;
    }
    return true;
}

function validarFormEditNote() {
    if ($('#editTituloNote').val() == "") {
        $("#editTituloNote").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo titulo no puede estar vacio!'
        })
        
        return false;
    }
    if (!$('#editDescripcionNote').val()) {
        $("#editDescripcionNote").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo descripcion no puede estar vacio!'
        })
        return false;
    }
    return true;
}