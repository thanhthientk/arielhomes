"use strict";
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    _id: String,
    seq: Number
});

module.exports = mongoose.model('Counter', schema);