"use strict";
const url = require('url');

const omitEmpty = require('omit-empty');
global.cleanObj = omitEmpty;

/** Convert DateRange to Separate Date
 * dd/mm/yyyy - dd/mm/yyyy to yyyy-mm-dd, yyyy-mm-dd
 * */
const convertStringToDate = function (string, hours, mins) {
    let TimeArr = string.split('/');
    let day = TimeArr[0],
        month = TimeArr[1],
        year = TimeArr[2];

    if (!hours) hours = 0;
    if (!mins) mins = 0;

    return new Date(year, month-1, day, hours, mins);
};
const separateDateRange = function (dateRange) {
    let time = dateRange.split(' - ');
    let startTime = convertStringToDate(time[0], 0, 0);
    let endTime = convertStringToDate(time[1], 23, 59);

    return {start: startTime, end: endTime}
};

/** Generate Paginate Query */
global.generatePaginateParams = function(tableColumns, setPaginateOptions, reqQuery) {
    let queries = {};

    let defaultPaginateOptions ={
        page: reqQuery.page || 1,
        limit: Number(process.env.PAGINATE_LIMIT),
        sort: {createdOn: 'desc'}
    };

    if (reqQuery.sort && reqQuery.sortBy) {
        delete defaultPaginateOptions.sort.createdOn;
        defaultPaginateOptions.sort[reqQuery.sortBy] = reqQuery.sort;
    }

    let paginateOptions = Object.assign({}, defaultPaginateOptions, setPaginateOptions);

    for (let column of tableColumns) {
        let fieldName = column.name;
        if (!reqQuery[fieldName]) continue;

        switch (column.search.type) {
            case 'text':
                queries[fieldName] = new RegExp(reqQuery[fieldName], 'i');
                break;
            case 'select':
                queries[fieldName] = reqQuery[fieldName];
                break;
            case 'date-range':
                let time = separateDateRange(reqQuery[fieldName]);
                queries[fieldName] = {$gte: time.start, $lte: time.end};
                break;
        }
    }

    return {queries, options: paginateOptions};
};

/** Generate Pagination Links */
global.generatePaginateLink = function (req, result) {
    let paginate = {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit,
        path: []
    };

    let path = url.parse(req.originalUrl).pathname;

    for (let i = 1; i <= result.pages; i++) {
        req.query.page = i;
        paginate.path.push(url.format({ pathname: path, query: req.query }));
    }

    delete req.query.page;

    return paginate;
};
