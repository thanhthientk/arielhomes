"use strict";
const feature = require('../feature');
const Role = G_loadModel('role');
const User = G_loadModel('user');
const PERMISSIONS = require('../../permissions');

module.exports = {

    index: (req, res, next) => {
        let params = generatePaginateParams({
            queries: ['keyword', 'createdBy', 'time'],
            options: {
                populate: [
                    {path: 'createdBy', select: 'fullname'}
                ]
            }
        }, req.query);

        Promise.all([
            Role.paginate(params.queries, params.options),
            User.find({}).select('fullname')
        ]).then(results => {
            let usersForFilterBar = results[1];
            let roles = results[0];
            let paginated = generatePaginateLink(req, roles);
            res.render(feature.view.index, {
                pageTitle: feature.page_title.index,
                roles: roles.docs,
                paginated,
                reqQueryParams: req.query,
                usersForFilterBar
            });
        });
    },

    create: (req, res, next) => {
        res.render(feature.view.create, { pageTitle: feature.page_title.create, role: {}, PERMISSIONS });
    },

    store: (req, res, next) => {
        req.checkBody('name', 'Vui lòng nhập tên role').notEmpty();

        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.createdBy = req.user.id;
        let role = new Role(cleanObj(req.body));
        role.save()
            .then(() => {
                req.flash('successes', [{msg: 'Bạn đã thêm một role mới!'}]);
                res.redirect(`/${feature.slug}`);
            })
            .catch(err => {
                next(err);
            });
    },

    edit: (req, res, next) => {
        Role.findById(req.params[feature.documentId])
            .then(role => {
                res.render(feature.view.create, { pageTitle: feature.page_title.update, role, PERMISSIONS });
            })
            .catch(err => {
                next(err);
            })
    },

    update: (req, res, next) => {
        req.checkBody('name', 'Vui lòng nhập tên role').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        Role.findByIdAndUpdate(req.params[feature.documentId], cleanObj(req.body))
            .then(() => {
                req.flash('successes', [{msg: 'Cập nhật thành công!'}]);
                res.redirect('back');
            })
            .catch(err => {
                next(err);
            })
    },

    destroy: (req, res, next) => {
        Role.findByIdAndRemove(req.params[feature.documentId])
            .then((role) => {
                req.flash('successes', [{msg: `Bạn đã xóa role: ${role.name}`}]);
                res.redirect(`/${feature.slug}`);
            })
            .catch(err => {
                next(err);
            })
    }

};