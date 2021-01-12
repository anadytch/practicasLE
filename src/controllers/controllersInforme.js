const controllersInforme = {};
const path = require('path');
const {unlink} = require('fs-extra');

const modelsInforme = require('../models/modelsInforme');
const modelsUsers = require('../models/modelsUsers');

//listar los informes de cada personal
controllersInforme.renderInformeListPersonal = async (req, res) => {
    var num = new Date();
    var numInforme = num.toISOString().substring(8,10) + num.toISOString().substring(5,7) + num.toISOString().substring(0,4);
    res.render('informes/infUserList', { numInforme: numInforme});
};

//listar todos los informes
controllersInforme.renderInformeList = async (req, res) => {
    var num = new Date();
    var fechaInforme = num.toISOString().substring(0,4) +'-'+ num.toISOString().substring(5,7) +'-'+ num.toISOString().substring(8,10);
    res.render('informes/infList', {fechaInforme});
};

// (NUEVO) crear un informes nuevo
controllersInforme.createInforme = async (req, res) => {
    const errors = [];
    
    const {
        numInforme,
        tituloInforme,
        descripcionInforme,
    } = req.body;
    if(req.file){
        estadoInforme = true;
        rutaInforme = '/files/'+req.file.filename;
    }else{
        errors.push({text: 'Porfavor suba su informe'});
    }
    const tamañoArchivo = req.file.size;
    const extAceptables = /pdf|docx|doc/;
    const mimetype = extAceptables.test(req.file.mimetype);
    const extname = extAceptables.test(path.extname(req.file.originalname));
    if(tamañoArchivo > 5000000){
        errors.push({text: 'El tamaño del archivo debe ser menor a 5MB'});
    }
    if(!mimetype && !extname){
        errors.push({text: 'El archivo debe ser un documento Word o PDF'});
    }
    if(errors.length > 0){
        res.render('informes/infUserList', {
            errors,
            numInforme,
            tituloInforme,
            descripcionInforme
        });
    }else{
        const informePresentado = await modelsInforme.findOne({numInforme: numInforme, userInforme: req.user.id});
        if(informePresentado){
            req.flash('error_msj', 'Ya presento su informe del dia');
            res.redirect('/informe/listPersonal');
        }else{
            const newInforme = new modelsInforme({
                numInforme,
                tituloInforme,
                descripcionInforme,
                estadoInforme,
                rutaInforme,
                userInforme : req.user.id
            });
            await newInforme.save();
            req.flash('success_msj', 'Informe Guardado con exito');
            res.redirect('/informe/listPersonal');
        }
    }
}

// (UPDATE) editar informe
controllersInforme.uploadInforme = async (req, res) => {
    const errors = [];

    const {
        idInforme,
        editNumInforme,
        editTituloInforme,
        editDescripcionInforme
    } = req.body;
    const docInforme = await modelsInforme.findOne({_id: idInforme});
    if(req.file){
        rutaInforme =  '/files/' + req.file.filename;
        if(estadoInforme){
            unlink(path.resolve('./src/public' + docInforme.rutaInforme));
        }
        estadoInforme = true;
    }else{
        estadoInforme = false;
        rutaInforme = docInforme.rutaInforme;
    }
    if(errors.length > 0){
        res.render('informes/infUserList', {
            errors,
            idInforme,
            editNumInforme,
            editTituloInforme,
            editDescripcionInforme
        });
    }else{
        await modelsInforme.findByIdAndUpdate(idInforme, {
            numInforme: editNumInforme,
            tituloInforme: editTituloInforme,
            descripcionInforme :editDescripcionInforme,
            estadoInforme,
            rutaInforme,
            userInforme: req.user.id
        });
        req.flash('success_msj', 'informe actualizada con exito');
        res.redirect('/informe/listPersonal/');
    }
};

/*=============== AJAX ===============*/
//mostrar el informe del dia
controllersInforme.informeDia = async (req, res) => {
    var num = new Date();
    var numInforme = num.toISOString().substring(8,10) + num.toISOString().substring(5,7) + num.toISOString().substring(0,4);
    const informePresentado = await modelsInforme.findOne({numInforme: numInforme, userInforme: req.user.id});
    res.json(informePresentado);
}

//mostrar la cantidad de informes presentados en el dia
controllersInforme.cantidadInformeDia = async (req, res) => {
    let datos = [];
    var numInforme = req.params.numInforme;
    const cantidadUsers = await modelsUsers.count();
    const cantidadInformePresentado = await modelsInforme.count({numInforme: numInforme});
    let diferencia = cantidadUsers - cantidadInformePresentado;
    datos.push({
        cantidadUsers,
        cantidadInformePresentado,
        diferencia
    });
    console.log(datos);
    res.json(datos);
}

