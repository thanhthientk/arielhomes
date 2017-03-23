"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const info = require('../index').info;

const schema = new mongoose.Schema({
    slug: {type: String, unique: true},
    name: {type: String, required: true},
    content: String,
    description: String,
    categories: [{type: String, ref: 'Taxonomy'}],
    tags: [{type: String, ref: 'Taxonomy'}],
    image: {path: String, ext: String},
    status: {type: String, default: 'show'},
    createdBy: {type: String, ref: 'User', required: true},
    createdOn: {type: Date, default: Date.now}
});

//Paginate Plugin
schema.plugin(mongoosePaginate);

// Index


module.exports = mongoose.model(info.collection, schema);