"use strict";
const _info = require('../index').info;
const _Module = _app.model.post;
const Slug = require(_join('libraries/slug'));
const co = require('co');
const DL = require(_join('admin/languages/actions/index.action.js'));

const generateColumns = function (users = [{}], languageWidth) {
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
            label: 'Language',
            name: 'language',
            displayType: 'language',
            width: `${languageWidth}%`
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
                    text: 'Hiển thị'
                },
                hide: {
                    class: 'bg-gray',
                    text: 'Ẩn'
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
            label: 'Created by',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '10%',
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
            width: '10%',
            search: {
                type: 'date-range'
            }
        }
    ];
};

module.exports = {

    index: co.wrap(function* (req, res, next) {
        let setPaginateOptions = {
            populate: [
                {path: 'createdBy', select: 'fullname'},
                {path: 'documentsLanguage'}
            ]
        };
        let queries= {postType: 'service'};
        let paginateParams = generatePaginateParams( generateColumns(), setPaginateOptions, req.query, queries );

        try {
            let Results = yield Promise.all([
                _Module.paginate(paginateParams.queries, paginateParams.options),
                _app.model.user.find().select('fullname').sort({fullname: 'desc'}),
                _app.model.language.find({status: true}).select('code flag')
            ]);

            let languages = Results[2],
                users = Results[1],
                items = Results[0].docs;
            let languageWidth = languages.length * 3.5;
            let paginated = generatePaginateLink(req, Results[0]);
            let columns = generateColumns(users, languageWidth);
            res.render(_info.views.index, { items, paginated, columns, languages });
        } catch (err) {
            next(err);
        }
    }),

    create: co.wrap(function* (req, res, next) {
        try {
            /** Create new post */
            if (!req.query.dl && !req.query.language) {
                let PromiseAllResults = yield Promise.all([
                    _app.model.taxonomy.find({module: 'posts', type: 'category'}),
                    _app.model.language.find({status: true})
                ]);
                let categories = PromiseAllResults[0],
                    languages = PromiseAllResults[1];
                return res.render(_info.views.create, { categories, languages });
            }
            /** Create translation from Post */
            let createPostTranslate = true;
            let PromiseAllResults = yield Promise.all([
                _app.model.taxonomy.find({module: 'posts', type: 'category'}),
                _app.model.language.find({status: true}),
            ]);
            let languages = PromiseAllResults[1],
                categories = PromiseAllResults[0];

            // Get Language Info Of This Item
            let languageOfThisItem = languages.filter(function (language) {
                return req.query.language === language.code;
            })[0];

            //Get Items Was Translate
            let WasTranslate = yield DL.findById(req.query.dl); //return DL document
            WasTranslate = WasTranslate.documents;
            let itemsIdWasTranslate = Object.keys(WasTranslate).map(key => WasTranslate[key]);
            let ItemsWasTranslate = yield _app.model.post.find({ _id: { $in: itemsIdWasTranslate } }).select('name language');

            //Get Language Will Translate
            let LanguagesWillTranslate = languages.filter(language => {
                return (language.code !== req.query.language && WasTranslate[language.code] === undefined);
            });

            res.render(_info.views.create, {
                item: { documentsLanguage: {id: req.query.dl} },
                categories,
                languages,
                languageOfThisItem,
                createPostTranslate,
                ItemsWasTranslate,
                LanguagesWillTranslate
            });
        } catch (err) {
            next(err);
        }
    }),

    store: co.wrap(function* (req, res, next) {
        req.checkBody('name', `Vui lòng nhập tên bài viết`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.createdBy = req.user._id.toString();
        let item, dl;

        try {
            req.body.slug = yield Slug.generateSlug(req.body.name, 'post');
            let _module = new _Module(cleanObj(req.body));

            item = yield _module.save();

            let dlId;
            if (req.query.dl && req.query.language) {
                dlId = req.query.dl;
                yield DL.insert(dlId, item.id, req.query.language)
            } else {
                dl = yield DL.create('service', item.id, item.language);
                dlId = dl.id;
            }

            yield item.update({documentsLanguage: dlId});

            req.flash('success', `Bạn đã thêm một ${_info.label} mới!`);
            res.redirect(`/admin/${_info.slug}/${item.id}/edit`);
        } catch (err) {
            next(err);
        }
    }),

    edit: co.wrap(function* (req, res, next) {
        try {
            let PromiseAllResults = yield Promise.all([
                _Module
                    .findById(req.params.id)
                    .populate('documentsLanguage', 'documents')
                    .populate('gallery'),
                _app.model.taxonomy.find({module: 'posts', type: 'category'}),
                _app.model.language.find({status: true}).select('code flag name')
            ]);

            let item = PromiseAllResults[0],
                categories = PromiseAllResults[1],
                languages = PromiseAllResults[2];

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
            let ItemsWasTranslate = yield _app.model.post.find({ _id: { $in: ItemsIdWasTranslate } }).select('name language');

            // Get Languages Will Translate - Except Language Of This Items In DL
            let LanguagesWillTranslate = languages.filter(function (language) {
                return item.documentsLanguage.documents[language.code] === undefined;
            });

            res.render(_info.views.create, {
                item,
                categories,
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
        console.log(req.body.gallery, req.body.caption);

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
            queries.push(DL.unset(listId[i]));
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

    apiChangeSlug: co.wrap(function* (req, res, next) {
        let response = yield Slug.updateSlug(req, 'post');
        res.json(response);
    })

};