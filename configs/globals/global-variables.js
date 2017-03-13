"use strict";
const path = require('path');
const fs = require('fs');

global.ALL_MODULES = process.env.MODULES.split(',');
global.__root = path.join(__dirname, '../..');
global.__libs = path.join(__root, 'libraries');

let _app = { model: {} };
for (let module of ALL_MODULES) {
    let modulePath = path.join(__root, `admin/${module}/models/index.model.js`);
    if (fs.existsSync(modulePath)) {
        let moduleSlug = require(path.join(__root, `admin/${module}`)).info.singular_slug;
        _app.model[moduleSlug] = require(path.join(__root, `admin/${module}/models/index.model.js`));
    }
}

global._app = _app;