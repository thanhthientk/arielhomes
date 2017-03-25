"use strict";
/* _Module
 * _datas
 * _data */
const _info = require('../index').info;
const _Module = _app.model[_info.singular_slug];
const Slug = require(_join('libraries/slug'));
const co = require('co');

const generateColumns = function (users = [{}], categories = [{}]) {
    return [
        {
            displayType: 'checkbox',
            width: '3%',
        },
        {
            label: 'Name',
            name: 'name',
            displayType: 'title',
            headSort: true,
            width: '25%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Categories',
            name: 'categories',
            access: 'name',
            displayType: 'collections',
            class: 'label bg-blue mr3',
            headSort: true,
            width: '17%',
            search: {
                type: 'select',
                fieldDisplay: 'name',
                items: categories
            }
        },
        {
            label: 'Created by',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '14%',
            class: 'label bg-blue',
            search: {
                type: 'select',
                fieldDisplay: 'fullname',
                items: users
            }
        },
        {
            label: 'Status',
            name: 'status',
            displayType: 'label',
            headSort: true,
            width: '10%',
            itemsInfo: {
                show: {
                    class: 'bg-green',
                    text: 'Hien thi'
                },
                hide: {
                    class: 'bg-gray',
                    text: 'An'
                }
            },
            search: {
                type: 'select',
                fieldDisplay: 'name',
                items: [
                    {id: 'show', name: 'Hiển thị'},
                    {id: 'hide', name: 'Ẩn'}
                ]
            }
        },
        {
            label: 'Created on',
            name: 'createdOn',
            displayType: 'time',
            headSort: true,
            width: '10%',
            search: {
                type: 'date-range'
            }
        }
    ];
};

module.exports = {

    index: function (req, res, next) {
        let setPaginateOptions = {
            populate: [
                {path: 'createdBy', select: 'fullname'},
                {path: 'categories', select: 'name'}
            ]
        };
        let paginateParams = generatePaginateParams(
            generateColumns(),
            setPaginateOptions,
            req.query,
            {postType: 'post'}
        );

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
            _app.model.user.find().select('fullname').sort({fullname: 'desc'}),
            _app.model.taxonomy.find({module: 'posts', type: 'category'}).select('name')
        ])
            .then((results => {
                let categories = results[2];
                let users = results[1];
                let items = results[0].docs;
                let paginated = generatePaginateLink(req, results[0]);
                let columns = generateColumns(users, categories);
                res.render(_info.views.index, { items, paginated, columns });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: function (req, res, next) {
        _app.model.taxonomy.find({module: 'posts', type: 'category'})
            .then(categories => {
                res.render(_info.views.create, { categories });
            })
            .catch(err => {
                next(err);
            })
    },

    store: co.wrap(function* (req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên bài viết`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.createdBy = req.user._id.toString();

        req.body.slug = yield Slug.generateSlug(req.body.name, 'post');

        let _module = new _Module(cleanObj(req.body));
        _module.save()
            .then(() => {
                req.flash('success', `Bạn đã thêm một ${_info.label} mới!`);
                res.redirect(`/admin/${_info.slug}`);
            })
            .catch(err => {
                next(err);
            });
    }),

    edit: function(req, res, next) {
        Promise.all([
            _Module.findById(req.params.id),
            _app.model.taxonomy.find({module: 'posts', type: 'category'})
        ])
            .then(results => {
                let item = results[0],
                    categories = results[1];

                res.render(_info.views.create, { item, categories });
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

        delete req.body.slug;
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

    apiChangeSlug: co.wrap(function* (req, res, next) {
        let response = yield Slug.updateSlug(req, 'post');
        res.json(response);
    })

};