"use strict";
const _info = require('../index').info;
const _Module = _app.model[_info.singular_slug];
const Slug = require(_join('libraries/slug'));
const co = require('co');
const DL = require(_join('admin/languages/actions/index.action.js'));

const generateColumns = function (users = {}, taxonomyModule, postType, taxonomyType, languageWidth) {
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
            width: '40%',
            search: {
                type: 'text'
            },
            params: [
                {name: 'module', value: taxonomyModule},
                {name: 'type', value: taxonomyType},
                {name: 'post_type', value: postType}
            ]
        },
        {
            label: 'Language',
            name: 'language',
            displayType: 'language',
            width: `${languageWidth}%`
        },
        {
            label: 'Created by',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '15%',
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
            width: '15%',
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
                {path: 'documentsLanguage'}
            ]
        };
        let queries = {
            module: req.query.module,
            type: req.query.type,
        };
        if (req.query['post_type'])
            queries.postType = req.query['post_type'];

        let paginateParams = generatePaginateParams(generateColumns(), setPaginateOptions, req.query, queries);

        Promise.all([
            _Module.paginate(paginateParams.queries, paginateParams.options),
            _app.model.user.find().select('fullname').sort({fullname: 'desc'}),
            _app.model.language.find({status: true}).select('code flag'),
        ])
            .then((results => {
                let languages = results[2],
                    users = results[1],
                    items = results[0].docs;

                let languageWidth = languages.length * 5,
                    paginated = generatePaginateLink(req, results[0]),
                    columns = generateColumns(
                        users,
                        req.query.module,
                        req.query['post_type'],
                        req.query.type,
                        languageWidth
                    );

                res.render(_info.views.index, { items, paginated, columns, languages });
            }))
            .catch(err => {
                next(err);
            })
    },

    create: co.wrap(function* (req, res, next) {
        try {
            let PromiseAllResults = yield Promise.all([
                _app.model.language.find({status: true})
            ]);
            let languages = PromiseAllResults[0];

            /** Create new Tax */
            if (!req.query.dl && !req.query.language) {
                return res.render(_info.views.create, { languages });
            }

            /** Create translation from Tax */
            let createPostTranslate = true;

            // Get Language Info Of This Item
            let languageOfThisItem = languages.filter(function (language) {
                return req.query.language === language.code;
            })[0];

            //Get Items Was Translate
            let WasTranslate = yield DL.findById(req.query.dl); //return DL document
            WasTranslate = WasTranslate.documents;
            let itemsIdWasTranslate = Object.keys(WasTranslate).map(key => WasTranslate[key]);
            let ItemsWasTranslate = yield _app.model.taxonomy.find({ _id: { $in: itemsIdWasTranslate } }).select('name language');

            //Get Language Will Translate
            let LanguagesWillTranslate = languages.filter(language => {
                return (language.code !== req.query.language && WasTranslate[language.code] === undefined);
            });
            res.render(_info.views.create, {
                languages,
                languageOfThisItem,
                createPostTranslate,
                ItemsWasTranslate,
                LanguagesWillTranslate
            });
        } catch (err) { next(err); }
    }),

    store: co.wrap(function* (req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        try {
            req.body.createdBy = req.user._id.toString();
            req.body.slug = yield Slug.generateSlug(req.body.name, 'taxonomy');
            let _module = new _Module(cleanObj(req.body));

            let item = yield _module.save();

            let dlId;
            if (req.query.dl && req.query.language) {
                dlId = req.query.dl;
                yield DL.insert(dlId, item.id, req.query.language)
            } else {
                let dl = yield DL.create('category', item.id, item.language);
                dlId = dl.id;
            }

            yield item.update({documentsLanguage: dlId});

            req.flash('success', `Bạn đã thêm một ${_info.label} mới!`);
            res.redirect(`/admin/${_info.slug}/${item.id}/edit?module=${req.body.module}&type=${req.body.type}`);
        } catch (err) {
            next(err);
        }
    }),

    edit: co.wrap(function* (req, res, next) {
        try {
            let PromiseAllResults = yield Promise.all([
                _Module.findById(req.params.id).populate('documentsLanguage', 'documents'),
                _app.model.language.find({status: true}).select('code flag name')
            ]);

            let item = PromiseAllResults[0],
                languages = PromiseAllResults[1];

            // Get Language Info Of This Item
            let languageOfThisItem = languages.filter(function (language) {
                return item.language === language.code;
            })[0];

            // Check If This Item Can Change Language It Self
            let countItemsWasTranslate = Object.keys(item.documentsLanguage.documents).length;

            /** Get Items Was Translate - Except This Item */
            let WasTranslate = {};
            if (countItemsWasTranslate > 1) {
                WasTranslate = Object.assign({}, item.documentsLanguage.documents);
                delete WasTranslate[item.language];
            }
            //Query To Items Was Translate
            let ItemsIdWasTranslate = Object.keys(WasTranslate).map(key => WasTranslate[key]);
            let ItemsWasTranslate = yield _app.model.taxonomy.find({ _id: { $in: ItemsIdWasTranslate } }).select('name language');

            // Get Languages Will Translate - Except Language Of This Items In DL
            let LanguagesWillTranslate = languages.filter(function (language) {
                return item.documentsLanguage.documents[language.code] === undefined;
            });

            res.render(_info.views.create, {
                item,
                languages,
                languageOfThisItem,
                countItemsWasTranslate,
                ItemsWasTranslate,
                LanguagesWillTranslate
            });
        } catch (err) {
            next(err);
        }
    }),

    update: co.wrap(function* (req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        try {
            let currentItem = yield _Module.findById(req.params.id).populate('documentsLanguage', 'documents').select('documentsLanguage');

            if (Object.keys(currentItem.documentsLanguage.documents).length > 1)
                delete req.body.language;
            else
                yield DL.update(currentItem.documentsLanguage.id, currentItem.id, req.body.language);

            delete req.body.slug;
            delete req.body.createdBy;

            yield _Module.findByIdAndUpdate(req.params.id, cleanObj(req.body));
            req.flash('success', 'Cập nhật thành công!');
            res.redirect('back');
        } catch (err) {
            next(err);
        }
    }),

    destroy: co.wrap(function* (req, res, next) {
        if (!req.body.listId) return res.redirect('back');
        let listId = (Array.isArray(req.body.listId)) ? req.body.listId : [req.body.listId];

        let queries = [];
        for (let i = 0; i < listId.length; i++) {
            queries.push(DL.unset(listId[i], 'taxonomy'));
        }

        try {
            yield Promise.all(queries);
            yield _Module.remove({ _id: { $in: listId } });
            req.flash('success', 'Đã xóa thành công!');
            if (req.body.single === 'true')
                return res.redirect(`/admin/${_info.slug}`);
            res.redirect(`back`);
        } catch (err) {
            next(err);
        }
    }),

    apiCreate: co.wrap(function* (req, res, next) {
        let response = {
            status: '',
            message: '',
            data: {}
        };
        req.checkBody('name', `Vui lòng nhập tên ${_info.label}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            response.status = 'error';
            response.message = 'Vui lòng nhập tên';
            return res.json(response);
        }

        req.body.createdBy = req.user._id.toString();
        req.body.slug = yield Slug.generateSlug(req.body.name, 'taxonomy');

        let _module = new _Module(cleanObj(req.body));
        _module.save()
            .then((result) => {
                response.status = 'success';
                response.message = 'Thêm thành công';
                response.data = result;
                res.json(response);
            })
            .catch(err => {
                response.status = 'error';
                response.message = 'Lỗi khi thêm';
                res.json(response);
            });
    }),

    apiChangeSlug: co.wrap(function* (req, res, next) {
        let response = yield Slug.updateSlug(req, 'taxonomy');
        res.json(response);
    })

};