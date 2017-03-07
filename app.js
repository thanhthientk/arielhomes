'use strict';
const path = require('path');
//Load ENV
const dotenv = require('dotenv');
dotenv.load({ path: '.env.pro' });

/** Dependencies */
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const session = require('express-session');
const validator = require('express-validator');
const passport = require('passport');
const flash = require('express-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
// const helmet = require('helmet');
const csrf = require('csurf');

/** Global Variable & Function */
require('./libs/global-variables');
require('./libs/global-functions');

/** Create App */
const app = express();


/** Connect to MongoDb */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('error', () => {
    throw new Error('Mongodb Connection Error!');
});

/** Middleware */
// app.use(helmet());
app.set('views', path.join(__dirname, 'features'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: '454sdf46s54df5sd4we46ew544f6s4d6f',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: { maxAge: 1000*60*60*24 }
}));
app.use(flash());
// static files
if (process.env.ENV == 'development')
    app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// Route without CSRF
const hddt = require('./features/hddt/routes');
app.use('/hddt', hddt);
// CSRF
app.use(csrf());

/** Config passport */
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

/** Bring req.user into view */
app.use((req, res, next) => {
    res.locals._csrf = req.csrfToken();
    if (req.user)
        global.logged_user = req.user;
    next();
});

/** Routes */
app.get('/', (req, res, next) => {
    res.redirect('/dashboard');
});
const Routes = require('./features/routes');
app.use('/', Routes);

/** Error Handler */
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (process.env.ENV == 'development') {
    app.use(errorHandler());
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    console.log(err);
    res.render('dashboard/view/error/error', {
        message: err.message,
        error: {}
    });
});

/** Create Server Listen */
const port = (process.env.PORT) ? Number(process.env.PORT) : 5000;
app.listen(port, () => {
    console.log('Server is running at port: ', port);
});