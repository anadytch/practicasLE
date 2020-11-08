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
                console.log(informes);
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