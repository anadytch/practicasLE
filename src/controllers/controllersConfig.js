const nodemailer = require('nodemailer');
const controllersConfig = {};
const modelsConfig = require('../models/modelsConfig');
const modelsInforme = require('../models/modelsInforme');
const modelsUsers = require('../models/modelsUsers');

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
        passwordEmisorOriginal = passwordEmisor;
        nuevoPassword = await editarConfig.encriptarPassword(passwordEmisor);
    }else{
        nuevoPassword = passwordEmisor;
        passwordEmisorOriginal = editarConfig.passwordEmisorOriginal;
    }

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
        let i = 1;
        const datos = await AgregarMensajeParaEnviar();
        mensajeNuevo = 'Un cordial saludo, se le está reportando la lista de informes presentado hasta el momento por todo el personal registrado de Legendary Evolution SAC. \n \n';
        datos.forEach( document => {
            mensajeNuevo += i +'. ' +document.estadoInformeParaEnviar + '\n';
            i++;
        });
        mensajeNuevo += '\n \n Atte. Admin. de Legendary Evolution SAC.';
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
            res.json('No se pudo enviar, hubo un error');
        }else{
            console.log('Email enviado: '+ info.response);
        }
    });
    res.json('El correo se envió exitosamente');
};

module.exports = controllersConfig;

/* ============================== FUNTION ================================= */

async function AgregarMensajeParaEnviar(){
    var count = 0;
    var fecha = new Date();
    var datos = [];
    var informe = [];
    var numInforme = fecha.toISOString().substring(8,10) + fecha.toISOString().substring(5,7) + fecha.toISOString().substring(0,4);
    const documentsInforme = await modelsInforme.find({numInforme: numInforme});
    informe = documentsInforme;
    const documentsUsers = await modelsUsers.find();
    
    documentsUsers.forEach( documents => {
        count++;
        let presentado = true;
        for (var i = 0; i < informe.length; i++) {
            if( documents._id.toString() == informe[i].userInforme.toString()){

                estadoInformeParaEnviar = documents.nombreUser + " : PRESENTO";
                datos.push({estadoInformeParaEnviar});

                presentado = false;
                break;
            }
        }

        if(presentado){

            estadoInformeParaEnviar = documents.nombreUser + " : NO PRESENTO";
            datos.push({estadoInformeParaEnviar});
        }
    });
    return datos;
}