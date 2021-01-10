const nodemailer = require('nodemailer');
const controllersConfig = {};
const modelsConfig = require('../models/modelsConfig');

//Mostrar interfaz del modulo Config
controllersConfig.renderConfigForm = async (req, res) => {
    const documentsConfig = await modelsConfig.find();
    res.render('config/config', {
        _id: documentsConfig[0]._id,
        emailEmisor: documentsConfig[0].emailEmisor,
        emailDestino: documentsConfig[0].emailDestino,
        asunto: documentsConfig[0].asunto
    });
};

controllersConfig.updateConfig = async (req, res) => {
    const {idConfig, emailEmisor, emailDestino, asunto} = req.body;
    const updateConfiguracion = await modelsConfig.findByIdAndUpdate(idConfig, {
        emailEmisor,
        emailDestino,
        asunto
    });
    console.log(idConfig, ' --- ', updateConfiguracion);
    res.json(updateConfiguracion);
};

controllersConfig.enviarCorreo = async (req, res) => {
    var transporte = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'saldivar.rednaxela@gmail.com',
            pass: 'rednaxela17'
        }
    });

    var mensaje = "Este es una mensaje de prueba";

    var opciones = {
        from: 'saldivar.rednaxela@gmail.com',
        to: 'saldivar17.x@gmail.com',
        subject: 'Asunto de prueba',
        text: mensaje
    };

    transporte.sendMail(opciones, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Email enviado: '+ info.response);
        }
    });
};

module.exports = controllersConfig;