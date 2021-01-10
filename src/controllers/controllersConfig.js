const nodemailer = require('nodemailer');
const controllersConfig = {};
const modelsAreas = require('../models/modelsAreas');

//Mostrar interfaz del modulo Config
controllersConfig.renderConfigForm = async (req, res) => {
    res.render('config/config');
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