const nodemailer = require('nodemailer');
const controllersConfig = {};
const modelsConfig = require('../models/modelsConfig');

//Mostrar interfaz del modulo Config
controllersConfig.renderConfigForm = async (req, res) => {
    const documentsConfig = await modelsConfig.find();
    res.render('config/config', {
        _id: documentsConfig[0]._id,
        emailEmisor: documentsConfig[0].emailEmisor,
        passwordEmisor: documentsConfig[0].passwordEmisor,
        emailDestino: documentsConfig[0].emailDestino,
        asunto: documentsConfig[0].asunto
    });
};

controllersConfig.updateConfig = async (req, res) => {
    let nuevoPassword = "";
    let passwordEmisorOriginal = "";
    const {idConfig, emailEmisor, passwordEmisor, emailDestino, asunto, estadoPassword} = req.body;
    
    const editarConfig = await modelsConfig.findOne({_id: idConfig});
    if(estadoPassword){
        nuevoPassword = await editarConfig.encriptarPassword(passwordEmisor);
        passwordEmisorOriginal = passwordEmisor;
    }else{
        nuevoPassword = passwordEmisor;
        passwordEmisorOriginal = editarConfig.passwordEmisorOriginal;
    }
    console.log('contraseña original', editarConfig.passwordEmisorOriginal);

    console.log( passwordEmisor ,' - encriptado : ', nuevoPassword);
    const updateConfiguracion = await modelsConfig.findByIdAndUpdate(idConfig, {
        emailEmisor,
        passwordEmisor: nuevoPassword,
        passwordEmisorOriginal: passwordEmisorOriginal,
        emailDestino,
        asunto
    });
    res.json(updateConfiguracion);
};

controllersConfig.enviarCorreo = async (req, res) => {
    var mensajeNuevo = "";

    const {idConfig, emailEmisorDB, emailDestinoDB, asuntoDB, mensaje} = req.body;
    const datosConfig = await modelsConfig.findOne({_id: idConfig});

    var transporte = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailEmisorDB,
            pass: datosConfig.passwordEmisorOriginal
        }
    });

    if(mensaje == null || mensaje == ""){
        mensajeNuevo = "Mensaje automatico";
    }else{
        mensajeNuevo = mensaje;
    }

    var opciones = {
        from: emailEmisorDB,
        to: emailDestinoDB,
        subject: asuntoDB,
        text: mensajeNuevo
    };

    transporte.sendMail(opciones, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Email enviado: '+ info.response);
        }
    });
    res.json('El correo se envió exitosamente');
};

module.exports = controllersConfig;