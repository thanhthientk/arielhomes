"use strict";
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'admin@arielhomes.vn',
        pass: '8c1VNd3HH0e1'
    }
});

module.exports = {
    resetPassword: function (html, email) {
        let mailOptions = {
            from: 'Arielhomes Hotel <admin@arielhomes.vn>',
            to: email,
            subject: 'Arielhomes.vn - Khôi phục mật khẩu',
            html
        };
        return new Promise(function (res, rej) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return rej(error);

                res(info);
            });
        });
    },

    sendConfrimForm: function (contact) {
        let html = '';

        switch (contact.type) {
            case 'newsletter':
                html = `<h2>Bạn vừa đăng ký nhận thông tin từ website Arielhomes.vn</h2>`;
                break;
            case 'booking':
                html = `<h2>Bạn vừa đăng ký Phòng từ website Arielhomes.vn</h2>
                        <h3>Thông tin phòng của bạn:</h3>
                        <p>Loại phòng: ${contact.fields.room}</p>
                        <p>Ngày đến: ${contact.fields.start}</p>
                        <p>Ngày đi: ${contact.fields.end}</p>
                        <p>Người lớn: ${contact.fields.adult}</p>
                        <p>Trẻ em: ${contact.fields.child}</p>
                        <p>Tên của bạn: ${contact.fields.name}</p>
                        <p>Lời nhắn: ${contact.fields.message}</p>`;
                break;
            case 'contact':
                html = `<h2>Chúng tôi đã nhận được thông tin liên hệ của bạn</h2>
                                <h3>Chúng tôi sẽ liên hệ lại bạn trong thời gian sớm nhất</h3>`;
                break;
            case 'tour':
                html = `<h2>Bạn vừa đăng ký Tour website Arielhomes.vn</h2>
                        <h3>Thông tin Tour của bạn:</h3>
                        <p>Tên tour: ${contact.fields.tour}</p>
                        <p>Tên của bạn: ${contact.fields.name}</p>`;
                break;
        }

        let mailOptions = {
            from: 'Arielhomes Hotel <admin@arielhomes.vn>',
            to: contact.fields.email,
            subject: 'Arielhomes.vn - Xác nhận thông tin',
            html
        };
        return new Promise(function (res, rej) {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return rej(error);

                res(info);
            });
        });
    }
};