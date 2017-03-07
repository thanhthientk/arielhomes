"use strict";
const bcrypt = require('bcrypt-nodejs');

exports.hash = function (input) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err);
            bcrypt.hash(input, salt, null, (err, hash) => {
                if (err) reject(err);

                resolve(hash);
            });
        });
    });
};

exports.compare = function(input, hash) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(input, hash, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};