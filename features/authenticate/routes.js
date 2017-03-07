module.exports = [
    {
        path: '/authenticate/login',
        action: 'getLogin',
        method: 'get'
    },
    {
        path: '/authenticate/login',
        action: 'postLogin',
        method: 'post'
    },
    {
        path: '/authenticate/logout',
        action: 'getLogout',
        method: 'get'
    },
    {
        path: '/authenticate/new',
        action: 'newAdmin',
        method: 'get'
    }
];