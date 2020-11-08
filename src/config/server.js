const express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const multer = require('multer');
const uuid = require('uuid/v4');    //es la manera de generar un id aleatorio

//initiliazations
const app = express();
require('./database');
require('./passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.engine('.hbs', exphbs({     /* motor de plantilla */
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//procesar imagenes
/*
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
*/

//middlewares
app.use(morgan('dev'));
/*
app.use(multer({
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
}).single('fotoUser')); //({name: name1}, {name: name2})

*/
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));  //permite enviar otros method
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables Globales
app.use( (req, res, next) => {
    res.locals.success_msj = req.flash('success_msj');
    res.locals.error_msj = req.flash('error_msj');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//routes
app.use(require('../routes/routerIndex'));
app.use(require('../routes/routerUsers'));
app.use(require('../routes/routerNotes'));
app.use(require('../routes/routerAreas'));
app.use(require('../routes/routerInforme'));

//statis files
app.use(express.static(path.join(__dirname, '../public')));

module.exports = app;