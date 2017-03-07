module.exports = {
    label: "Nhân sự",
    slug: "users",
    singular_slug: "user",
    documentId: "userId",
    collection: "User", // as table name
    view: {
      index: "user/view/index",
      create: "user/view/create"
    },
    page_title: {
        index: "Quản lý Nhân sự",
        create: "Thêm Nhân sự Mới",
        update: "Cập nhật Nhân sự",
    }
};