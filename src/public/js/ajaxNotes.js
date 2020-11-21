$( function () {
    
    // (LISTAR DE UN USUARIO) listar los informes personales
    listarInformes();
    function listarInformes() {
        $.ajax({
            url: '/notes/listNote',
            success: function (data) {
                var valor = '';
                console.log(data);
                if(data){
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
                                    "<form action='/notes/delete/{{id}}?_method=DELETE' method='POST'>" +
                                        "<input type='hidden' name='_method' value='DELETE'>" +
                                        "<button type='submit' class='btn btn-warning btn-block btn-sm'>Eliminar</button>" +
                                    "</form>" +
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

})  //fin