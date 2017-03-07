"use strict";
const feauture = require('../feature');
const passport = require('passport');
const User = G_loadModel('user');
const co = require('co');
const recaptcha = require('../../../libs/recaptcha');

module.exports = {

    getLogin (req, res, next) {
        if (req.user)
            return res.redirect('/dashboard');
        res.render(feauture.view.login, {
            recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY
        });
    },

    postLogin: co.wrap(function* (req, res, next) {
        let GetCheckCaptCha;
        try {
            GetCheckCaptCha = yield recaptcha.checkCaptCha(req.body["g-recaptcha-response"]);
        } catch (err) {
            req.flash('errors', {msg: 'Lỗi xác thực captcha. Vui lòng thử lại!'});
            return res.redirect('back');
        }
        if (GetCheckCaptCha.success === false) {
            req.flash('errors', {msg: 'Invalid Captcha'});
            return res.redirect('back');
        }

        req.checkBody('email', 'Email không đúng định dạng').isEmail();
        req.checkBody('password', 'Mật khẩu không được để trống').notEmpty();
        let errors = req.validationErrors();
        if (errors) {
            req.flash('errors', errors);
            return res.redirect('/authenticate/login');
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) throw err;
            if (!user) {
                req.flash('errors', {msg: 'Email hoặc mật khẩu không đúng!'});
                return res.redirect('/authenticate/login');
            }

            req.session.cookie.expires = (req.body.remember === 'on') ? 604800000 : null;

            req.logIn(user, (err) => {
                if (err) throw err;
                return res.redirect('/dashboard');
            })
        })(req, res, next);
    }),

    getLogout (req, res, next) {
        req.session.cookie.expires = null;
        req.session.passport = null;
        req.logout();
        res.redirect('/authenticate/login');
    },

    newAdmin (req, res, next) {
        let user = new User({
            email: 'admin@cms.com',
            password: '123123',
            fullname: 'Le Van Thien'
        });
        user.save((err, user) => {
            if (err) throw err;
            if (user) {
                res.redirect('/authenticate/login');
            }
        });
    },

};