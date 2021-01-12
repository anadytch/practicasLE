$(function () {
    // (LISTAR DE UN USUARIO) listar los informes personales
    $('#btn-listFechaInforme').click(function () {
        let fechaInforme = $('#fechaInforme').val();
        let numInforme = fechaInforme.toString().substring(8,10) + fechaInforme.toString().substring(5,7) + fechaInforme.toString().substring(0,4)        

        var fecha_formateada = fechaConFormato(fechaInforme);

        cantidadInformePresentado(numInforme);
        listarInformes(numInforme, fecha_formateada);
        $('#tableInforme_DataTables_length').attr('style','margin-top: 8px;');
    });

    listarInformesPersonal();
    $('#tableInformePersonal_DataTables_length').attr('style','margin-top: 8px;');
    informePresentado();

    // (VALIDAR) validar campos del informe
    $("#btn-newInforme").click(function () {
        validarFormNewInforme();
    });

    $("#btn-editInforme").click(function () {
        validarFormEditInforme();
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
                        informePresentado();
                    }
                })
                
            }
        })
    })
})

function informePresentado(){
    $.ajax({
        url: '/informe/informeDia',
        method: 'GET',
        success: function (response) {
            if(response){
                $('#textInformeDia').html('Presentado');
                $('#textInformeDia').addClass("badge-primary");
                $('#textInformeDia').removeClass("badge-danger");
                $('#btn-NuevoInforme').attr('disabled','disabled');
                $('#btn-NuevoInforme').addClass('btn-warning');
                $('#btn-NuevoInforme').removeClass('btn-primary');
            }else{
                $('#textInformeDia').html('No presentado');
                $('#textInformeDia').addClass("badge-danger");
                $('#textInformeDia').removeClass("badge-primary");
                $('#btn-NuevoInforme').removeAttr('disabled');
                $('#btn-NuevoInforme').addClass('btn-primary');
                $('#btn-NuevoInforme').removeClass('btn-warning');
            }
        }
    })
}

function cantidadInformePresentado(numInforme){
    $.ajax({
        url: '/informe/cantidadInformeDia/'+numInforme,
        method: 'GET',
        success: function (response) {
            if(response[0].cantidadUsers > response[0].cantidadInformePresentado){
                $('#textCantidadInformeDia').html(response[0].diferencia);
                $('#textCantidadInformeDia').addClass("badge-danger");
                $('#textCantidadInformeDia').removeClass("badge-primary");
            }else{
                $('#textCantidadInformeDia').html(response[0].diferencia);
                $('#textCantidadInformeDia').addClass("badge-primary");
                $('#textCantidadInformeDia').removeClass("badge-danger");
            }
        }
    })
}

//(FUNCTION LISTAR INFORMES DE UN PERSONAL) 
function listarInformesPersonal(){
    var nombreUser = $('.nombreUser').attr('nombreUser');
    var fecha_formateada = fechaConFormato();

    var table = $('#tableInformePersonal_DataTables').DataTable({
        "destroy": true,
        "ajax": {
            "url": "/informe/listPersonal/list" ,
            "dataSrc": ""
        },
        "columns": [
            { "data": "i" },
            { "data": "numero" },
            { "data": "titulo" },
            { "data": "descripcion" },
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
    });
    if(table.context.length == 1){
        new $.fn.dataTable.Buttons( table, {
            buttons: [
                {
                    extend: 'excel',
                    text: 'Excel',
                    title: 'LEGENDARY EVOLUTION S.A.C.',
                    filename: 'Legendary Evolution - Lista de Informes de '+ nombreUser +' (' + fecha_formateada +')',
                    messageTop: 'Lista de Informes de '+ nombreUser +' - ' + fecha_formateada,
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
                    filename: 'Legendary Evolution - Lista de Informes de '+ nombreUser +' (' + fecha_formateada +')',
                    messageTop: 'Lista de Informes de '+ nombreUser +' - ' + fecha_formateada,
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
                    messageTop: 'Lista de Informes de '+ nombreUser +' - ' + fecha_formateada,
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

//(FUNCTION LISTAR INFORMES) 
function listarInformes(numInforme, fecha_formateada){
    var table = $('#tableInforme_DataTables').DataTable({
        "destroy": true,
        "ajax": {
            "url": "/informe/list/list/"+ numInforme,
            "dataSrc": ""
        },
        "columns": [
            { "data": "i" },
            { "data": "usuario" },
            { "data": "numero" },
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
    new $.fn.dataTable.Buttons( table, {
        buttons: [
            {
                extend: 'excel',
                text: 'Excel',
                title: 'LEGENDARY EVOLUTION S.A.C.',
                filename: 'Legendary Evolution - Lista de Informes (' + fecha_formateada +')',
                messageTop: 'Lista de Informes de todo el personal - ' + fecha_formateada,
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
                filename: 'Legendary Evolution - Lista de Informes (' + fecha_formateada +')',
                messageTop: 'Lista de Informes de todo el personal - ' + fecha_formateada,
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
                messageTop: 'Lista de Informes de todo el personal - ' + fecha_formateada,
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

// (FUNCTION DE VALIDAR) validar el formulario de infUserList.hbs
function validarFormNewInforme() {
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

function validarFormEditInforme(){
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
}

function fechaConFormato(fechaInforme){
    if(fechaInforme != null){
        var fecha = new Date(fechaInforme);
    }else{
        var fecha = new Date();
    }
    var meses = ["Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio","Agosto", "Septiembre", "Octubre","Noviembre", "Diciembre"]
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var yyy = fecha.getFullYear();
    var fecha_formateada = dia + ' de ' + meses[mes] + ' del ' + yyy;
    return fecha_formateada;
}