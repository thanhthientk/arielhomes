"use strict";

module.exports = {

    single: function (req, res, next) {
        _app.model.post.findOne({slug: req.params.slug})
            .then(post => {
                console.log(post);
                res.render('blog/single', { post });
            })
            .catch(err => {
                next(err);
            })
    }

};