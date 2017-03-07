"use strict";
const express = require('express');
const ROUTER = express.Router();

const authenticateMiddleware = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.redirect('/authenticate/login');
    }
};

const checkPermission = function(permission = '') {
    return function (req, res, next) {
        if (req.user.role && req.user.role.permissions.indexOf('supperadmin') > -1)
            return next();

        if (req.user.role && req.user.role.permissions.indexOf(permission) >= 0) {
            next();
        } else {
            res.render('dashboard/view/error/limit-permission', { pageTitle: 'Bạn không thể truy cập trang này!'});
        }
    }
};

const modules = ALL_FEATURES;

for (let module of modules) {
    let controllers = require(`./${module}/controller/index.controller`);
    let routes = require(`./${module}/routes`);

    for (let route of routes) {
        let middlewares = [];

        let {path, action, method, permission, authenticate} = route;

        if (typeof controllers[action] != 'function')
            throw new Error(`Not Found Controller Action: ${action} - Feature: ${module}`);

        if (authenticate)
            middlewares.push(authenticateMiddleware);

        if (permission)
            middlewares.push(checkPermission(permission.slug));

        if (route.middlewares && route.middlewares.length > 0) {
            for (let i = 0; i < route.middlewares.length; i++) {
                middlewares.push(route.middlewares[i]);
            }
        }

        ROUTER[method](path, middlewares, controllers[action]);
    }
}

module.exports = ROUTER;