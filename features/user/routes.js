const p = require('../permissions').user;
const middlewares = require('./middlewares');

module.exports = [
    {
        path: '/users',
        action: 'index',
        method: 'get',
        permission: p.USER_READ,
        authenticate: true
    },
    {
        path: '/users/create',
        action: 'create',
        method: 'get',
        permission: p.USER_CREATE,
        authenticate: true
    },
    {
        path: '/users/create',
        action: 'store',
        method: 'post',
        permission: p.USER_CREATE,
        authenticate: true
    },
    {
        path: '/users/:userId/edit',
        action: 'edit',
        method: 'get',
        permission: p.USER_UPDATE,
        middlewares: [middlewares.checkEditPermission],
        authenticate: true
    },
    {
        path: '/users/:userId/edit',
        action: 'update',
        method: 'post',
        permission: p.USER_UPDATE,
        middlewares: [middlewares.checkEditPermission],
        authenticate: true
    },
    {
        path: '/users/:userId/delete',
        action: 'destroy',
        method: 'post',
        permission: p.USER_DELETE,
        authenticate: true
    }
];