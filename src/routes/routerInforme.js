const {Router} = require('express');
const router = Router();
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const modelsInforme = require('../models/modelsInforme');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/files'));
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
});

let upload = multer({
    storage
}).single('informeUser');

// para validar la sesion 
const { isAuthenticated } = require('../helpers/validation');

const {
    renderInformeList,
    renderInformeListPersonal,
    createInforme,
    listarInforme
} = require('../controllers/controllersInforme');

//listar los informes de cada personal
router.get('/informe/listPersonal', isAuthenticated, renderInformeListPersonal);

//listar todo los informes
router.get('/informe/list', isAuthenticated, renderInformeList);

//registrar un nuevo informe
router.post('/informe/add', isAuthenticated, upload, createInforme);

//Cargar los datos para editar
router.get('informe/edit');

//Editar  informe
router.put('/informe/edit');

//eliminar informe
router.delete('/informe/delete');

//para pruebas de json y ajax
router.get('/listar', listarInforme);


module.exports = router;