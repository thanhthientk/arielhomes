"use strict";

const generateTable = function (users = [{}], categories = [{}]) {
    return [
        {
            displayType: 'checkbox',
            width: '3%',
        },
        {
            label: 'Name',
            name: 'name',
            displayType: 'title',
            headSort: true,
            width: '25%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Alias',
            name: 'slug',
            displayType: 'title',
            headSort: true,
            width: '18%',
            search: {
                type: 'text'
            }
        },
        {
            label: 'Categories',
            name: 'categories',
            access: 'name',
            displayType: 'collections',
            class: 'label bg-blue mr3',
            headSort: true,
            width: '17%',
            search: {
                type: 'select',
                fieldDisplay: 'name',
                items: categories
            }
        },
        {
            label: 'Created by',
            name: 'createdBy',
            access: 'createdBy.fullname',
            displayType: 'sort',
            headSort: true,
            width: '14%',
            class: 'label bg-blue',
            search: {
                type: 'select',
                fieldDisplay: 'fullname',
                items: users
            }
        },
        {
            label: 'Status',
            name: 'status',
            displayType: 'label',
            headSort: true,
            width: '10%',
            itemsInfo: {
                show: {
                    class: 'bg-green',
                    text: 'Hien thi'
                },
                hide: {
                    class: 'bg-gray',
                    text: 'An'
                }
            },
            search: {
                type: 'select',
                fieldDisplay: 'name',
                items: [
                    {id: 'show', name: 'Hiển thị'},
                    {id: 'hide', name: 'Ẩn'}
                ]
            }
        },
        {
            label: 'Created on',
            name: 'createdOn',
            displayType: 'time',
            headSort: true,
            width: '10%',
            search: {
                type: 'date-range'
            }
        }
    ];
};

module.exports = {
    info: {
        label: 'Post',
        slug: 'post'
    },
    fields: ['name', 'content', 'description', 'image'],
    customFields: {},
    taxonomies: {
        category: {
            label: 'Categories',
            type: 'category',
            module: 'posts',
            displayInCreateForm: true
        }
    },
    tableStructure: {},
    menu: {
        icon: 'fa fa-link',
        label: 'Post',
        position: 3,
        activeIf: {
            module: ['posts', 'taxonomies'],
            controller: 'all',
            params: {
                reqParam: 'post_type',
                value: 'post'
            }
        },
        child: [
            {
                label: 'Danh sách',
                url: `/admin/posts?post_type=post`,
                activeIf: {
                    module: 'posts',
                    controller: ['index']
                }
            },
            {
                label: 'Thêm mới',
                url: `/admin/posts/create?post_type=post`,
                activeIf: {
                    module: 'posts',
                    controller: ['create']
                }
            },
            {
                label: 'Danh mục',
                url: `/admin/taxonomies?module=posts&type=category&post_type=post`,
                activeIf: {
                    module: 'taxonomies',
                    controller: 'all',
                    params: {
                        reqParam: 'type',
                        value: 'category'
                    }
                }
            }
        ]
    },
};