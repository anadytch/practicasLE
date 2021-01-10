const {Router} = require('express');
const router = Router();
const {
    renderConfigForm,
    enviarCorreo
} = require('../controllers/controllersConfig');

// para validar la sesion 
const { isAuthenticated } = require('../helpers/validation');

//Mostrar el modulo Config
router.get('/config', isAuthenticated, renderConfigForm);

//Enviar un correo
router.get('/config/enviar', isAuthenticated, enviarCorreo);

module.exports = router;