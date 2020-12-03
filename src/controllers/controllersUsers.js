const controllersUsers = {};
const passport = require('passport');
const { format } = require('timeago.js');   //sin usar
const path = require('path');
const {unlink} = require('fs-extra');


const modelsUsers = require('../models/modelsUsers');
const modelsAreas = require('../models/modelsAreas');


//formulario para registrar usuario
controllersUsers.renderSignUpForm = async (req, res) => {
    const documentsArea = await modelsAreas.find({estadoArea: true});
    res.render('users/userSignUp', {area : documentsArea});
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
    const documentsUser = await modelsUsers.findById(req.params.id);
    const documentsArea = await modelsAreas.find({estadoArea: true});
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
        perfilBoolean: documentsUser.perfilUser,
        nombreUser: documentsUser.nombreUser,
        emailUser: documentsUser.emailUser,
        areaUser: documentsUser.areaUser,
        areaList: documentsArea,
        rutaImgUser: documentsUser.rutaImgUser
    });
};

//Editar usuario
controllersUsers.updateUser = async (req, res) => {
    const errors = [];
    var perfilNombre = '';
    var nuevoPassword = '';
    const documentsArea = await modelsAreas.find({estadoArea: true});
    const {
        idUser,
        dniUser,
        perfilUser,
        nombreUser,
        emailUser,
        passwordUser,
        passwordUserConfirm,
        areaUser
    } = req.body;
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
    if(perfilUser){
        perfilNombre = 'Administrador';
    }else{
        perfilNombre = 'Usuario';
    }
    if(!dniUser){
        errors.push({text: 'Porfavor ingrese un DNI.'});
    }
    if(!nombreUser){
        errors.push({text: 'Porfavor ingrese un Nombre y apellido.'});
    }
    if(!emailUser){
        errors.push({text: 'Porfavor ingrese un Usuario.'});
    }
    if(passwordUser.length > 0){
        if ( passwordUser != passwordUserConfirm) {
            errors.push({ text: 'El paswwords no coinciden.' });
        }
        if (passwordUser.length < 4) {
            errors.push({text: 'El password debe tener mas de 4 caracteres'});
        }
    }
    if(errors.length > 0){
        res.render('users/userListPersonal', {
            errors,
            idUser,
            dniUser,
            perfilNombre,
            perfilBoolean: perfilUser,
            nombreUser,
            emailUser,
            areaUser,
            areaList: documentsArea 
        });
    }else{
        if(passwordUser.length > 0 ){
            nuevoPassword = await editUser.encriptarPassword(passwordUser);
        }
        else{
            nuevoPassword = editUser.passwordUser;
        }
        await modelsUsers.findByIdAndUpdate(idUser, {
            dniUser,
            perfilUser,
            nombreUser,
            emailUser,
            passwordUser: nuevoPassword,
            areaUser,
            imageUser,
            rutaImgUser
        });
        req.flash('success_msj', 'Usuario actualizada con exito');
        res.redirect('/users/list/');
    }
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
            estadoUsuario = '<span class="badge badge-pill badge-success">Activado</span>';
        }else{
            estadoUsuario = '<span class="badge badge-pill badge-warning">Desactivado</span>';
        }
        botones = "<div class='btn-group btn-group-sm'>" +
        "<a href='/users/listPersonal/"+ documents._id +"' class='btn btn-info btn-sm'><i class='fas fa-info'></i></a>" +
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

//(DELETE) eliminar el registro
controllersUsers.deleteUsers = async (req, res) => {
    const deleteUser = await modelsUsers.findByIdAndDelete(req.params.id);
    if(deleteUser.imageUser){
        unlink(path.resolve('./src/public' + deleteUser.rutaImgUser));
    }
    res.json('Se elimino correctamente al usuario');
}

controllersUsers.loadUsers = async (req, res) => {
    const documentsUser = await modelsUsers.findById(req.params.id);
    res.json(documentsUser);
}

module.exports = controllersUsers;