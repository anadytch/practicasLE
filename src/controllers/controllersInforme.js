const controllersInforme = {};
const path = require('path');
const {unlink} = require('fs-extra');

const modelsInforme = require('../models/modelsInforme');
const modelsUsers = require('../models/modelsUsers');

//listar los informes de cada personal
controllersInforme.renderInformeListPersonal = async (req, res) => {
    var num = new Date();
    res.render('informes/infUserList', { numInforme: num.toISOString().substring(8,10)});
};

//listar todos los informes
controllersInforme.renderInformeList = async (req, res) => {
    var i = 1;
    let collections = [];
    
    const documentsInforme = await modelsInforme.find();
    documentsInforme.forEach(async (documentsInforme) => {
        const documentsUser = await modelsUsers.findOne({_id: documentsInforme.userInforme});
        collections.push({
            i: i++,
            id: documentsInforme._id,
            numInforme: documentsInforme.numInforme,
            tituloInforme: documentsInforme.tituloInforme,
            descripcionInforme: documentsInforme.descripcionInforme,
            fechaInforme: documentsInforme.createdAt.toISOString().substring(0,10) + ' ' + documentsInforme.createdAt.toISOString().substring(12,19),
            rutaInforme: documentsInforme.rutaInforme,
            userInforme: documentsUser.nombreUser
        });
    });
    res.render('informes/infList', {informes : collections});
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
        const informePresentado = false;//await modelsInforme.findOne({numInforme: numInforme, userInforme: req.user.id});
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

// (UPLOAD) editar informe
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

// nuevo informe
controllersInforme.nuevoInforme = async (req, res) => {
/*    const {numInforme, tituloInforme, descripcionInforme} = req.body();
    const newInforme = new modelsInforme({
        numInforme,
        tituloInforme,
        descripcionInforme,
        estadoInforme,
        rutaInforme,
        userInforme : req.user.id
    });
    await newInforme.save();
    */
   console.log(req.body);
   console.log(req.file);
}

//listar en TABLE los informes personales (AJAX)
controllersInforme.listInformePersonal = async (req, res) => {
    const documentsInforme = await modelsInforme.find();
    res.json(documentsInforme);
}

//eliminar un registro con su documento de la TABLE del informe personal (AJAX)
controllersInforme.deleteInforme = async (req, res) => {
    const deleteInforme = await modelsInforme.findByIdAndDelete(req.params.id);
    if(deleteInforme.estadoInforme){
        unlink(path.resolve('./src/public'+deleteInforme.rutaInforme));
    }
    res.json('Se elimino correctamente el archivo');
}

//Cargar datos del informe para poder editar
controllersInforme.loadInforme = async (req, res) => {
    const documentsInforme = await modelsInforme.findById(req.params.id);
    res.json(documentsInforme);
}

controllersInforme.listarInforme = async (req, res) => {
    const documentsInforme = await modelsInforme.find({userInforme: req.user.id});
    res.json(documentsInforme);
}

module.exports = controllersInforme;