$(function(){
    //agregar el nombre del archivo en el input
    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    //previsualizar una imagen
    $('#customFile').change(function(){
        filePreview(this);
    });

    //Registrar un informe
    $('#listarInforme').on('click', function() {
        $.ajax({
            url: '/pruebas',
            success: function(informes){
                let tbody = $('tbody');
                let i = 0;
                tbody.html('');
                informes.forEach(informes => {
                    i=i+1;
                    tbody.append(`
                        <tr>
                            <th>${i}</th>
                            <th>${informes.tituloInforme}</th>
                            <th>${informes.numInforme}</th>
                            <th>${informes.descripcionInforme}</th>
                            <th>${informes.createdAt}</th>
                            <th>
                                <div class="btn-group btn-group-sm">
                                    <form action="#" method="POST">
                                        <button type="submit" class="btn btn-danger btn-sm"><i
                                                class="fas fa-trash-alt"></i></button>
                                    </form>
                                    <a href="#" class="btn btn-info" role="button"><i class="fas fa-edit"></i></a>
                                </div>
                            </th>
                        </tr>                    
                    `);
                });
            }
        })
    })
});


function filePreview(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function(e){
            $("#imagenPrevia").html("<img src='"+e.target.result+"' class='rounded-circle mx-auto d-block mb-3' width='90' height='90'/>");
        }
        reader.readAsDataURL(input.files[0]);
    }
}