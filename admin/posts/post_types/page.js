"use strict";
module.exports = {
    info: {
        label: 'Pages',
        slug: 'page'
    },
    menu: {
        icon: 'fa fa-link',
        label: 'Pages',
        position: 3,
        activeIf: {
            module: ['posts', 'taxonomies'],
            controller: 'all',
            params: {
                reqParam: 'post_type',
                value: 'page'
            }
        },
        child: [
            {
                label: 'Danh sách',
                url: `/admin/posts?post_type=page`,
                activeIf: {
                    module: 'posts',
                    controller: ['index']
                }
            },
            {
                label: 'Thêm mới',
                url: `/admin/posts/create?post_type=page`,
                activeIf: {
                    module: 'posts',
                    controller: ['create']
                }
            }
        ]
    },
    fields: ['name', 'content', 'description', 'image'],
    customFields: {},
    tableStructure: {},
};