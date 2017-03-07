"use strict";

const feature = require('../feature');
const Taxonomy = G_loadModel(feature.singular_slug);

const getTaxonomyInfo = (reqQuery) => {
    let taxonomyType = reqQuery.type;
    let moduleOwnTaxonomy = reqQuery.module;
    if (taxonomyType == undefined || moduleOwnTaxonomy == undefined)
        return false;

    let taxonomyInfo = loadFeature(moduleOwnTaxonomy).taxonomies[taxonomyType];
    taxonomyInfo.module = moduleOwnTaxonomy;
    taxonomyInfo.type = taxonomyType;
    return taxonomyInfo;
};

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

        let taxonomyInfo = getTaxonomyInfo(req.query);
        if (taxonomyInfo === false) return res.redirect('back');

        params.queries.type = taxonomyInfo.type;
        params.queries.module = taxonomyInfo.module;

        Taxonomy.paginate(params.queries, params.options)
            .then(taxonomies => {
                let paginated = generatePaginateLink(req, taxonomies);
                res.render(feature.view.index, {
                    pageTitle: taxonomyInfo.title,
                    taxonomies: taxonomies.docs,
                    paginated,
                    reqQueryParams: req.query,
                    taxonomyInfo
                });
            })
            .catch((err) => {
                next(err)
            })
    },

    create: (req, res) => {
        let taxonomyInfo = getTaxonomyInfo(req.query);
        if (taxonomyInfo === false) return res.redirect('back');

        res.render(feature.view.create, {
            pageTitle: `Thêm ${taxonomyInfo.title}`,
            taxonomy: {},
            taxonomyInfo
        });
    },

    store: (req, res, next) => {
        let taxonomyInfo = getTaxonomyInfo(req.query);
        if (taxonomyInfo === false) return res.redirect('back');

        req.checkBody('name', `Vui lòng nhập tên ${taxonomyInfo.title}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.createdBy = req.user.id;
        req.body.status = !!req.body.status;

        let taxonomy = new Taxonomy(cleanObj(req.body));
        taxonomy.save()
            .then(() => {
                req.flash('successes', [{msg: 'Bạn đã thêm một _module mới!'}]);
                res.redirect(`/${feature.slug}?module=${req.body.module}&type=${req.body.type}`);
            })
            .catch(err => {
                next(err);
            });
    },

    edit: (req, res, next) => {
        let taxonomyInfo = getTaxonomyInfo(req.query);
        if (taxonomyInfo === false) return res.redirect('back');

        Taxonomy.findById(req.params[feature.documentId])
            .then(taxonomy => {
                res.render(feature.view.create, {
                    pageTitle: `Cập nhật ${taxonomyInfo.title}`,
                    taxonomy,
                    taxonomyInfo
                });
            })
            .catch(err => {
                next(err);
            })
    },

    update: (req, res, next) => {
        let taxonomyInfo = getTaxonomyInfo(req.query);
        if (taxonomyInfo === false) return res.redirect('back');

        req.checkBody('name', `Vui lòng nhập tên ${taxonomyInfo.title}`).notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('back');
        }

        req.body.status = !!req.body.status;
        delete req.body.createdBy;
        Taxonomy.findByIdAndUpdate(req.params[feature.documentId], cleanObj(req.body))
            .then(() => {
                req.flash('successes', [{msg: 'Cập nhật thành công!'}]);
                res.redirect('back');
            })
            .catch(err => {
                next(err);
            })
    },

    destroy: (req, res, next) => {
        Taxonomy.findByIdAndRemove(req.params[feature.documentId])
            .then((taxonomy) => {
                req.flash('successes', [{msg: `Bạn đã xóa: ${taxonomy.name}`}]);
                res.redirect(`/${feature.slug}/?module=${taxonomy.module}&type=${taxonomy.type}`);
            })
            .catch(err => {
                next(err);
            })
    },

    search: (req, res, next) => {
        Taxonomy.find({module: req.query.module, type: req.query.type})
            .then(items => {
                res.json({items});
            })
            .catch((err) => {
                next(err)
            })
    }

};