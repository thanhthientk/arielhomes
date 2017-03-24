"use strict";
const info = {
    label: "Bài viết",
    slug: "posts",
    singular_slug: "post",
    collection: 'Post',
    views: {
        index: "posts/views/index",
        create: "posts/views/create"
    },
    page_title: {
        index: "Bài viết",
        create: "Thêm bài viết mới",
        update: "Cập nhật bài viết",
    }
};
const permissions = {
    read: {
        title: `Quản lý ${info.label}`,
        slug: `${info.singular_slug}_read`
    },
    create: {
        title: `Thêm ${info.label} mới`,
        slug: `${info.singular_slug}_create`
    },
    update: {
        title: `Cập nhật ${info.label}`,
        slug: `${info.singular_slug}_update`
    },
    destroy: {
        title: `Xóa ${info.label}`,
        slug: `${info.singular_slug}_delete`
    },
    category: {
        title: 'Quản lý danh mục bài viết',
        slug: 'post_category'
    },
    tag: {
        title: 'Quản lý tag',
        slug: 'post_tag'
    }
};

const postsMiddleware = function () {
    return function (req, res, next) {
        let postType = req.query['post_type'] || req.body['post_type'];
        if (!postType) return res.redirect('/admin/posts?post_type=post');

        res.locals.postTypeInfo = require(`./post_types/${postType}`);
        next();
    }
};

//Get menu
let postTypes = ['post', 'page'];
let menu = [];
for (let postType of postTypes) {
    menu.push(require(`./post_types/${postType}`).menu);
}

module.exports = {
    info,
    permissions,
    routes: [
        {
            path: `/admin/${info.slug}`,
            controller: 'index',
            method: 'get',
            permission: permissions.read.slug,
            authenticate: true,
            middlewares: [postsMiddleware()]
        },
        {
            path: `/admin/${info.slug}/create`,
            controller: 'create',
            method: 'get',
            permission: permissions.create.slug,
            authenticate: true,
            middlewares: [postsMiddleware()]
        },
        {
            path: `/admin/${info.slug}/create`,
            controller: 'store',
            method: 'post',
            permission: permissions.create.slug,
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/:id/edit`,
            controller: 'edit',
            method: 'get',
            permission: permissions.update.slug,
            authenticate: true,
            middlewares: [postsMiddleware()]
        },
        {
            path: `/admin/${info.slug}/:id/edit`,
            controller: 'update',
            method: 'post',
            permission: permissions.update.slug,
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/delete`,
            controller: 'destroy',
            method: 'post',
            permission: permissions.destroy.slug,
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/api/changeSlug`,
            controller: 'apiChangeSlug',
            method: 'post',
            permission: permissions.update.slug,
            authenticate: true,
            csrf: false
        }
    ],
    menu: menu
};