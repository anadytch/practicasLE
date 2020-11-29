const modelsInforme = require('../../models/modelsInforme');

const documentsInforme = await modelsInforme.find();
var valor = '';
var botones = "";
let i = 0;
valor += '{"data": [';
documentsInforme.forEach(documents => {
    i++;
    botones = "<div class='btn-group btn-group-sm'>" +
    "<button class='btn btn-danger btn-sm btn-deleteInforme' idInforme='" + documents._id + "'><i class='fas fa-trash-alt'></i></button>" +
    "<button class='btn btn-info btn-sm btn-loadInforme' idInforme='" + documents._id + "' data-toggle='modal' data-target='#editInforme'><i class='fas fa-edit'></i></button>" +
    "</div>";

    valor +='[ "' + i + '","' + documents.tituloInforme + '","' + documents.numInforme + '","' + documents.descripcionInforme + '","' + documents.createdAt + '","' + botones + '" ],';
})
valor = valor.substring(0, valor.length - 1);
valor += ']}';