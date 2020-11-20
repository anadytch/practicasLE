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

//crear un informes nuevo
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
        //estadoInforme = false;
        //rutaInforme = '/files/sinDocumento.png';
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
    if(!descripcionInforme){
        errors.push({text: 'Porfavor ingrese la descripcion de su informe'});
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

controllersInforme.renderInformeEdit = (req, res) => {
}

/*=============== AJAX ===============*/

//listar en TABLE los informes personales (AJAX)
controllersInforme.listarInformePersonal = async (req, res) => {
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

//CARGAR DATOS PARA EDITAR
controllersInforme.cargarDatos = async (req, res) => {
    const documentsInforme = await modelsInforme.findById(req.params.id);
    res.json(documentsInforme);


}

module.exports = controllersInforme;