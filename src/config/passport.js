const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const modelsUsers = require('../models/modelsUsers');

passport.use(new LocalStrategy({
    usernameField: 'emailUser',
    passwordField: 'passwordUser'
}, async (emailUser, passwordUser, done) => {  /* (,,colback (terminar)) */
    /* Confirmar el email */
    const user = await modelsUsers.findOne({ emailUser }); /* buscar solo una dato igual a 'emailUser' */

    if(!user){
        return done(null, false, {message: 'No existe el usuario'});  /*  (error, usuario, opciones) */
    }else{
        //validar la contraseña
        const password = await user.compararPassword(passwordUser);
        if(password){
            return done(null, user);
        }else{
            return done(null, false, {message: 'La contraseña es incorrecta'});
        }
    }
}));

//cuando el user esta guardado est5a registrado lo guardara en la sesion de nuestro servido
passport.serializeUser((user, done) => {        //( un usuario, un done / colback)
    done(null, user.id);    // (error, usuario)
});

//cuando el user comienze a navegar passport hara una consulta a la DB para ver el id esta autorizado
passport.deserializeUser((id, done) => {    //(el ID que guardamos en el SERIALIZEUSER, colback)
    modelsUsers.findById(id, (err, user) => {
        done(err, user);
    });
});