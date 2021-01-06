const controllersUsers = {};
const passport = require('passport');
const { format } = require('timeago.js');   //sin usar
const path = require('path');
const {unlink} = require('fs-extra');


const modelsUsers = require('../models/modelsUsers');
const modelsAreas = require('../models/modelsAreas');
const modelsInforme = require('../models/modelsInforme');

var idUserListInforme = '';


//formulario para registrar usuario
controllersUsers.renderSignUpForm = async (req, res) => {
    const documentsArea = await modelsAreas.find({estadoArea: true});
    res.render('users/userSignUp', {areaList : documentsArea});
};

//registrar usuario
controllersUsers.signUp = async (req, res) => {
    const errors = [];
    const { 
        dniUser,
        nombreUser,
        emailUser,
        passwordUser,
        passwordUserConfirm,
        areaUser,
        perfilUser
    } = req.body;
    if(req.file) {
        imageUser = true;
        rutaImgUser = '/img/users/'+req.file.filename;
    }else{
        imageUser = false;
        rutaImgUser = '/img/user-default.png';
    }
    if ( passwordUser != passwordUserConfirm) {
        errors.push({ text: 'El paswwords no coinciden.' });
    }
    if (passwordUser.length < 4) {
        errors.push({text: 'El password debe tener mas de 4 caracteres'});
    }
    if (errors.length > 0) {
        res.render('users/userSignUp', {
            errors,
            dniUser,
            nombreUser,
            emailUser,
            areaUser,
            perfilUser
        });
    }else{
        const email = await modelsUsers.findOne({emailUser: emailUser});
        if (email) {
            req.flash('error_msj', 'El usuario ya existe');
            res.redirect('/users/signUp');
        }else{
            const newUser = new modelsUsers({
                dniUser,
                nombreUser,
                emailUser,
                passwordUser,
                areaUser,
                perfilUser,
                imageUser,
                rutaImgUser
            });
            newUser.passwordUser = await newUser.encriptarPassword(passwordUser);
            await newUser.save();
            req.flash('success_msj', 'Usuario registrado correctamente.');
            if(req.user){
                res.redirect('/users/list');
            }else{
                res.redirect('/users/signIn');
            }
        }
    }
};

//formulario para loguear
controllersUsers.renderSignInForm = (req, res) => {
    res.render('users/userSignIn');
};

//Ingresar a la aplicación
controllersUsers.signIn = passport.authenticate('local', {
    failureRedirect: '/users/signIn',
    successRedirect: '/notes/list',
    failureFlash: true
});

//para cerrar la sesion
controllersUsers.logout = (req, res) => {
    req.logout();       //eliminar la sesion
    req.flash('success_msj',' Sesion cerrado correctamente ');
    res.redirect('/users/signin');
}

//listar los informes de todo el personal
controllersUsers.renderUsersList = async (req, res) => {
    const documentsArea = await modelsAreas.find({estadoArea: true});
    res.render('users/userList', {areaList: documentsArea});
};

//listar informes personales, cargar datos para editar y listar informes del usuario
controllersUsers.renderUsersPersonal = async (req, res) => {
    idUserListInforme = req.params.id;
    var num = new Date();
    var numInforme = num.toISOString().substring(8,10) + num.toISOString().substring(5,7) + num.toISOString().substring(0,4);

    //los datos del usuario
    const documentsUser = await modelsUsers.findById(idUserListInforme);
    //numero de informes presentados por el usuario
    const numInformes = await modelsInforme.find({userInforme : idUserListInforme}).count();
    //comprobar si presentado o no presentado su informe del dia.
    const informePresentado = await modelsInforme.findOne({numInforme: numInforme, userInforme: idUserListInforme});
    var perfilNombre = '';
    if(documentsUser.perfilUser){
        perfilNombre = 'Administrador';
    }else{
        perfilNombre = 'Usuario';
    }
    res.render('users/userListPersonal', {
        idUser: req.params.id,
        dniUser: documentsUser.dniUser,
        perfilNombre,
        nombreUser: documentsUser.nombreUser,
        emailUser: documentsUser.emailUser,
        areaUser: documentsUser.areaUser,
        rutaImgUser: documentsUser.rutaImgUser,
        informePresentado,
        estadoUsuario: documentsUser.estadoUser,
        numInformes
    });
    
};

