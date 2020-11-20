const {Router} = require('express');
const router = Router();
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');

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
    deleteInforme,
    listarInformePersonal,
    cargarDatos
} = require('../controllers/controllersInforme');

//listar los informes de cada personal
router.get('/informe/listPersonal', isAuthenticated, renderInformeListPersonal);

//listar todo los informes
router.get('/informe/list', isAuthenticated, renderInformeList);

//registrar un nuevo informe
router.post('/informe/add', isAuthenticated, upload, createInforme);

//Cargar los datos para editar
router.get('/informe/edit:id', cargarDatos);

//Editar  informe
router.put('/informe/edit');

/*=============== AJAX ===============*/

//eliminar informe personales (AJAX)
router.delete('/informe/delete:id', deleteInforme);

//listar informes personales (AJAX)
router.get('/informe/listar', listarInformePersonal);

//nuevo informe (AJAX)
//router.post('/informe/nuevo', nuevoInforme);


module.exports = router;