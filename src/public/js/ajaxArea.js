$(function () {
    //Fecha actual formato (DD de MM del YYYY)
    var fecha = new Date();
    var meses = ["Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio","Agosto", "Septiembre", "Octubre","Noviembre", "Diciembre"]
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var yyy = fecha.getFullYear();
    var fecha_formateada = dia + ' de ' + meses[mes] + ' del ' + yyy;

    // (LISTAR) listar las areas habilitadas y deshabilitadas
    listarAreas(fecha_formateada);
    $('#tableArea_DataTables_length').attr('style','margin-top: 8px;');
    areasHabilitadas();

    //(NEW) guardar una nueva area
    $('#formArea').on('submit', function (event) {
        event.preventDefault();
        let tituloArea = $('#tituloArea');
        let descripcionArea = $('#descripcionArea');
        let estadoArea = $('#estadoArea');
        if(validarFormNewArea()){
            $.ajax({
                url: '/areas/add',
                method: 'POST',
                data: {
                    tituloArea: tituloArea.val(),
                    descripcionArea: descripcionArea.val(),
                    estadoArea: estadoArea.val()
                },
                success: function(response) {
                    tituloArea.val('');
                    descripcionArea.val('');
                    estadoArea.val('Selecciona el estado del área');
                    listarAreas();
                    areasHabilitadas();
                    $('#btn-cerrarModalNewArea').click();
                    Swal.fire(
                        'Guardado!',
                        'La area se guardo con exito',
                        'success'
                    );
                }
            });
        }
    })

    // (DELETE) eliminar un area
    $('table').on('click', '.btn-deleteArea', function (event) {
        event.preventDefault();
        let id = $(this).attr('idArea');
        
        Swal.fire({
            title: '¿Estas Seguro?',
            text: "¡Estas seguro que deseas eliminar este registro!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, bórralo!'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: '/areas/delete/' + id,
                    method: 'DELETE',
                    success: function (data) {
                        Swal.fire(
                            'Eliminado!',
                            data,
                            'success'
                        )
                        listarAreas();
                        areasHabilitadas();
                    }
                })
            }
        })
    })

    // (LOAD) cargar datos de un area
    $('table').on('click', '.btn-loadArea', function (event) {
        event.preventDefault();
        let id = $(this).attr('idArea');
        $.ajax({
            url: '/areas/load/' + id,
            method: 'GET',
            success: function (documents) {
                $("#formEditArea").attr('action','/area/edit/' + documents._id + '?_method=PUT');
                $("#idArea").val(documents[0]._id);
                $("#editTituloArea").val(documents[0].tituloArea);
                $("#editDescripcionArea").val(documents[0].descripcionArea);
                $("#editEstadoArea").val(documents[0].estadoArea);
            }
        })
    })

    //(UPDATE) editar o actualizar un area
    $('#formEditArea').on('submit', function (event) {
        event.preventDefault();
        let idArea = $('#idArea').val();
        let tituloArea = $('#editTituloArea');
        let descripcionArea = $('#editDescripcionArea');
        let estadoArea = $('#editEstadoArea');
        if(validarFormEditArea() ){
            $.ajax({
                url: '/areas/edit/' + idArea,
                method: 'PUT',
                data: {
                    idArea: idArea,
                    tituloArea: tituloArea.val(),
                    descripcionArea: descripcionArea.val(),
                    estadoArea: estadoArea.val()
                },
                success: function(response) {
                    tituloArea.val('');
                    descripcionArea.val('');
                    estadoArea.val('Selecciona el estado del área')
                    listarAreas();
                    areasHabilitadas();
                    $('#btn-cerrarModalEditArea').click();
                    Swal.fire(
                        'Actualizado!',
                        'El área se actualizo exitosamente',
                        'success'
                    );
                }
            });
        }
    })
    
})  //fin

function areasHabilitadas(){
    $.ajax({
        url: '/areas/areasHabilitadas',
        method: 'GET',
        success: function (response) {
            $('#textAreasHabilitadas').html(response);
        }
    })
}

//(FUNCTION LISTAR) 
function listarAreas(fecha_formateada){
    var table = $('#tableArea_DataTables').DataTable({
        "destroy": true,
        "ajax": {
            "url": "/areas/listar",
            "dataSrc": "",
        },
        "columns": [
            { "data": "i" },
            { "data": "titulo" },
            { "data": "descripcion" },
            { "data": "estado" },
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
    
    if(table.context.length == 1){
        new $.fn.dataTable.Buttons( table, {
            buttons: [
                {
                    extend: 'excel',
                    text: 'Excel',
                    title: 'LEGENDARY EVOLUTION S.A.C.',
                    filename: 'Legendary Evolution - Lista de Áreas ('+ fecha_formateada +')',
                    messageTop: 'Lista de Áreas - '+ fecha_formateada,
                    exportOptions: {
                        modifier: {
                            selected: null
                        }
                    }
                },, 
                {
                    extend: 'pdf',
                    text: 'PDF',
                    title: 'LEGENDARY EVOLUTION S.A.C.',
                    filename: 'Legendary Evolution - Lista de Áreas ('+ fecha_formateada +')',
                    messageTop: 'Lista de Áreas - '+ fecha_formateada,
                    exportOptions: {
                        modifier: {
                            selected: null
                        }
                    }
                },
                {
                    extend: 'print',
                    text: 'Imprimir',
                    title: 'LEGENDARY EVOLUTION S.A.C.',
                    messageTop: 'Lista de Áreas - '+ fecha_formateada,
                    exportOptions: {
                        modifier: {
                            selected: null
                        }
                    }
                }
            ]
        });
    
        table.buttons( 0, null ).container().prependTo(table.table().container());
    }
}

// (FUNCTION) validar el formulario de noteList.hbs
function validarFormNewArea() {
    if ($('#tituloArea').val() == "") {
        $("#tituloArea").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo titulo no puede estar vacio!'
        })
        
        return false;
    }
    if (!$('#descripcionArea').val()) {
        $("#descripcionArea").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo descripcion no puede estar vacio!'
        })
        return false;
    }
    if ($('#estadoArea').val() == 'Selecciona el estado del área') {
        $("#estadoArea").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡No selecciono el estado del área!'
        })
        return false;
    }
    return true;
}

function validarFormEditArea() {
    if ($('#editTituloArea').val() == "") {
        $("#editTituloArea").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo titulo no puede estar vacio!'
        })
        
        return false;
    }
    if (!$('#editDescripcionArea').val()) {
        $("#editDescripcionArea").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡El campo descripcion no puede estar vacio!'
        })
        return false;
    }
    if ($('#editEstadoArea').val() == 'Selecciona el estado del área') {
        $("#editEstadoArea").focus();
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: '¡No selecciono el estado del área!'
        })
        return false;
    }
    return true;
}