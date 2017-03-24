"use strict";
const info = {
    label: "Cài đặt",
    slug: "settings",
    singular_slug: "setting",
    collection: 'Setting',
    views: {
        index: "setting/views/index",
        create: "setting/views/create"
    },
    page_title: {
        index: "Cài đặt",
        create: "Thêm mới setting",
        update: "Cập nhật setting",
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
    }
};

module.exports = {
    info,
    permissions,
    routes: [
        {
            path: `/admin/${info.slug}/general`,
            controller: 'general',
            method: 'get',
            authenticate: true
        },
        {
            path: `/admin/${info.slug}/general`,
            controller: 'postGeneral',
            method: 'post',
            authenticate: true
        },
    ],
    menu: {
        icon: 'fa fa-link',
        label: info.label,
        permission: permissions.read,
        position: 90,
        activeIf: {
            module: info.slug,
            controller: ['general', 'create', 'edit']
        },
        child: [
            {
                label: 'Cài đặt chung',
                permission: permissions.read.slug,
                url: `/admin/${info.slug}/general`,
                activeIf: {
                    module: info.slug,
                    controller: ['general']
                }
            },
        ]
    }
};