"use strict";

module.exports = {
    info: {
        label: "Dashboard",
        slug: "dashboard",
        view: {
            index: "dashboard/view/index",
        },
        page_title: {
            index: "Dashboard"
        }
    },
    routes: [
        {
            path: '/admin',
            controller: 'index',
            method: 'get',
            authenticate: true
        }
    ]
};