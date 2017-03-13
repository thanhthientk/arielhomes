"use strict";
const passport = require('passport');
const co = require('co');
const recaptcha = require(`${__libs}/recaptcha`);
const _Module = _app.model.user;
const _info = require('../index').info;

const generateColumns = function (users = {}, roles = {}) {
    return [
        {
            displayType: 'checkbox',
            width: '3%',
        },
        {
            label: 'Tên',
            name: 'fullname',
            displayType: 'title',
            headSort: true,
            width: '30%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Email',
            name: 'email',
            displayType: 'title',
            headSort: true,
            width: '27%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Nhóm quyền',
            name: 'role',
            access: 'role.name',
            displayType: 'sort',
            headSort: true,
            width: '20%',
            class: 'label bg-blue',
            search: {
                type: 'select',
                fieldDisplay: 'name',
                items: roles
            }
        },
        {
            label: 'Được tạo bởi',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '20%',
            class: 'label bg-blue',
            search: {
                type: 'select',
                fieldDisplay: 'fullname',
                items: users
            }
        },
        {
            label: 'Thời gian tạo',
            name: 'createdOn',
            displayType: 'time',
            headSort: true,
            width: '20%',
            search: {
                type: 'date-range'
            }
        }
    ];
};

module.exports = {

    //Module routes
    index: function (req, res, next) {
        let setPaginateOptions = {
            populate: [
                {path: 'createdBy', select: 'fullname'},
                {path: 'role', select: 'name'}
            ]
        };
        let paginateParams = generatePaginateParams(generateColumns(), setPaginateOptions, req.query);

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
            _app.model.user.find().select('fullname').sort({fullname: 'desc'}),
            _app.model.role.find().select('name').sort({name: 'desc'})
        ])
            .then((results => {
                let roles = results[2];
                let users = results[1];
                let items = results[0].docs;
                let paginated = generatePaginateLink(req, results[0]);
                let columns = generateColumns(users, roles);
                res.render(_info.views.index, { items, paginated, columns });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: function (req, res, next) {
        let item = req.session.flash.itemDatas ? req.session.flash.itemDatas[0] : {};
        _app.model.role.find({}).select('name').sort({name: 'desc'})
            .then(roles => {
                res.render(_info.views.create, { item, roles });
            })
            .catch(err => {
                next(err);
            });
    },

    store: co.wrap(function* (req, res, next) {
        req.checkBody('fullname', 'Vui lòng nhập tên người dùng').notEmpty();
        req.checkBody('email', 'Vui lòng nhập email').notEmpty();
        req.checkBody('email', 'Email không đúng định dạng').isEmail();
        req.checkBody('password', 'Vui lòng nhập mật khẩu').notEmpty();
        req.checkBody('password', 'Mật khẩu tối thiểu 6 kí tự').isLength({min: 6});
        req.checkBody('password2', 'Xác nhận mật khẩu không khớp').equals(req.body.password);

        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        let checkUniqueEmail = false;
        try {
            checkUniqueEmail = yield _app.model.user.findOne({email: req.body.email});
        } catch (err) {
            next(err)
        }
        if (checkUniqueEmail) {
            req.flash('errors', [{msg: `Email ${req.body.email} đã tồn tại`}]);
            delete req.body.password;
            delete req.body.password2;
            req.flash('itemDatas', req.body);
            return res.redirect('back');
        }

        req.body.createdBy = req.user._id.toString();
        let _module = new _Module(cleanObj(req.body));
        _module.save()
            .then(() => {
                req.flash('success', 'Bạn đã thêm một người dùng mới!');
                res.redirect(`/admin/${_info.slug}`);
            })
            .catch(err => {
                next(err);
            });
    }),

    edit: function(req, res, next) {
        Promise.all([
            _Module.findById(req.params.id).select('fullname email'),
            _app.model.role.find({}).select('name').sort({name: 'desc'})
        ])
            .then(results => {
                let item = results[0];
                let roles = results[1];

                res.render(_info.views.create, { item, roles });
            })
            .catch(err => {
                next(err);
            })
    },

    update: function(req, res, next) {
        req.checkBody('fullname', 'Vui lòng nhập tên _module').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        delete req.body.createdBy;
        _Module.findByIdAndUpdate(req.params.id, cleanObj(req.body))
            .then(() => {
                req.flash('success', 'Cập nhật thành công!');
                res.redirect('back');
            })
            .catch(err => {
                next(err);
            })
    },

    destroy: function(req, res, next) {
        if (!req.body.listId) return res.redirect('back');

        _Module.remove({ _id: { $in: req.body.listId } })
            .then(() => {
                req.flash('success', 'Đã xóa thành công!');
                if (req.body.single == 'true')
                    return res.redirect(`/admin/${_info.slug}`);
                res.redirect(`back`);
            })
            .catch(err => {
                next(err);
            })
    },

    //Authenticate routes
    getLogin: function (req, res, next) {
        if (req.user)
            return res.redirect('/admin');
        res.render('users/views/login', { recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY });
    },

    postLogin: co.wrap(function* (req, res, next) {
        let GetCheckCaptCha;
        try {
            GetCheckCaptCha = yield recaptcha.checkCaptCha(req.body["g-recaptcha-response"]);
        } catch (err) {
            req.flash('errors', {msg: 'Lỗi xác thực captcha. Vui lòng thử lại!'});
            return res.redirect('back');
        }
        if (GetCheckCaptCha.success === false) {
            req.flash('errors', {msg: 'Invalid Captcha'});
            return res.redirect('back');
        }

        req.checkBody('email', 'Email không đúng định dạng').isEmail();
        req.checkBody('password', 'Mật khẩu không được để trống').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) throw err;
            if (!user) {
                req.flash('errors', {msg: 'Email hoặc mật khẩu không đúng!'});
                return res.redirect('back');
            }
            req.logIn(user, (err) => {
                if (err) throw err;
                return res.redirect('/admin');
            })
        })(req, res, next);
    }),

    getLogout: function (req, res, next) {
        req.session.cookie.expires = null;
        req.session.passport = null;
        req.logout();
        res.redirect('/admin/login');
    },

};