//(DELETE) eliminar un registro con su documento de la TABLE del informe personal - AJAX
controllersInforme.deleteInforme = async (req, res) => {
    const deleteInforme = await modelsInforme.findByIdAndDelete(req.params.id);
    if(deleteInforme.estadoInforme){
        unlink(path.resolve('./src/public'+deleteInforme.rutaInforme));
    }
    res.json('Se elimino correctamente el archivo');
}

//(LOAD) Cargar datos del informe para poder editar - AJAX
controllersInforme.loadInforme = async (req, res) => {
    const documentsInforme = await modelsInforme.findById(req.params.id);
    res.json(documentsInforme);
}

//(LISTA PERSONAL) listar los informes de un solo personal en especifico - AJAX
controllersInforme.listInformePersonal = async (req, res) => {
    let i = 0;
    let datos = [];
    const documentsInforme = await modelsInforme.find({userInforme: req.user.id});
    documentsInforme.forEach( documents => {
        i++;
        botones = "<div class='btn-group btn-group-sm'>" +
        "<button class='btn btn-danger btn-sm btn-deleteInforme' idInforme='" + documents._id + "'><i class='fas fa-trash-alt'></i></button>" +
        "<button class='btn btn-primary btn-sm btn-loadInforme' idInforme='" + documents._id + "' data-toggle='modal' data-target='#editInforme'><i class='fas fa-edit'></i></button>" +
        "<button class='btn btn-success btn-sm btn-viewInforme' idInforme='" + documents._id + "'><i class='far fa-eye'></i></button>" +
        "</div>";
        datos.push({
            i: i,
            numero: documents.numInforme,
            titulo: documents.tituloInforme,
            descripcion: documents.descripcionInforme,
            fecha: fechaConFormato(documents.createdAt),
            botones: botones
        });
    })
    res.json(datos);
}

//(LISTA) listar todos los informes - AJAX
controllersInforme.listInforme = async (req, res) => {
    let count = 0;
    let datos = [];
    let informe = [];
    let numInforme = req.params.numInforme
    const documentsInforme = await modelsInforme.find({numInforme: numInforme});
    informe = documentsInforme;
    const documentsUsers = await modelsUsers.find();

    documentsUsers.forEach( documents => {
        count++;
        let presentado = true;
        for (var i = 0; i < informe.length; i++) {
            if( documents._id.toString() == informe[i].userInforme.toString()){

                botones = "<div class='btn-group btn-group-sm'>" +
                "<button class='btn btn-success btn-sm btn-viewInforme' idInforme='" + documents._id + "'><i class='far fa-eye'></i></button>" +
                "</div>";
                datos.push({
                    i: count,
                    usuario: documents.nombreUser,
                    numero: informe[i].numInforme,
                    titulo: informe[i].tituloInforme,
                    descripcion: informe[i].descripcionInforme,
                    estado: '<span class="badge badge-pill badge-success">Presento</span>',
                    botones: botones
                });

                presentado = false;
                break;
            }
        }

        if(presentado){

            botones = "<div class='btn-group btn-group-sm'>" +
            "<button class='btn btn-success btn-sm btn-viewInforme' idInforme='" + documents._id + "'><i class='far fa-eye'></i></button>" +
            "</div>";
            datos.push({
                i: count,
                usuario: documents.nombreUser,
                numero: numInforme,
                titulo: 'Sin titulo',
                descripcion: 'Sin descripción',
                estado: '<span class="badge badge-pill badge-danger">No presento</span>',
                botones: botones
            });
        }
    });
    res.json(datos);
}

module.exports = controllersInforme;

function fechaConFormato(fechaDB){
    var fecha = '';
    if(fechaDB != null || fechaDB != ""){
        fecha = fechaDB;
    }else{
        var fecha = new Date();
    }
    var meses = ["Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio","Agosto", "Septiembre", "Octubre","Noviembre", "Diciembre"]
    var dia = fecha.getDate();
    var mes = fecha.getMonth();
    var yyy = fecha.getFullYear();
    var hora = fecha.getHours();
    var minuto = fecha.getMinutes();
    var segundo = fecha.getSeconds();
    var fecha_formateada = dia + ' de ' + meses[mes] + ' del ' + yyy + ' ' + hora + ':' + minuto + ':' + segundo +'_horas.';
    return fecha_formateada;
}