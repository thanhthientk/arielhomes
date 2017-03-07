"use strict";
const feature = require('../feature');
const Log = G_loadModel('log');
const Taxonomy = G_loadModel('taxonomy');


module.exports = {
    index(req, res, next) {
        Promise.all([
            Taxonomy.find({type: 'shortcut', module: 'dashboard', status: true}),
            Log.find({}).select('-content').sort({createdOn: 'desc'}).limit(10)
        ])
            .then((results) => {
                let shortcuts = results[0];
                let logs = results[1];
                res.render(feature.view.index, { pageTitle: feature.page_title.index, shortcuts, logs });
            })
            .catch(err => {
                 next(err);
            })
    }
};