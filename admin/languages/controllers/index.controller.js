"use strict";
/* _Module
 * _datas
 * _data */
const _info = require('../index').info;
const _Module = _app.model[_info.singular_slug];
const co = require('co');
const DLAction = require('./../actions/index.action');

const generateColumns = function (users = {}) {
    return [
        {
            label: 'Flag',
            name: 'flag',
            displayType: 'template',
            width: '5%',
            template: "<img src='/admin/dist/flags/$END$.png'/>"
        },
        {
            label: 'Name',
            name: 'name',
            displayType: 'title',
            headSort: true,
            width: '30%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Code',
            name: 'code',
            displayType: 'title',
            headSort: true,
            width: '20%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Created by',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '25%',
            class: 'label bg-blue',
            search: {
                type: 'select',
                fieldDisplay: 'fullname',
                items: users
            }
        },
        {
            label: 'Created on',
            name: 'createdOn',
            displayType: 'time',
            headSort: true,
            width: '25%',
            search: {
                type: 'date-range'
            }
        }
    ];
};

const countries = require(_join('libraries/countries'));

module.exports = {

    init: function (req, res, next) {
        DLAction.init()
            .then(doc => {
                res.send(doc);
            })
            .catch(err => {
                next(err);
            })
    },

    index: function (req, res, next) {
        let setPaginateOptions = {
            populate: [
                {path: 'createdBy', select: 'fullname'}
            ]
        };
        let paginateParams = generatePaginateParams(generateColumns(), setPaginateOptions, req.query);

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
            _app.model.user.find().select('fullname').sort({fullname: 'desc'})
        ])
            .then((results => {
                let users = results[1];
                let items = results[0].docs;
                let paginated = generatePaginateLink(req, results[0]);
                let columns = generateColumns(users);
                res.render(_info.views.index, { items, paginated, columns });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: function (req, res, next) {
        res.render(_info.views.create, { countries });
    },

    store: function(req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.createdBy = req.user._id.toString();
        req.body.status = !!(req.body.status);

        let _module = new _Module(cleanObj(req.body));
        _module.save()
            .then(() => {
                req.flash('success', `Bạn đã thêm một ${_info.label} mới!`);
                res.redirect(`/admin/${_info.slug}`);
            })
            .catch(err => {
                next(err);
            });
    },

    edit: function(req, res, next) {
        _Module.findById(req.params.id)
            .then(item => {
                res.render(_info.views.create, { item, countries });
            })
            .catch(err => {
                next(err);
            })
    },

    update: function(req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.status = !!(req.body.status);

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
    }

};