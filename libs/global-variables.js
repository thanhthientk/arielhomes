"use strict";
const path = require('path');
//const moment = require('moment');

global.ROOT_PATH = path.join(__dirname, '..');
global.UPLOAD_PATH = path.join(__dirname, '..', 'public/uploads');
global.BASEURL = 'http://localhost:5000';

global.ALL_FEATURES = process.env.FEATURES.split(',');