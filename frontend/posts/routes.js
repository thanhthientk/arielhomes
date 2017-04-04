module.exports = [
    {
        path: '/rooms',
        controller: 'roomList',
        method: 'get'
    },
    {
        path: '/rooms/:slug',
        controller: 'roomDetail',
        method: 'get'
    },

    {
        path: '/blog/',
        controller: 'blog',
        method: 'get'
    },
    {
        path: '/blog/:slug',
        controller: 'blogDetail',
        method: 'get'
    },

    {
        path: '/tours/',
        controller: 'tour',
        method: 'get'
    },
    {
        path: '/tours/:slug',
        controller: 'tourDetail',
        method: 'get'
    },

    {
        path: '/services/',
        controller: 'service',
        method: 'get'
    },
    {
        path: '/services/:slug',
        controller: 'serviceDetail',
        method: 'get'
    },
];