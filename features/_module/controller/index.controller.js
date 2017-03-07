"use strict";
/** Params
 * _Module
 * _datas
 * _data */
const feature = require('../feature');
const _Module = G_loadModel(feature.singular_slug);
const User = G_loadModel('user');

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
            _Module.paginate(params.queries, params.options),
            User.find({}).select('fullname')
        ]).then(results => {
            let usersForFilterBar = results[1];
            let _datas = results[0];
            let paginated = generatePaginateLink(req, _datas);
            res.render(feature.view.index, {
                pageTitle: feature.page_title.index,
                _datas: _datas.docs,
                paginated,
                reqQueryParams: req.query,
                usersForFilterBar
            });
        });
    },

    create: (req, res) => {
        res.render(feature.view.create, { pageTitle: feature.page_title.create, _data: {} });
    },

    store: (req, res, next) => {
        req.checkBody('name', 'Vui lòng nhập tên _module').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.createdBy = req.user.id;
        let _data = new _Module(cleanObj(req.body));
        _data.save()
            .then(() => {
                req.flash('successes', [{msg: 'Bạn đã thêm một _module mới!'}]);
                res.redirect(`/${feature.slug}`);
            })
            .catch(err => {
                next(err);
            });
    },

    edit: (req, res, next) => {
        _Module.findById(req.params[feature.documentId])
            .then(_data => {
                res.render(feature.view.create, { pageTitle: feature.page_title.update, _data });
            })
            .catch(err => {
                next(err);
            })
    },

    update: (req, res, next) => {
        req.checkBody('name', 'Vui lòng nhập tên _module').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        delete req.body.createdBy;
        _Module.findByIdAndUpdate(req.params[feature.documentId], cleanObj(req.body))
            .then(() => {
                req.flash('successes', [{msg: 'Cập nhật thành công!'}]);
                res.redirect('back');
            })
            .catch(err => {
                next(err);
            })
    },

    destroy: (req, res, next) => {
        _Module.findByIdAndRemove(req.params[feature.documentId])
            .then((_data) => {
                req.flash('successes', [{msg: `Bạn đã xóa _module: ${_data.name}`}]);
                res.redirect(`/${feature.slug}`);
            })
            .catch(err => {
                next(err);
            })
    }

};