"use strict";
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const roleSchema = new mongoose.Schema({
    name: String,
    description: String,
    permissions: Array,
    createdBy: {type: String, ref: 'User'},
    createdOn: {type: Date, default: Date.now}
});

//Paginate Plugin
roleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Role', roleSchema);