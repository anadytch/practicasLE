const controllersConfig = {};
const modelsAreas = require('../models/modelsAreas');

//Mostrar interfaz del modulo Config
controllersConfig.renderConfigForm = async (req, res) => {
    res.render('config/config');
};

controllersConfig.enviarCorreo = async (req, res) => {
    
};

module.exports = controllersConfig;