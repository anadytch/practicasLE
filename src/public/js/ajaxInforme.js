$(function(){
    //listar los informes personales
    listarInformes();
    function listarInformes () {
        $.ajax({
            url: '/informe/listar',
            success: function(data){
                var valor = '';
                let i = 0;
                console.log(data);
                data.forEach(documents => {
                    i++;
                    valor += "<tr>" +
                        "<th>" + i + "</th>" +
                        "<th>" + documents.tituloInforme + "</th>" +
                        "<th>" + documents.numInforme + "</th>" +
                        "<th>" + documents.descripcionInforme + "</th>" +
                        "<th>" + documents.createdAt + "</th>" +
                        "<th>" +
                            "<div class='btn-group btn-group-sm'>" +
                            "<button class='btn btn-danger btn-sm btn-eliminar' data-id='"+ documents._id +"'><i class='fas fa-trash-alt'></i></button>" +
                                "<a href='#' class='btn btn-info btn-editar' role='button'><i class='fas fa-edit'></i></a>" +
                            "</div>" +
                        "<th>"+
                    "<tr>";
                })
                $('#tbodyInforme').html(valor);
                
            }
        });
    }

    //eliminar un informe
    $('table').on('click', '.btn-eliminar', function(event){
        event.preventDefault();
        let id = $(this).attr('data-id');
        $.ajax({
            url: '/informe/delete' + id,
            method: 'DELETE',
            success: function (data) {
                listarInformes();
            }
        })
    })
})