//Editar usuario
controllersUsers.updateUser = async (req, res) => {
    const errors = [];
    var perfilBoolean = false;
    var nuevoPassword = '';

    const documentsArea = await modelsAreas.find({estadoArea: true});
    const {
        idUser,
        editDniUser,
        editPerfilUser,
        editNombreUser,
        editEmailUser,
        editPasswordUser,
        //editPasswordUserConfirm,
        editAreaUser
    } = req.body;

    //verificar si contiene una imagen (SI, se elimina la imagen - NO, se conserva la imagen dafault )
    const editUser = await modelsUsers.findOne({_id: idUser});
    if(req.file){
        rutaImgUser =  '/img/users/' + req.file.filename;
        if(imageUser){
            unlink(path.resolve('./src/public' + editUser.rutaImgUser));
        }
        imageUser = true;
    }else{
        imageUser = false;
        rutaImgUser = editUser.rutaImgUser;
    }

    //convertir 
    if(editPerfilUser == '1'){
        perfilBoolean = true;
    }else{
        perfilBoolean = false;
    }

    /*
    if(!editDniUser){
        errors.push({text: 'Porfavor ingrese un DNI.'});
    }
    if(!editNombreUser){
        errors.push({text: 'Porfavor ingrese un Nombre y apellido.'});
    }
    if(!editEmailUser){
        errors.push({text: 'Porfavor ingrese un Usuario.'});
    }
    if(editPasswordUser.length > 0){
        if ( editPasswordUser != editPasswordUserConfirm) {
            errors.push({ text: 'El paswwords no coinciden.' });
        }
        if (editPasswordUser.length < 4) {
            errors.push({text: 'El password debe tener mas de 4 caracteres'});
        }
    }*/

    if(editPasswordUser.length > 0 ){
        nuevoPassword = await editUser.encriptarPassword(editPasswordUser);
    }
    else{
        nuevoPassword = editUser.passwordUser;
    }

    await modelsUsers.findByIdAndUpdate(idUser, {
        dniUser: editDniUser,
        perfilUser: perfilBoolean,
        nombreUser: editNombreUser,
        emailUser: editEmailUser,
        passwordUser: nuevoPassword,
        areaUser: editAreaUser,
        imageUser,
        rutaImgUser
    });
    req.flash('success_msj', 'Usuario actualizada con exito');
    res.redirect('/users/list/');
};

//para editar el estado de los usuarios
controllersUsers.statusUsers = async (req, res) => {
    const documents = await modelsUsers.findById(req.params.id);
    documents.estadoUser = !documents.estadoUser;
    await documents.save();
    res.redirect('/users/list');
};

/*=============== AJAX ===============*/
//(LIST) listar a todos los users - AJAX
controllersUsers.listUsers = async (req, res) => {
    let i = 1;
    let datos = [];
    var perfilUsuario = '';
    var estadoUsuario = '';

    const documentsUsers = await modelsUsers.find();
    documentsUsers.forEach( documents => {
        if (documents.perfilUser) {
            perfilUsuario = 'Administrador';
        }else{
            perfilUsuario = 'Usuario';
        }
        if(documents.estadoUser) {
            estadoUsuario = '<span class="badge badge-pill badge-success">Habilitado</span>';
        }else{
            estadoUsuario = '<span class="badge badge-pill badge-warning">Deshabilitado</span>';
        }
        botones = "<div class='btn-group btn-group-sm'>" +
        "<a href='/users/listPersonal/"+ documents._id +"' class='btn btn-info btn-sm btn-infoUserListInforme' idUser='" + documents._id + "'><i class='fas fa-info'></i></a>" +
        "<button class='btn btn-danger btn-sm btn-deleteUser' idUser='" + documents._id + "'><i class='fas fa-trash-alt'></i></button>" +
        "<button class='btn btn-primary btn-sm btn-loadUser' idUser='" + documents._id + "' data-toggle='modal' data-target='#editUsers'><i class='fas fa-edit'></i></button>" +
        "</div>";

        datos.push({
            i: i++,
            dni: documents.dniUser,
            nombre: documents.nombreUser,
            area: documents.areaUser,
            perfil: perfilUsuario,
            estado: estadoUsuario,
            fecha: documents.updatedAt.toISOString().substring(0,10) + ' ' + documents.updatedAt.toISOString().substring(12,19),
            botones: botones
        })
    })
    res.json(datos);
}

//(DELETE) eliminar el registro - AJAX
controllersUsers.deleteUsers = async (req, res) => {
    const deleteUser = await modelsUsers.findByIdAndDelete(req.params.id);
    if(deleteUser.imageUser){
        unlink(path.resolve('./src/public' + deleteUser.rutaImgUser));
    }
    res.json('Se elimino correctamente al usuario');
}

//(LOAD) cargar los datos de un usuario - AJAX
controllersUsers.loadUsers = async (req, res) => {
    var datos = [];
    var perfil = '';
    const documents = await modelsUsers.findById(req.params.id);
    if(documents.perfilUser){
        perfil = '1';
    }else{
        perfil = '0';
    }
    datos.push({
        _id: documents._id,
        rutaImgUser: documents.rutaImgUser,
        dniUser: documents.dniUser,
        nombreUser: documents.nombreUser,
        emailUser: documents.emailUser,
        perfilBooleano: perfil,
        areaUser: documents.areaUser
    })
    res.json(datos);
}

//(LISTA PERSONAL) listar los informes de un solo personal en especifico - AJAX
controllersUsers.listUserListInforme = async (req, res) => {
    let i = 0;
    let datos = [];

    const documentsInforme = await modelsInforme.find({userInforme: idUserListInforme});
    documentsInforme.forEach( documents => {
        i++;
        botones = "<div>" +
        "<button class='btn btn-primary btn-sm btn-viewInforme' idInforme='" + documents._id + "'><i class='far fa-eye'></i></button>" +
        "</div>";
        datos.push({
            i: i,
            numero: documents.numInforme,
            titulo: documents.tituloInforme,
            descripcion: documents.descripcionInforme,
            fecha: documents.createdAt,
            botones: botones
        })
    })
    res.json(datos);
}

module.exports = controllersUsers;