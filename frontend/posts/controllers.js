"use strict";
const co = require('co');

/**
 * Paginate Post
 * @param postType
 * @param limit
 * @param select
 * @param page
 * @param categoryId
 * @param search
 */
const paginatePost = function (postType, limit, select, page, categoryId, search) {
    let queries = {
        postType,
        language: LANG,
        status: 'show'
    };
    if (categoryId) queries.categories = categoryId;
    if (search) queries.name = new RegExp(search, 'i');

    return _app.model.post.paginate( queries, {
        select,
        limit,
        populate: [{path: 'image'}, {path: 'gallery', select: 'path ext'}],
        page: page || 1
    })
};

module.exports = {

    roomList: co.wrap(function* (req, res, next) {
        try {
            let Results = yield Promise.all([
                paginatePost('room', 4, 'name image fields slug gallery description', req.query.page)
            ]);
            let rooms = Results[0].docs,
                paginated = generatePaginateLink(req, Results[0]);
            res.theme('page-room', {
                rooms,
                paginated,
                pageTitle: {en: 'Luxury Rooms', vn: 'Danh sách phòng'},
                pageType: 'room',
            })
        } catch (err) {
            next(err);
        }
    }),
    roomDetail: function (req, res, next) {
        _app.model.post
            .findOne({postType: 'room', slug: req.params.slug})
            .populate('gallery', 'path ext')
            .then(room => {
                if (!room) return next();
                res.theme('single-room', {
                    room,
                    bodyClass: 'room-detials',
                    pageTitle: {en: room.name, vn: room.name},
                    pageType: 'room',
                });
            })
            .catch(err => next(err));
    },

    //blog
    blog: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            paginatePost('post', 2, 'name slug image description', req.query.page, '', req.query.s),
            _app.model.taxonomy.find({module: 'posts', type: 'category', language: LANG}).select('slug name')
        ]);
        let posts = Results[0].docs,
            paginated = generatePaginateLink(req, Results[0]),
            categories = Results[1];

        res.theme('page-blog', {
            posts,
            paginated,
            categories,
            pageTitle: {en: 'Blog', vn: 'Blog'},
            pageType: 'blog',
        });
    }),
    blogDetail: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            _app.model.post.findOne({slug: req.params.slug}).populate('image')
        ]);
        let post = Results[0];

        res.theme('single-blog', {
            post,
            pageTitle: {en: post.name, vn: post.name},
            pageType: 'blog',
        });
    }),
    blogCategory: co.wrap(function* (req, res, next) {
        try {
            let category = yield _app.model.taxonomy.findOne({slug: req.params.slug});

            let Results = yield Promise.all([
                paginatePost('post', 2, 'name slug image description', req.query.page, category.id),
                _app.model.taxonomy.find({module: 'posts', type: 'category', language: LANG}).select('slug name')
            ]);
            let posts = Results[0].docs,
                paginated = generatePaginateLink(req, Results[0]),
                categories = Results[1];

            res.theme('page-blog', {
                posts,
                paginated,
                categories,
                pageTitle: {en: 'Blog', vn: 'Blog'},
                pageType: 'blog',
            });
        } catch (err){
            next(err);
        }
    }),

    //tour
    tour: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            paginatePost('tour', 6, 'name slug gallery fields description', req.query.page)
        ]);
        let tours = Results[0].docs,
            paginated = generatePaginateLink(req, Results[0]);

        res.theme('page-tour', {
            tours,
            paginated,
            pageTitle: {en: 'Tours', vn: 'Tour'},
            pageType: 'tour',
        });
    }),
    tourDetail: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            _app.model.post
                .findOne({slug: req.params.slug})
                .populate('gallery', 'path ext')
        ]);
        let tour = Results[0];

        res.theme('single-tour', {
            tour,
            pageTitle: {en: tour.name, vn: tour.name},
            pageType: 'tour',
        });
    }),

    //service
    service: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            paginatePost('service', 6, 'name slug gallery description', req.query.page)
        ]);
        let services = Results[0].docs,
            paginated = generatePaginateLink(req, Results[0]);

        res.theme('page-service', {
            services,
            paginated,
            pageTitle: {en: 'Services', vn: 'Dịch vụ'},
            pageType: 'service',
        });
    }),
    serviceDetail: co.wrap(function* (req, res, next) {
        let Results = yield Promise.all([
            _app.model.post
                .findOne({slug: req.params.slug})
                .populate('gallery', 'path ext')
        ]);
        let service = Results[0];

        res.theme('single-service', {
            service,
            pageTitle: {en: service.name, vn: service.name},
            pageType: 'service',
        });
    }),
};