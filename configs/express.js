'use strict';

const path = require('path');
const env = require('dotenv');

const express = require('express');
const app = express();
const nunjucks = require('./nunjucks/nunjucks');
const database = require('./database');
const csrf = require('csurf');

module.exports = {
	start: function() {
		//Load Environment
		env.load({ path: path.join(__dirname, './env/.env.dev') });

		//Connect Database
		database.init();

		//Require Global
		require('./globals').init();

		//Setup view
		let engine = nunjucks.init(app);
		nunjucks.addGlobal(engine, 'author', process.env.AUTHOR);

		//Session
		require('./session')(app);

		//Passport
        require('./passport')(app);

		//Middleware
		require('./middlewares')(app);
		app.use(csrf());
        /** Public variables for views */
        app.use((req, res, next) => {
            res.locals._csrf = req.csrfToken();
            res.locals.originalUrl = req.originalUrl;
            res.locals.reqQuery = req.query;
            if (req.user)
                res.locals.logged_user = req.user;
            next();
        });

        /**
         * Routes
         */
        app.use('/', require(path.join(__root, 'admin/routes')));

		//Errors Handler
		require('./errors-handler')(app);

        /** Create Server Listen */
        const port = (process.env.PORT) ? Number(process.env.PORT) : 5000;
        app.listen(port, () => {
            console.log('Server is running at port: ', port);
        });
	}
};