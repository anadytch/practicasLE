const {Schema, model} = require('mongoose');

const ConfigSchema = new Schema({
    emailEmisor: { type: String, required: true},
    emailDestino: { type: String, required: true},
    asunto: { type: String, required: true}
});

module.exports = model('config', ConfigSchema);