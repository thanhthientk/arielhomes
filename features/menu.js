module.exports = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        permission: 'dashboard',
        icon: 'ion ion-android-color-palette'
    },
    {
        title: 'Posts',
        href: '/admin/posts',
        icon: 'ion ion-ios-compose',
        subs: [
            {
                title: 'All Posts',
                href: '/admin/posts?post_type=post',
                permission: 'post_read',
                match: ['posts?post_type=post', 'edit?post_type=post']
            },
            {
                title: 'Add New',
                href: '/admin/posts/create?post_type=post',
                permission: 'post_create',
            },
            {
                title: 'Categories',
                href: '/admin/terms?type=category',
                permission: 'post_terms',
                match: 'type=category'
            },
            {
                title: 'Tags',
                href: '/admin/terms?type=tag',
                permission: 'post_terms',
                match: 'type=tag'
            }
        ]
    },
    {
        title: 'Pages',
        href: '/admin/posts?post_type=page',
        icon: 'ion ion-document-text',
        subs: [
            {
                title: 'All pages',
                href: '/admin/posts?post_type=page',
                permission: 'post_read',
                match: ['posts?post_type=page', 'edit?post_type=page']
            },
            {
                title: 'Add New',
                href: '/admin/posts/create?post_type=page',
                permission: 'post_create'
            }
        ]
    },
    {
        title: 'Media Library',
        href: '/admin/upload',
        permission: 'media_read',
        icon: 'ion ion-android-image'
    },
    {
        title: 'Users',
        href: '/admin/users',
        icon: 'ion ion-android-people',
        subs: [
            {
                title: 'All Users',
                href: '/admin/users',
                permission: 'user_read',
                match: true
            },
            {
                title: 'Add New',
                href: '/admin/users/create',
                permission: 'user_create'
            },
            {
                title: 'Your Profile',
                href: '/admin/users/profile'
            },
            {
                title: 'Permissions',
                href: '/admin/permissions',
                permission: 'permission_read',
                match: true
            }
        ]
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: 'ion ion-gear-a',
        subs: [
            {
                title: 'General Settings',
                href: '/admin/settings/general',
                permission: 'setting'
            }
        ]
    },
    {
        title: 'Custom Post Type',
        href: '/admin/custom-post',
        icon: 'ion ion-ios-compose',
        match: true
    }
];