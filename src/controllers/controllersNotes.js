const controllersNotes = {};
const modelsNotes = require('../models/modelsNotes');

controllersNotes.renderNotesForm = (req, res) => {
    res.render('notes/noteNew');
};

controllersNotes.createNotesNew = async (req, res) => {
    const {tituloNote, descripcionNote} = req.body;
    const errors = [];
    if(!tituloNote){
        errors.push({text: 'Porfavor ingrese un título.'});
    }
    if(!descripcionNote){
        errors.push({text: 'Porfavor ingrese una descripción.'});
    }
    if(errors.length > 0){
        res.render('notes/noteNew', {
            errors,
            tituloNote,
            descripcionNote
        });
    }else{
        const newNote = new modelsNotes({tituloNote, descripcionNote});
        newNote.user = req.user.id;
        await newNote.save();   //metodo para guardar el document en el DB
        req.flash('success_msj', 'Nota agregada con exito');
        res.redirect('/notes/list');
    }
};

controllersNotes.renderNotesList = async (req , res) => {
   res.render('notes/noteList');
};

controllersNotes.renderNotesEdit = async (req, res) => {
    const documents = await modelsNotes.findById(req.params.id);
    if(documents.user != req.user.id ){
        req.flash('error_msj', 'No autorizado');
        return res.redirect('/notes/list');
    }
    let collections = [];
    collections.push({
        tituloNote: documents.tituloNote,
        descripcionNote: documents.descripcionNote
    });
    res.render('notes/noteEdit', {documents});
}

controllersNotes.updateNotes = async (req, res) => {
    const {tituloNote, descripcionNote} = req.body;
    await modelsNotes.findByIdAndUpdate(req.params.id, {tituloNote, descripcionNote});
    req.flash('success_msj', 'Nota actualizada con exito');
    res.redirect('/notes/list');
};

controllersNotes.deleteNotes = async (req, res) => {
    await modelsNotes.findByIdAndDelete(req.params.id);
    req.flash('success_msj', 'Nota eliminado con exito');
    res.redirect('/notes/list');
};

controllersNotes.listNotes = async (req, res) => {
    const documentsNote = await modelsNotes.find({ user: req.user.id });
    res.json(documentsNote);
}


module.exports = controllersNotes;