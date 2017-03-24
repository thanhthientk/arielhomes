"use strict";

module.exports = {

    index: function (req, res, next) {
        _app.model.post.find()
            .then(posts => {
                res.render('blog/index', {posts});
            })
            .catch(err => {
                next(err);
            })
    }

};