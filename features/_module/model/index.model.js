"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const feature = require('../feature');

const schema = new mongoose.Schema({
    name: {type: String, required: true},
    createdBy: {type: String, ref: 'User', required: true},
    createdOn: {type: Date, default: Date.now}
});

//Paginate Plugin
schema.plugin(mongoosePaginate);

// Index

module.exports = mongoose.model(feature.collection, schema);