const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    dniUser: {type: String, required: true},
    nombreUser: { type: String, required: true },
    emailUser: { type: String, required: true, unique: true },
    passwordUser: { type: String, required: true },
    areaUser: { type: String, required: true},
    perfilUser: {type: Boolean, default: false},
    estadoUser: {type: Boolean,default: true},
    imageUser: {type: Boolean, required: true},
    rutaImgUser: {type: String, required: true}
}, {
    timestamps: true
});

/* Metodo para encriptar una función */
UserSchema.methods.encriptarPassword = async password => {  /* password nombre de la variable de la function */
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

/* Metodo para comparar las contraseñas */
UserSchema.methods.compararPassword = async function(password) {    /* dudas con la variable password y userPassword */
    return await bcrypt.compare(password, this.passwordUser); //devuelve un true o un false
}

module.exports = model('users', UserSchema);