"use strict";

module.exports = {
    homepage: {
        title: 'Trang chủ',
        icon: 'fa fa-home',
        fieldGroups: {
            home_about: {
                title: 'Cụm giới thiệu',
                desc: 'Description for Group 1',
                image: 'home_about.jpg',
                fields: {
                    home_about_image: {
                        name: 'Hình ảnh',
                        desc: 'Kích thước w560px - h365px',
                        type: 'image'
                    },
                    home_about_title_1: {
                        name: 'Tiêu đề',
                        type: 'text',
                        multiLang: true
                    },
                    home_about_title_2: {
                        name: 'Tiêu đề 2',
                        type: 'text',
                        multiLang: true
                    },
                    home_about_content: {
                        name: 'Nội dung',
                        type: 'textarea',
                        multiLang: true
                    },
                    home_about_link: {
                        name: 'Liên kết',
                        type: 'text',
                    }
                }
            },
            home_gallery: {
                title: 'Gallery',
                image: 'home_gallery.jpg',
                fields: {
                    home_gallery_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    home_gallery_title_2: {
                        name: 'Tiêu đề 2',
                        type: 'text',
                        multiLang: true
                    },
                    home_gallery: {
                        name: 'Hình ảnh',
                        type: 'galleryId',
                        query: 'gallery'
                    }
                }
            },
            footer: {
                title: 'Footer',
                image: 'footer.jpg',
                fields: {
                    footer_about: {
                        name: 'Miêu tả ngắn',
                        type: 'textarea',
                        multiLang: true
                    },
                    footer_newsletter: {
                        name: 'Newsletter',
                        type: 'text',
                        multiLang: true
                    },
                    footer_sign: {
                        name: 'Chân trang',
                        type: 'text',
                        multiLang: true
                    }
                }
            }
        }
    },
    room: {
        title: 'Phòng',
        icon: 'fa fa-book',
        fieldGroups: {
            index: {
                title: 'Phòng',
                fields: {
                    rooms_image: {
                        name: 'Ảnh bìa trang danh sách phòng',
                        type: 'image'
                    },
                    rooms_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    rooms_title_2: {
                        name: 'Tiêu đề 2',
                        type: 'text',
                        multiLang: true
                    },
                    rooms_title_3: {
                        name: 'Tiêu đề 3',
                        type: 'text',
                        multiLang: true
                    },
                    rooms_desc: {
                        name: 'Miêu tả ngắn',
                        type: 'textarea',
                        multiLang: true
                    }
                }
            }
        }
    },
    about: {
        title: 'Giới thiệu',
        icon: 'fa fa-file-text',
        fieldGroups: {
            about: {
                title: 'Tiêu đề',
                fields: {
                    about_image: {
                        name: 'Ảnh bìa',
                        type: 'image'
                    },
                    about_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    about_title_2: {
                        name: 'Tiêu đề 2',
                        type: 'text',
                        multiLang: true
                    },
                    about_title_3: {
                        name: 'Tiêu đề 3',
                        type: 'text',
                        multiLang: true
                    },
                    about_title_4: {
                        name: 'Tiêu đề 4',
                        type: 'text',
                        multiLang: true
                    },
                    about_desc: {
                        name: 'Miêu tả ngắn',
                        type: 'textarea',
                        multiLang: true
                    },
                }
            },
            block1: {
                title: 'Section 1',
                fields: {
                    about_section_1_image: {
                        name: 'Ảnh bìa',
                        type: 'image'
                    },
                    about_section_1_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    about_section_1_title_2: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    about_section_1_content: {
                        name: 'Nội dung',
                        type: 'textarea',
                        multiLang: true
                    },
                }
            },
            block2: {
                title: 'Section 2',
                fields: {
                    about_section_2_image: {
                        name: 'Ảnh bìa',
                        type: 'image'
                    },
                    about_section_2_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    about_section_2_title_2: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    about_section_2_content: {
                        name: 'Nội dung',
                        type: 'textarea',
                        multiLang: true
                    },
                }
            },
            block3: {
                title: 'Section Dịch vụ',
                fields: {
                    about_section_service_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    about_section_service_title_2: {
                        name: 'Tiêu đề 2',
                        type: 'text',
                        multiLang: true
                    },
                }
            }
        }
    },
    tour: {
        title: 'Tour',
        icon: 'fa fa-file-text',
        fieldGroups: {
            tour: {
                title: 'Tour',
                fields: {
                    tour_image: {
                        name: 'Ảnh bìa',
                        type: 'image'
                    },
                    tour_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    tour_title_2: {
                        name: 'Tiêu đề 2',
                        type: 'text',
                        multiLang: true
                    },
                    tour_desc: {
                        name: 'Miêu tả ngắn',
                        type: 'textarea',
                        multiLang: true
                    },
                }
            }
        }
    },
    gallery: {
        title: 'Gallery',
        icon: 'fa fa-file-text',
        fieldGroups: {
            gallery: {
                title: 'Gallery',
                fields: {
                    gallery_image: {
                        name: 'Ảnh bìa',
                        type: 'image'
                    },
                    gallery_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    gallery_title_2: {
                        name: 'Tiêu đề 2',
                        type: 'text',
                        multiLang: true
                    }
                }
            }
        }
    },
    service: {
        title: 'Dịch vụ',
        icon: 'fa fa-file-text',
        fieldGroups: {
            gallery: {
                title: 'Dịch vụ',
                fields: {
                    service_image: {
                        name: 'Ảnh bìa',
                        type: 'image'
                    },
                    service_title_1: {
                        name: 'Tiêu đề 1',
                        type: 'text',
                        multiLang: true
                    },
                    service_title_2: {
                        name: 'Tiêu đề 2',
                        type: 'text',
                        multiLang: true
                    }
                }
            }
        }
    },
    translations: {
        title: 'Dịch text',
        icon: 'fa fa-globe',
        fieldGroups: {
            group1: {
                title: 'Button, link..',
                fields: {
                    tr_home: {
                        name: 'Home',
                        type: 'text',
                        multiLang: true
                    },
                    tr_blog: {
                        name: 'Blog',
                        type: 'text',
                        multiLang: true
                    },
                    tr_about_us: {
                        name: 'About Us',
                        type: 'text',
                        multiLang: true
                    },
                    tr_home_booking_form_title: {
                        name: 'Find a Room',
                        desc: 'Text form booking ở trang chủ',
                        type: 'text',
                        multiLang: true
                    },
                    tr_home_booking_form_desc: {
                        name: 'When you want to be our guest?',
                        desc: 'Text form booking ở trang chủ',
                        type: 'text',
                        multiLang: true
                    },
                    tr_select_room: {
                        name: 'Select room',
                        type: 'text',
                        multiLang: true
                    },
                    tr_booking: {
                        name: 'Booking',
                        type: 'text',
                        multiLang: true
                    },
                    tr_checkin: {
                        name: 'Check in',
                        type: 'text',
                        multiLang: true
                    },
                    tr_checkout: {
                        name: 'Check out',
                        type: 'text',
                        multiLang: true
                    },
                    tr_adult: {
                        name: 'Adult',
                        type: 'text',
                        multiLang: true
                    },
                    tr_child: {
                        name: 'Child',
                        type: 'text',
                        multiLang: true
                    },
                    tr_book_now: {
                        name: 'Book now',
                        type: 'text',
                        multiLang: true
                    },
                    tr_name: {
                        name: 'Your name',
                        type: 'text',
                        multiLang: true
                    },
                    tr_phone: {
                        name: 'Your Phone',
                        type: 'text',
                        multiLang: true
                    },
                    tr_message: {
                        name: 'Your message',
                        type: 'text',
                        multiLang: true
                    },
                    tr_more: {
                        name: 'More',
                        type: 'text',
                        multiLang: true
                    },
                    tr_newsletter: {
                        name: 'Newsletter',
                        type: 'text',
                        multiLang: true
                    },
                    tr_latest_posts: {
                        name: 'Latest Posts',
                        type: 'text',
                        multiLang: true
                    },
                    tr_contact_us: {
                        name: 'Contact Us',
                        type: 'text',
                        multiLang: true
                    },
                    tr_no_post: {
                        name: 'No Post',
                        type: 'text',
                        multiLang: true
                    },
                    tr_categories: {
                        name: 'Category',
                        type: 'text',
                        multiLang: true
                    },
                }
            },
            room: {
                title: 'Room',
                fields: {
                    tr_room_price_from: {
                        name: 'Starting from',
                        type: 'text',
                        multiLang: true
                    },
                    tr_room_breakfast: {
                        name: 'Breakfast',
                        type: 'text',
                        multiLang: true
                    },
                    tr_room_room_size: {
                        name: 'Room Size',
                        type: 'text',
                        multiLang: true
                    },
                    tr_room_max_people: {
                        name: 'Max People',
                        type: 'text',
                        multiLang: true
                    },
                    tr_room_view: {
                        name: 'View',
                        type: 'text',
                        multiLang: true
                    },
                    tr_room_facilities: {
                        name: 'Facilities',
                        type: 'text',
                        multiLang: true
                    }
                }
            }
        }
    },
    general: {
        title: 'Tùy chỉnh chung',
        icon: 'fa fa-cog',
        fieldGroups: {
            contact: {
                title: 'Thông tin liên hệ',
                fields: {
                    footer_address: {
                        name: 'Địa chỉ',
                        type: 'text',
                        multiLang: true
                    },
                    footer_phone: {
                        name: 'Số điện thoại',
                        type: 'text'
                    },
                    footer_email: {
                        name: 'Email',
                        type: 'text'
                    },
                    fb: {
                        name: 'Facebook',
                        desc: 'Liên kết đến trang Facebook',
                        type: 'text'
                    },
                    gg: {
                        name: 'Google +',
                        desc: 'Liên kết đến Google Plus',
                        type: 'text'
                    }
                }
            }
        }
    }
};