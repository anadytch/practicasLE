const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const ConfigSchema = new Schema({
    emailEmisor: { type: String, required: true},
    passwordEmisor: { type: String, required: true},
    passwordEmisorOriginal: { type: String, required: true},
    emailDestino: { type: String, required: true},
    asunto: { type: String, required: true}
});

/* Metodo para encriptar una función */
ConfigSchema.methods.encriptarPassword = async password => {  /* password nombre de la variable de la function */
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

module.exports = model('config', ConfigSchema);