const {Schema, model, models} = require('mongoose');
const InformeSchema = new Schema({
    numInforme: {type: String, required: true},
    tituloInforme: {type: String, required: true},
    descripcionInforme: {type: String, required: true},
    estadoInforme: {type: Boolean, required: true},
    rutaInforme: {type: String, required: true},
    userInforme: {type: String, required: true}
},{
    timestamps: true
});

module.exports = model('informes', InformeSchema);