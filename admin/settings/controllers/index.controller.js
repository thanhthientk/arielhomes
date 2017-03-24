"use strict";
/* _Module
 * _datas
 * _data */
const _info = require('../index').info;
const Setting = _app.model.setting;

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
    }

};