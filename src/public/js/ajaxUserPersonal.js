$(function (){
    listarInformesUser();
    $('#tableInformeUser_DataTables_length').attr('style','margin-top: 8px;');
    informePresentado();

})

function listarInformesUser(){
    var nombrePersonal = $('#nombrePersonal').text();
    var fecha_formateada = fechaConFormato();

    var table = $('#tableInformeUser_DataTables').DataTable({
        "destroy": true,
        "ajax": {
            "url": "/users/usersListInforme",
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
                    filename: 'Legendary Evolution - Lista de Informes de '+ nombrePersonal +' (' + fecha_formateada +')',
                    messageTop: 'Lista de Informes de '+ nombrePersonal +' - ' + fecha_formateada,
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
                    filename: 'Legendary Evolution - Lista de Informes de '+ nombrePersonal +' (' + fecha_formateada +')',
                    messageTop: 'Lista de Informes de '+ nombrePersonal +' - ' + fecha_formateada,
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
                    messageTop: 'Lista de Informes de '+ nombrePersonal +' - ' + fecha_formateada,
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