"use strict";
const DL = require('./../models/documents_language.model');
const co = require('co');

module.exports = {

    create: function (type, itemId, languageCode) {
        let documents = {};
        documents[languageCode] = itemId;

        let dl = new DL({
            type,
            documents,
        });

        return dl.save();
    },
    
    update: function (dlId, itemId, languageCode) {
        let documents = {};
        documents[languageCode] = itemId;

        return DL.findByIdAndUpdate(dlId, { documents })
    },

    findById: function (dlId) {
        return DL.findById(dlId);
    },

    insert: function (dlId, itemId, languageCode) {
        let $set = {};
        $set[`documents.${languageCode}`] = itemId;

        return DL.findByIdAndUpdate(dlId, { $set })
    },
    /**
     * Unset Or Remove DL
     */
    unset: co.wrap(function* (itemId, model) {
        if (model === undefined) model = 'post';
        console.log(model);
        try {
            let item = yield _app.model[model].findById(itemId);
            let $unset = {};
                $unset[`documents.${item.language}`] = '';
            return DL.findByIdAndUpdate(item.documentsLanguage, { $unset });
        } catch (err) {
            throw err;
        }
    })

};