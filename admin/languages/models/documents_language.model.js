"use strict";
"use strict";
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: {type: String},
    documents: {},
    createdOn: {type: Date, default: Date.now}
});

module.exports = mongoose.model('DocumentsLanguage', schema);