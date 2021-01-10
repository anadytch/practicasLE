const {Router} = require('express');
const router = Router();
const {
    renderAreasForm,
    listAreas,
    createAreas,
    deleteAreas,
    loadAreas,
    updateAreas,
    areasHabilitadas
} = require('../controllers/controllersAreas');

// para validar la sesion 
const { isAuthenticated } = require('../helpers/validation');

//Mostrar el modulo Area
router.get('/areas/list', isAuthenticated, renderAreasForm);

/*=============== AJAX ===============*/
//(LIST) listar areas - AJAX
router.get('/areas/listar', isAuthenticated, listAreas);

//(NEW) guardar una nueva area - AJAX
router.post('/areas/add', isAuthenticated, createAreas);

//(DELETE) borrar areas - AJAX
router.delete('/areas/delete/:id', isAuthenticated, deleteAreas);

//(LOAD) cargar los datos de un area - AJAX
router.get('/areas/load/:id', isAuthenticated, loadAreas);

//(UPDATE) editar area
router.put('/areas/edit/:id', isAuthenticated, updateAreas);

//(AREAS HABILITADAS) mostrar la cantidad total de areas habilitadas
router.get('/areas/areasHabilitadas', isAuthenticated, areasHabilitadas);

module.exports = router;