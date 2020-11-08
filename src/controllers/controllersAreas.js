const controllersAreas = {};
const modelsAreas = require('../models/modelsAreas');
const modelsUsers = require('../models/modelsUsers');

//Listar areas
controllersAreas.renderAreasForm = async (req, res) => {
    const documents = await modelsAreas.find();
    var i = 1;
    let collections = [];
    documents.forEach( async (documents) => {
        var numeroIntegrantes = await modelsUsers.count({areaUser: documents.tituloArea});
        collections.push({
            i: i++,
            id: documents._id,
            titulo: documents.tituloArea,
            descripcion: documents.descripcionArea,
            integrantes: numeroIntegrantes,
            estado: documents.estadoArea
        })
    })
    res.render('areas/areaList', {area : collections});
};

//Registrar area
controllersAreas.createAreasNew = async (req, res) => {
    const {tituloArea, descripcionArea} = req.body;
    const errors = [];
    if(!tituloArea){
        errors.push({text: 'Porfavor ingrese un título.'});
    }
    if(!descripcionArea){
        errors.push({text: 'Porfavor ingrese una descripcion.'});
    }
    if(errors.length > 0){
        res.render('areas/areaList', {
            errors,
            tituloArea,
            descripcionArea
        });
    }else{
        const newArea = new modelsAreas({tituloArea, descripcionArea});
        await newArea.save();   //metodo para guardar el document en el DB
        req.flash('success_msj', 'Area agregada con exito');
        res.redirect('/areas/list');
    }
};

//cargar los datos para editar el area seleccionado
controllersAreas.renderAreasEdit = async (req, res) => {
    const documents = await modelsAreas.findById(req.params.id);
    res.render('areas/areaEdit', {
        id: documents._id,
        tituloArea: documents.tituloArea,
        descripcionArea: documents.descripcionArea
    });
};

//editar area
controllersAreas.updateAreas = async (req, res) => {
    const {idArea, tituloArea, descripcionArea} = req.body;
    const errors = [];
    if(!tituloArea){
        errors.push({text: 'Porfavor ingrese un título.'});
    }
    if(!descripcionArea){
        errors.push({text: 'Porfavor ingrese una descripcion.'});
    }
    if(errors.length > 0){
        res.render('areas/areaEdit', {
            errors,
            id: idArea,
            tituloArea,
            descripcionArea
        });
    }else{
        await modelsAreas.findByIdAndUpdate(req.params.id, {tituloArea, descripcionArea});
        req.flash('success_msj', 'Area actualizada con exito');
        res.redirect('/areas/list');
    }
};

//Eliminar area
controllersAreas.deleteAreas = async (req, res) => {
    await modelsAreas.findByIdAndDelete(req.params.id);
    req.flash('success_msj', 'Área eliminado con exito');
    res.redirect('/areas/list');
};

//Estado del area
controllersAreas.statusAreas = async (req, res) => {
    const documents = await modelsAreas.findById(req.params.id);
    documents.estadoArea = !documents.estadoArea;
    await documents.save();
    res.redirect('/areas/list');
};

module.exports = controllersAreas;