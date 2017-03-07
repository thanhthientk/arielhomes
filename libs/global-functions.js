"use strict";
const path = require('path');
const url = require('url');
const omitEmpty = require('omit-empty');
const moment = require('moment');

/** Load features.js of each module */
const loadFeaturesPath = function (type) {
    let paths = {};
    for (let feature of ALL_FEATURES) {
        if (type == 'feature') {
            paths[feature] = path.join(__dirname, '..', `features/${feature}/feature`);
        } else {
            paths[feature] = path.join(__dirname, '..', `features/${feature}/${type}/index.${type}`);
        }
    }
    return paths;
};

/** Load Feature Info */
global.loadFeature = function (feature_name) {
    let featuresPath = loadFeaturesPath('feature');

    if (featuresPath[feature_name]) {
        return require(featuresPath[feature_name]);
    } else {
        throw new Error(`Not Found Feature ${feature_name} - loadFeature function`);
    }
};

/** Load Model */
global.G_loadModel = function(modelName) {
    let modelsPath = loadFeaturesPath('model');

    if (modelsPath[modelName]) {
        return require(modelsPath[modelName]);
    } else {
        throw new Error(`Not Found Model ${modelName} - G_loadModel function`);
    }
};
/** Load Action */
global.G_loadAction = function(actionName) {
    let actionsPath = loadFeaturesPath('action');

    if (actionsPath[actionName]) {
        return require(actionsPath[actionName]);
    } else {
        throw new Error(`Not Found Action ${actionName} - G_loadAction function`);
    }
};

/** Convert DateRange to Separate Date
 * dd/mm/yyyy - dd/mm/yyyy to yyyy-mm-dd, yyyy-mm-dd
 * */
global.convertStringToDate = function (string, hours, mins) {
    let TimeArr = string.split('/');
    let day = TimeArr[0],
        month = TimeArr[1],
        year = TimeArr[2];

    if (!hours) hours = 0;
    if (!mins) mins = 0;

    return new Date(year, month-1, day, hours, mins);
};
global.separateDateRange = function (dateRange) {
    let time = dateRange.split(' - ');
    let startTime = convertStringToDate(time[0], 0, 0);
    let endTime = convertStringToDate(time[1], 23, 59);

    return {start: startTime, end: endTime}
};
/** Generate Paginate Query
 * options: object
 * */
global.generatePaginateParams = function(paginateObject, reqQuery) {
    let queries = paginateObject.queries,
        options = paginateObject.options;
    let paginateQueries = {},
        paginateOptions ={
            page: reqQuery.page || 1,
            limit: Number(process.env.PAGINATE_LIMIT),
            sort: {createdOn: 'desc'}
        };

    paginateOptions = Object.assign({}, paginateOptions, options);

    for (let i = 0; i < queries.length; i++) {
        switch (queries[i]) {
            case 'keyword':
                if (reqQuery.keyword)
                    paginateQueries.$text= {$search: reqQuery.keyword};
                break;
            case 'branch':
                if (reqQuery.branch)
                    paginateQueries.branch = reqQuery.branch;
                break;
            case 'createdBy':
                if (reqQuery.createdBy)
                    paginateQueries.createdBy = reqQuery.createdBy;
                break;
            case 'province':
                if (reqQuery.province)
                    paginateQueries.province = reqQuery.province;
                break;
            case 'customer_type':
                if (reqQuery.type)
                    paginateQueries.type = reqQuery.type;
                break;
            case 'product_category':
                if (reqQuery.category)
                    paginateQueries.category = reqQuery.category;
                break;
            case 'time':
                if (reqQuery.time) {
                    let time = separateDateRange(reqQuery.time);
                    paginateQueries.createdOn = {$gte: time.start, $lte: time.end}
                }
                break;
            case 'billId':
                if (reqQuery.billId && Number.isInteger(Number(reqQuery.billId)))
                    paginateQueries._id = Number(reqQuery.billId);
                break;
            case 'orderCode':
                if (reqQuery.orderCode)
                    paginateQueries.orderCode = reqQuery.orderCode;
                break;
        }
    }

    return {queries: paginateQueries, options: paginateOptions};
};

/** Generate Pagination Links */
global.generatePaginateLink = function (req, result) {
    let paginate = {
        total: result.total,
        page: result.page,
        pages: result.pages,
        path: []
    };

    let path = url.parse(req.originalUrl).pathname;

    for (let i = 1; i <= result.pages; i++) {
        req.query.page = i;
        paginate.path.push(url.format({ pathname: path, query: req.query }));
    }

    return paginate;
};

/** Delete Empty Properties Of Object */
global.cleanObj = omitEmpty;

/** Read Object By String Path */
global.getObjectPropertyByStringPath = function (object, propertiesString) {
    let properties = propertiesString.split('.');

    for (let i = 0; i < properties.length; i++) {
        let k = properties[i];
        console.log(k);
        if (object.hasOwnProperty(k)) {
            object = object[k];
        } else {
            return;
        }
    }
    return object;
};

/** Format Date dd/mm/yyyy */
global.moment_format = function (input, string_format) {
    return moment(input).format(string_format);
};