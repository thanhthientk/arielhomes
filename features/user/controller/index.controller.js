"use strict";
const feature = require('../feature');
const User = G_loadModel(feature.singular_slug);
const Role = G_loadModel('role');
const Branch = G_loadModel('branch');
const LogAction = G_loadAction('log');
const bcrypt = require(`${ROOT_PATH}/libs/bcrypt`);
const co = require('co');

const generatorLog = function (type, user) {
    let newUser = user.toObject();
    delete newUser.password;
    return LogAction.create({
        type,
        label: feature.label,
        document: newUser
    });
};

module.exports = {

    index: function(req, res, next) {
        let params = generatePaginateParams({
            queries: ['keyword', 'branch', 'createdBy', 'province', 'time'],
            options: {
                populate: [
                    {path: 'createdBy', select: 'fullname'},
                    {path: 'role', select: 'name'},
                    {path: 'branch', select: 'name'}
                ]
            }
        }, req.query);

        Promise.all([
            User.paginate(params.queries, params.options),
            User.find({}).select('fullname'),
            Branch.find({}).select('name')
        ]).then(results => {
            let users = results[0];
            let usersForFilterBar = results[1];
            let branchesForFilterBar = results[2];

            let paginated = generatePaginateLink(req, users);
            res.render(feature.view.index, {
                pageTitle: feature.page_title.index,
                users: users.docs,
                paginated,
                reqQueryParams: req.query,
                usersForFilterBar,
                branchesForFilterBar
            });
        }).catch((err) => {
            next(err)
        });
    },

    create: function(req, res, next) {
        Promise.all([
            Branch.find().sort({name: 'desc'}).select('name'),
            Role.find().sort({name: 'desc'}).select('name')
        ])
            .then(results => {
                let branches = results[0];
                let roles = results[1];
                res.render(feature.view.create, { pageTitle: feature.page_title.create, user: {}, branches, roles });
            })
            .catch((err) => {
                next(err)
            });
    },

    store: co.wrap(function* (req, res, next) {
        req.checkBody('email', 'Vui lòng nhập email').notEmpty();
        req.checkBody('email', 'Email không đúng định dạng').isEmail();
        req.checkBody('password', 'Vui lòng nhập mật khẩu').notEmpty();
        req.checkBody('password', 'Mật khẩu tối thiểu 6 kí tự').isLength({min: 6});
        req.checkBody('password2', 'Xác nhận mật khẩu không khớp').equals(req.body.password);

        let errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        let checkUniqueEmail = false;
        try {
            checkUniqueEmail = yield User.findOne({email: req.body.email});
        } catch (err) {
            next(err)
        }
        if (checkUniqueEmail) {
            req.flash('errors', [{msg: `Email ${req.body.email} da ton tai`}]);
            return res.redirect('back');
        }

        let userData = Object.assign({}, {createdBy: req.user.id}, cleanObj(req.body));
        let user = new User(userData);
        user.save()
            .then((user) => {
                return generatorLog('create', user);
            })
            .then(() => {
                req.flash('successes', [{msg: 'Ban da them nhan su moi thanh cong!'}]);
                res.redirect(`/${feature.slug}`);
            })
            .catch((err) => {
                next(err);
            });
    }),

    edit: function (req, res, next) {
        Promise.all([
            User.findById(req.params[feature.documentId]),
            Branch.find().sort({name: 'desc'}).select('name'),
            Role.find().sort({name: 'desc'}).select('name')
        ])
        .then(results => {
            let user = results[0];
            if (user.length == 0) {
                req.flash('errors', [{msg: 'Khong tim thay nguoi dung nay'}]);
                return res.redirect('back');
            }
            let branches = results[1];
            let roles = results[2];
            res.render(feature.view.create, { pageTitle: feature.page_title.create, user, branches, roles });
        })
        .catch((err) => {
            next(err)
        });
    },
    
    update: co.wrap(function* (req, res, next) {
        if (req.body.email) {
            req.checkBody('email', 'Vui lòng nhập email').notEmpty();
            req.checkBody('email', 'Email không đúng định dạng').isEmail();
        }
        if (req.body.password || req.body.password2) {
            req.checkBody('password', 'Vui lòng nhập mật khẩu').notEmpty();
            req.checkBody('password', 'Mật khẩu tối thiểu 6 kí tự').isLength({min: 6});
            req.checkBody('password2', 'Xác nhận mật khẩu không khớp').equals(req.body.password);
        }

        let errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        if (req.body.email) {
            let checkUniqueEmail = false;
            try {
                checkUniqueEmail = yield User.findOne({email: req.body.email});
            } catch (err) {
                next(err)
            }
            if (checkUniqueEmail) {
                req.flash('errors', [{msg: `Email ${req.body.email} da ton tai`}]);
                return res.redirect('back');
            }
        } else {
            delete req.body.email;
        }

        if (req.body.password) {
            try {
                req.body.password = yield bcrypt.hash(req.body.password);
            } catch (err) {
                next(err);
            }
        }

        User.findByIdAndUpdate(req.params[feature.documentId], cleanObj(req.body))
            .then((user) => {
                return generatorLog('update', user);
            })
            .then(() => {
                req.flash('successes', [{msg: 'Cập nhật thành công!'}]);
                res.redirect('back');
            })
            .catch(err => {
                next(err)
            });
    }),

    destroy: function (req, res, next) {
        User.findByIdAndRemove(req.params[feature.documentId])
            .then((user) => {
                req.flash('successes', [{msg: `Bạn đã xóa nhân sự: ${user.fullname} thành công`}]);
                return generatorLog('delete', user);
            })
            .then(() => {
                res.redirect('/users');
            })
            .catch(err => {
                next(err);
            })
    }

};