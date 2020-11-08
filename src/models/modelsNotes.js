const { Schema, model } = require('mongoose');

const NoteSchema = new Schema({
    tituloNote: {
        type: String,
        required: true
    },
    descripcionNote: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

module.exports = model('notes', NoteSchema);    //(nombre de la collections, nombre del esquema)