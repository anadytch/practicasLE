const { Router } = require('express');
const router = Router();
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/img/users'));
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));  //(error, nombre)
    },
    limits: {
        fileSize: 1000000
    },
});

let upload = multer({
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|png|jpg/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }
        cb('error: Archivo debe ser una imagen valida');
    },
    storage
}).single('fotoUser');

const {
    renderSignInForm,
    renderSignUpForm,
    signIn,
    signUp,
    logout,
    renderUsersList,
    renderUsersPersonal,
    updateUser,
    statusUsers,
    listUsers,
    loadUsers,
    deleteUsers,
    listUserListInforme
} = require('../controllers/controllersUsers');

// para validar la sesion 
const { isAuthenticated } = require('../helpers/validation');

//formulario para registrar usuario
router.get('/users/signUp', renderSignUpForm);
router.post('/users/signUp', upload, signUp );

//formulario para logear usuario
router.get('/users/signIn', renderSignInForm);
router.post('/users/signIn', signIn);

//loguear usuario
router.get('/users/logout', logout);

//listar lista de informes
router.get('/users/list', isAuthenticated, renderUsersList);

//listar informes de un personal
router.get('/users/listPersonal/:id', isAuthenticated, renderUsersPersonal);

//editar usuario
router.put('/users/edit/:id', isAuthenticated, upload, updateUser);

//cambiar estado del usuario
router.get('/users/status/:id', isAuthenticated, statusUsers);

/*=============== AJAX ===============*/
//(LIST) listar user - AJAX
router.get('/users/listar', isAuthenticated, listUsers);

//(DELETE) eliminar usuario - AJAX
router.delete('/users/delete/:id', isAuthenticated, deleteUsers);

//(LOAD) cargar los datos de un usuario - AJAX
router.get('/users/load/:id', isAuthenticated, loadUsers);

//(LISTAR INFORMES PERSONAL)  listar los informes de un personal - AJAX
router.get('/users/usersListInforme', isAuthenticated, listUserListInforme);

module.exports = router;