const {Schema, model} = require('mongoose');

const AreaSchema = new Schema({
    tituloArea: {
        type: String,
        required: true
    },
    descripcionArea: {
        type: String,
        required: true
    },
    estadoArea: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

module.exports = model('areas', AreaSchema);