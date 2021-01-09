const controllersNotes = {};
const { models } = require('mongoose');
const modelsNotes = require('../models/modelsNotes');

controllersNotes.renderNotesList = async (req , res) => {
   res.render('notes/noteList');
};

controllersNotes.renderNotesEdit = async (req, res) => {
    const documents = await modelsNotes.findById(req.params.id);
    if(documents.user != req.user.id ){
        req.flash('error_msj', 'No autorizado');
        return res.redirect('/notes/list');
    }
    res.render('notes/noteEdit');
}

/*=============== AJAX ===============*/
//(LIST) listar notas personales - AJAX
controllersNotes.listNotes = async (req, res) => {
    const documentsNote = await modelsNotes.find({ user: req.user.id });
    res.json(documentsNote);
}

// (NEW) guardar una nueva notA - AJAX
controllersNotes.createNotes = async (req, res) => {
    const {tituloNote, descripcionNote} = req.body;
    const newNotes = new modelsNotes({
        tituloNote,
        descripcionNote,
        user: req.user.id
    });
    await newNotes.save();
    res.json(newNotes);
}

// (DELETE) eliminar una nota - AJAX
controllersNotes.deleteNotes = async (req, res) => {
    await modelsNotes.findByIdAndDelete(req.params.id);
    res.json('La nota se elimino correctamente');
}

// (LOAD) cargar los datos de una nota - AJAX
controllersNotes.loadNotes = async (req, res) => {
    const documentsNote = await modelsNotes.findById(req.params.id);
    res.json(documentsNote);
}

// (UPDATE) actualizar una nota - AJAX
controllersNotes.updateNotes = async (req, res) => {
    const {idNote, tituloNote, descripcionNote} = req.body;
    const updateNote = await modelsNotes.findByIdAndUpdate(idNote, {
        tituloNote,
        descripcionNote
    });
    res.json(updateNote);
}

module.exports = controllersNotes;