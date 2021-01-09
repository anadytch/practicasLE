const { Router } = require('express');
const router = Router();

// para validar la sesion 
const { isAuthenticated } = require('../helpers/validation');

const {
    renderNotesList,
    createNotes,
    updateNotes,
    deleteNotes,
    listNotes,
    loadNotes
} = require('../controllers/controllersNotes');

// (PAGINA) cargar la pagina de notas
router.get('/notes/list', isAuthenticated, renderNotesList );


/*=============== AJAX ===============*/
//(LIST) listar notas personales - AJAX
router.get('/notes/listNote', isAuthenticated, listNotes);

//(NEW) guardar una nueva notA - AJAX
router.post('/notes/add', isAuthenticated, createNotes);

//(DELETE) eliminar una nota - AJAX
router.delete('/notes/delete/:id', isAuthenticated, deleteNotes );

//(LOAD) cargar datos de una nota - AJAX
router.get('/notes/load/:id', isAuthenticated, loadNotes);

//(UPLOAD) editar o actualizar una nota - AJAX
router.put('/notes/edit/:id', isAuthenticated, updateNotes);

module.exports = router;