"use strict";

const permissions = {
    read: {
        title: 'Quản lý người dùng',
        slug: 'user_read'
    },
    create: {
        title: 'Thêm người dùng mới',
        slug: 'user_create'
    },
    update: {
        title: 'Cập nhật người dùng',
        slug: 'user_update'
    },
    destroy: {
        title: 'Cập nhật người dùng',
        slug: 'user_delete'
    }
};

module.exports = {
    info: {
        label: "Người dùng",
        slug: "users",
        singular_slug: "user",
        views: {
            index: "users/views/index",
            create: "users/views/create"
        },
        page_title: {
            index: "Người dùng",
            create: "Thêm mới",
            update: "Cập nhật",
        }
    },
    permissions,
    routes: [
        {
            path: '/admin/login',
            controller: 'getLogin',
            method: 'get',
        },
        {
            path: '/admin/login',
            controller: 'postLogin',
            method: 'post',
        },
        {
            path: '/admin/logout',
            controller: 'getLogout',
            method: 'get',
            authenticate: true
        },
        {
            path: '/admin/users',
            controller: 'index',
            method: 'get',
            permission: permissions.read.slug,
            authenticate: true
        },
        {
            path: '/admin/users/create',
            controller: 'create',
            method: 'get',
            permission: permissions.create.slug,
            authenticate: true
        },
        {
            path: '/admin/users/create',
            controller: 'store',
            method: 'post',
            permission: permissions.create.slug,
            authenticate: true
        },
        {
            path: '/admin/users/:id/edit',
            controller: 'edit',
            method: 'get',
            permission: permissions.update.slug,
            authenticate: true
        },
        {
            path: '/admin/users/:id/edit',
            controller: 'update',
            method: 'post',
            permission: permissions.update.slug,
            authenticate: true
        },
        {
            path: '/admin/users/destroy',
            controller: 'destroy',
            method: 'post',
            permission: permissions.destroy.slug,
            authenticate: true
        }
    ]
};