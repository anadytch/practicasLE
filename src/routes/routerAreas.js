const {Router} = require('express');
const router = Router();
const {
    renderAreasForm,
    createAreasNew,
    renderAreasEdit,
    updateAreas,
    deleteAreas,
    statusAreas
} = require('../controllers/controllersAreas');

// para validar la sesion 
const { isAuthenticated } = require('../helpers/validation');

//Listar areas
router.get('/areas/list', isAuthenticated, renderAreasForm);

//crear areas
router.post('/areas/add', isAuthenticated, createAreasNew);

//editar areas
router.get('/areas/edit/:id', isAuthenticated, renderAreasEdit);
router.put('/areas/edit/:id', isAuthenticated, updateAreas );

//borrar areas
router.delete('/areas/delete/:id', isAuthenticated, deleteAreas);

//estado areas
router.get('/areas/status/:id', isAuthenticated, statusAreas)

module.exports = router;