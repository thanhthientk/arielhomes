"use strict";
const _info = require('../index').info;
const Setting = _app.model.setting;
const co = require('co');
const themeOptions = require('./../theme-options');

const themOptionsToArrayFields = function () {
    let allFields = {};
    Object.keys(themeOptions).map(bigGroupKey => {
        let bigGroup = themeOptions[bigGroupKey];
        Object.keys(bigGroup.fieldGroups).map(group => {
            let fields = bigGroup.fieldGroups[group].fields;
            Object.keys(fields).map(fieldKey => {
                allFields[fieldKey] = fields[fieldKey];
            });
        })
    });
    return allFields;
};

module.exports = {

    general: function (req, res, next) {
        Setting.findById('58d3896f43f9db1fe059889e')
            .then(setting => {
                res.render('settings/views/general', {pageTitle: 'Cài đặt chung', item: setting.data});
            })
            .catch(err => {
                next(err);
            })
    },
    postGeneral: function (req, res, next) {
        delete req.body._csrf;
        Setting.findByIdAndUpdate('58d3896f43f9db1fe059889e', {data: req.body})
            .then(() => {
                req.flash('success', 'Cập nhật thành công');
                res.redirect('back');
            })
            .catch((err) => {
                next(err);
            })
    },

    themeOptions: co.wrap(function* (req, res, next) {
        try {
            let Results = yield Promise.all([
                Setting.findById('58df4d0b2e26d9206c620ec4'),
                _app.model.language.find({status: true}).select('name code'),
            ]);
            let Options = Results[0],
                languages = Results[1];
            // gallery id
            Options.data['home_gallery'] = yield _app.model.media.find({ _id: { $in: Options.data['home_gallery'] } }).select('name ext path');

            res.render('settings/views/theme-option', {
                pageTitle: 'Tùy chỉnh giao diện',
                themeOptions,
                languages,
                Options
            });
        } catch (err) {
            next(err);
        }
    }),
    postThemeOptions: co.wrap(function* (req, res, next) {
        try {
            let languages = yield _app.model.language.find({status: true}).select('code'),
                allFields = themOptionsToArrayFields(),
                data = {};

            Object.keys(allFields).map(fieldName => {
                let field = allFields[fieldName];
                if (field.multiLang) {
                    let value = {};
                    for (let i = 0; i < languages.length; i++) {
                        let code = languages[i].code;
                        value[code] = req.body[fieldName+ '_' + code];
                    }
                    data[fieldName] = value;
                }
                else if (field.type === 'galleryId') {
                    let idImages = [];
                    if (Array.isArray(req.body[fieldName])) {
                        req.body[fieldName].map(id => idImages.push(id));
                    } else {
                        idImages.push(req.body[fieldName]);
                    }
                    data[fieldName] = idImages;
                }
                else {
                    data[fieldName] = req.body[fieldName];
                }
            });

            yield Setting.findByIdAndUpdate('58df4d0b2e26d9206c620ec4', { data });
            res.redirect('back');
        } catch (err) {
            console.log(err);
            next(err);
        }
    }),

};