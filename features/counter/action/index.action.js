"use strict";

const Counter = require('../model/index.model');

module.exports = {

    getNextBillNumber: function () {
        return new Promise((resolve, reject) => {
            Counter.findById('billId')
                .then(result => {
                    if (!result) {
                        let err = new Error('Không khởi tạo được mã số hóa đơn!');
                        return reject(err);
                    }
                    resolve(result.seq);
                })
                .catch((err) => {
                    reject(err);
                })
        })
    },

    incrementBillNumber: function () {
        return new Promise((resolve, reject) => {
            Counter.findByIdAndUpdate('billId',{
                $inc: { seq: 1 }
            }).then(result => {
                if (!result) {
                    let err = new Error('Không khởi tạo được mã số hóa đơn!');
                    return reject(err);
                }
                resolve(result.seq);
            }).catch((err) => {
                    reject(err);
                })
        })
    }

};