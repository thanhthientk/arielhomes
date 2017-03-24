"use strict";
const express = require('express');
const ROUTER = express.Router();
const csrf = require('csurf');

let modules = ['index', 'posts'];

for (let module of modules) {
    let controllers = require(`./${module}/controllers`);
    let routes = require(`./${module}/routes`);
    for (let route of routes) {
        let middlewares = [];

        let {path, controller, method} = route;

        if (typeof controllers[controller] != 'function')
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

        ROUTER[method](path, middlewares, controllers[controller]);
    }
}

module.exports = ROUTER;