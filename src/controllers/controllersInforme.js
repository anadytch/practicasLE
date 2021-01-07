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

controllersInforme.prueba22 = async (req, res) => {
    const prueba22 = await modelsInforme.aggregate([{
        $lookup: {
            from: modelsUsers.collection.name,
            localField: 'userInforme',
            foreignField: '_id',
            as: 'user'
        }
    }]);

    res.json(prueba22);
}

//listar todos los informes
controllersInforme.renderInformeList = async (req, res) => {
    res.render('informes/infList');
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
        "</div>";
        datos.push({
            i: i,
            titulo: documents.tituloInforme,
            numero: documents.numInforme,
            descripcion: documents.descripcionInforme,
            fecha: documents.createdAt,
            botones: botones
        })
    })
    res.json(datos);
}

//(LISTA) listar todos los informes - AJAX
controllersInforme.listInforme = async (req, res) => {
    let i = 0;
    let datos = [];
    let usuario = [];
    //const documentsInforme = await modelsInforme.find();
    const documentsInforme = await modelsInforme.aggregate([{
        $lookup: {
            from: modelsUsers.collection.name,
            localField: 'userInforme',
            foreignField: '_id',
            as: 'user'
        }
    }]);
    //console.log(documentsInforme);
    documentsInforme.forEach( documents => {
        //const usuario = await modelsUsers.findById(documents.userInforme);
        i++;
        botones = "<div class='btn-group btn-group-sm'>" +
        "<button class='btn btn-danger btn-sm btn-deleteInforme' idInforme='" + documents._id + "'><i class='fas fa-trash-alt'></i></button>" +
        "<button class='btn btn-primary btn-sm btn-loadInforme' idInforme='" + documents._id + "' data-toggle='modal' data-target='#editInforme'><i class='fas fa-edit'></i></button>" +
        "</div>";
        usuario = documents.user;
        console.log(usuario.numInforme);
        //console.log('informes : ',documents);
        datos.push({
            i: i,
            usuario: 'usuario',
            numero: documents.numInforme,
            titulo: documents.tituloInforme,
            descripcion: documents.descripcionInforme,
            estado: 'presentado',
            botones: botones
        });
    });
    //console.log('datos : ', datos);
    res.json(datos);
}

module.exports = controllersInforme;