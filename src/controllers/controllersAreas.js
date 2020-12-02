const controllersAreas = {};
const { stat } = require('fs-extra');
const modelsAreas = require('../models/modelsAreas');
const modelsUsers = require('../models/modelsUsers');

//Mostrar interfaz del modulo Area
controllersAreas.renderAreasForm = async (req, res) => {
    res.render('areas/areaList');
};

/*=============== AJAX ===============*/
//(MOSTAR DETALLES) mostrar la cantidad de areas habilitadas
controllersAreas.areasHabilitadas = async (req, res) => {
    const habilitados = await modelsAreas.count({estadoArea: true});
    res.json(habilitados);
}

//(LISTAR) listar las areas - AJAX
controllersAreas.listAreas = async (req, res) => {
    let i = 1;
    let datos = [];
    let estado = "";

    const documentsArea = await modelsAreas.find();
    documentsArea.forEach(documents => {
        if(documents.estadoArea){
            estado = "<button class='btn btn-success btn-sm btn-statusArea' idArea='"+ documents._id +"'>Activado</button>";
        }else{
            estado = "<button class='btn btn-warning btn-sm btn-statusArea' idArea='"+ documents._id +"'>Desactivado</button>"
        }
        let botones = "<div class='btn-group btn-group-sm'>" +
        "<button class='btn btn-danger btn-sm btn-deleteArea' idArea='" + documents._id + "'><i class='fas fa-trash-alt'></i></button>" +
        "<button class='btn btn-primary btn-sm btn-loadArea' idArea='" + documents._id + "' data-toggle='modal' data-target='#editArea'><i class='fas fa-edit'></i></button>" +
        "</div>";
        datos.push({
            i: i++,
            titulo: documents.tituloArea,
            descripcion: documents.descripcionArea,
            estado: estado,
            botones: botones
        })
    })
    res.json(datos);
}

//(NEW) guardar un nuevo area - AJAX
controllersAreas.createAreas = async (req, res) => {
    const {tituloArea, descripcionArea} = req.body;
    const newArea = new modelsAreas({
        tituloArea,
        descripcionArea
    });
    await newArea.save();
    res.json(newArea);
}

//(DELETE) Eliminar un registro - AJAX
controllersAreas.deleteAreas = async (req, res) => {
    await modelsAreas.findByIdAndDelete(req.params.id);
    res.json('Se elimino correctamente el registro');
};

//(LOAD) cargar los datos de un area - AJAX
controllersAreas.loadAreas = async (req, res) => {
    const documentsArea = await modelsAreas.findById(req.params.id);
    res.json(documentsArea);
}

//(UPDATE) actualizar un area - AJAX
controllersAreas.updateAreas = async (req, res) => {
    const {idArea, tituloArea, descripcionArea} = req.body;
    const updateArea = await modelsAreas.findByIdAndUpdate(idArea, {
        tituloArea,
        descripcionArea
    });
    res.json(updateArea);
}

//(STATUS) Estado del area - AJAX
controllersAreas.statusAreas = async (req, res) => {
    const documents = await modelsAreas.findById(req.params.id);
    documents.estadoArea = !documents.estadoArea;
    await documents.save();
    res.json(documents);
};

module.exports = controllersAreas;