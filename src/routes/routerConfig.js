const {Router} = require('express');
const router = Router();
const {
    renderConfigForm
} = require('../controllers/controllersConfig');

// para validar la sesion 
const { isAuthenticated } = require('../helpers/validation');

//Mostrar el modulo Config
router.get('/config', isAuthenticated, renderConfigForm);

module.exports = router;