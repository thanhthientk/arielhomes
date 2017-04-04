"use strict";
const express = require('express');
const ROUTER = express.Router();
const csrf = require('csurf');
const co = require('co');

let modules = ['index', 'posts'];

ROUTER.use(function (req, res, next) {
    res.theme = function (path, params) {
        return res.render(`${THEME}/${path}`, params)
    };

    let pattern = new RegExp(`^\/(en|vn)(\/|(?!.))`, 'i');
    if (pattern.test(req.url)) {
        let arr = pattern.exec(req.url);
        global.LANG = arr[1];
        res.locals.LANG = LANG;
        req.session.language = LANG;
    }

    next();
});

for (let module of modules) {
    let controllers = require(`./${module}/controllers`);
    let routes = require(`./${module}/routes`);
    for (let route of routes) {
        let middlewares = [];

        let {path, controller, method} = route;

        if (typeof controllers[controller] !== 'function')
            throw new Error(`Not Found Controller: ${controller} - Module: ${module}`);

        if (route.middlewares && route.middlewares.length > 0) {
            for (let i = 0; i < route.middlewares.length; i++) {
                middlewares.push(route.middlewares[i]);
            }
        }

        if (route.csrf !== false) {
            middlewares.push(csrf());
            middlewares.push(function (req, res, next) {
                res.locals._csrf = req.csrfToken();
                next();
            })
        }

        //Get Options, Recent Posts at Footer
        middlewares.push(function (req, res, next) {
            Promise.all([
                _app.model.setting.findById('58df4d0b2e26d9206c620ec4').select('data'),
                _app.model.post
                    .find({postType: 'post', status: 'show', language: LANG})
                    .populate('image')
                    .limit(2)
                    .select('name image description slug'),
                _app.model.post
                    .find({postType: 'tour', status: 'show', language: LANG})
                    .populate('gallery')
                    .limit(3)
                    .select('name gallery fields slug')
            ])
                .then(results => {
                    res.locals.Options = results[0].data;
                    res.locals.footerRecentPost = results[1];
                    res.locals.fixedTours = results[2];
                    next();
                })
                .catch(err => next(err));
        });

        let langPath = `/:language(en|vn)${path}`;

        ROUTER[method](langPath, middlewares, controllers[controller]);
    }
}

ROUTER.get('/', function (req, res, next) {
    let language = (req.session.language) ? req.session.language : 'en';
    res.redirect(`/${language}`);
});

module.exports = ROUTER;