"use strict";
const co = require('co');

module.exports = {

    index: co.wrap(function* (req, res, next) {
        try {
            let Results = yield Promise.all([
                _app.model.post.find({postType: 'slide', status: 'show'}).select('image fields'),
                _app.model.post
                    .find({postType: 'room', status: 'show', language: LANG})
                    .limit(4)
                    .populate('gallery', 'path ext')
                    .select('name image fields.slogan slug gallery'),
                _app.model.media.find({ _id: { $in: res.locals.Options['home_gallery'] } }).select('ext path fields'),
                _app.model.post.find({postType: 'room', status: 'show', language: LANG}).select('name')
            ]);

            let slides = Results[0],
                rooms = Results[1],
                homeGallery = Results[2],
                roomsInSelect = Results[3];

            res.theme('index', {
                slides,
                rooms,
                pageType: 'home',
                homeGallery,
                roomsInSelect
            });
        } catch (err) {
            next(err);
        }
    }),

    about: co.wrap(function* (req, res, next) {
        try {
            let services =
                yield _app.model.post
                    .find({postType: 'service', language: LANG})
                    .populate('gallery')
                    .limit(6)
                    .select('name gallery slug');
            res.theme('page-about', {
                pageType: 'about',
                pageTitle: {en: 'About Us', vn: 'Về chúng tôi'},
                services
            })
        }
        catch (err) {
            next(err);
        }
    }),

    contact: function (req, res, next) {
        res.theme('page-contact', {
            pageType: 'contact',
            pageTitle: {en: 'Contact Us', vn: 'Liên hệ'}
        });
    },

    gallery: co.wrap(function* (req, res, next) {
        try {
            let getMedia = yield _app.model.media.paginate({ type: 'gallery' }, {
                limit: 9,
                page: req.query.page || 1
            });

            let images = getMedia.docs,
                paginated = generatePaginateLink(req, getMedia);

            res.theme('page-gallery', {
                images,
                paginated,
                pageTitle: {en: 'Gallery', vn: 'Thư viện ảnh'},
                pageType: 'gallery',
            });
        } catch (err) {
            next(err);
        }
    })

};