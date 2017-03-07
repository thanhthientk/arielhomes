// const p = require('../permissions').MODULE;
const feature = require('./feature');

module.exports = [
    {
        path: `/${feature.slug}`,
        action: 'index',
        method: 'get',
        //permission: p.MODULE_READ,
        authenticate: true
    },
    {
        path: `/${feature.slug}/create`,
        action: 'create',
        method: 'get',
        //permission: p.MODULE_CREATE,
        authenticate: true
    },
    {
        path: `/${feature.slug}/create`,
        action: 'store',
        method: 'post',
        //permission: p.MODULE_CREATE,
        authenticate: true
    },
    {
        path: `/${feature.slug}/:${feature.documentId}/edit`,
        action: 'edit',
        method: 'get',
        //permission: p.MODULE_UPDATE,
        authenticate: true
    },
    {
        path: `/${feature.slug}/:${feature.documentId}/edit`,
        action: 'update',
        method: 'post',
        //permission: p.MODULE_UPDATE,
        authenticate: true
    },
    {
        path: `/${feature.slug}/:${feature.documentId}/delete`,
        action: 'destroy',
        method: 'post',
        //permission: p.MODULE_DELETE,
        authenticate: true
    },
    {
        path: `/${feature.slug}/api/search`,
        action: 'search',
        method: 'get',
        //permission: p.MODULE_DELETE,
        authenticate: true
    }
];