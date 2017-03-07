"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const feature = require('../feature');

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    type: {type: String, require: true},
    module: {type: String, require: true},
    status: {type: Boolean, default: true},
    description: String,
    icon: String,
    link: String,
    createdBy: {type: String, ref: 'User', required: true},
    createdOn: {type: Date, default: Date.now}
}, {strict: false});

//Paginate Plugin
schema.plugin(mongoosePaginate);

// Index

module.exports = mongoose.model(feature.collection, schema);