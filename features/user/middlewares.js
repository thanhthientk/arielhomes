"use strict";
const p = require('../permissions').user;

module.exports = {

    checkEditPermission: (req, res, next) => {
        if (req.user.role.permissions.indexOf(p.USER_UPDATE.slug) >= 0
            || req.user.id == req.params.userId) {
            next();
        } else {
            res.render('error/limit-permission');
        }
    }

};