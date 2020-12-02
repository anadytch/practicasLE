const {Router} = require('express');
const router = Router();
const {
    renderAreasForm,
    statusAreas,
    listAreas,
    createAreas,
    deleteAreas,
    loadAreas,
    updateAreas
} = require('../controllers/controllersAreas');

// para validar la sesion 
const { isAuthenticated } = require('../helpers/validation');

//Mostrar el modulo Area
router.get('/areas/list', isAuthenticated, renderAreasForm);

/*=============== AJAX ===============*/
//(LIST) listar areas - AJAX
router.get('/areas/listar', listAreas);

//(NEW) guardar una nueva area - AJAX
router.post('/areas/add', createAreas);

//(DELETE) borrar areas - AJAX
router.delete('/areas/delete/:id', deleteAreas);

//(LOAD) cargar los datos de un area - AJAX
router.get('/areas/load/:id', loadAreas);

//(UPDATE) editar area
router.put('/areas/edit/:id', isAuthenticated, updateAreas);

//(STATUS) estado areas
router.post('/areas/status/:id', isAuthenticated, statusAreas);

module.exports = router;