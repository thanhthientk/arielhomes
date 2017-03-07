const p = require('../permissions').role;
const feature = require('./feature');

module.exports = [
    {
        path: `/${feature.slug}`,
        action: 'index',
        method: 'get',
        permission: p.ROLE_READ,
        authenticate: true
    },
    {
        path: `/${feature.slug}/create`,
        action: 'create',
        method: 'get',
        permission: p.ROLE_CREATE,
        authenticate: true
    },
    {
        path: `/${feature.slug}/create`,
        action: 'store',
        method: 'post',
        permission: p.ROLE_CREATE,
        authenticate: true
    },
    {
        path: `/${feature.slug}/:${feature.documentId}/edit`,
        action: 'edit',
        method: 'get',
        permission: p.ROLE_UPDATE,
        authenticate: true
    },
    {
        path: `/${feature.slug}/:${feature.documentId}/edit`,
        action: 'update',
        method: 'post',
        permission: p.ROLE_UPDATE,
        authenticate: true
    },
    {
        path: '/roles/:roleId/delete',
        action: 'destroy',
        method: 'post',
        permission: p.ROLE_DELETE,
        authenticate: true
    }
];