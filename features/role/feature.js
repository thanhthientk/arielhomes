module.exports = {
    label: "Quản lý role",
    slug: "roles",
    singular_slug: "role",
    documentId: "roleId",
    collection: "Role", // as table name
    view: {
      index: "role/view/index",
      create: "role/view/create"
    },
    page_title: {
        index: "Quản lý role",
        create: "Thêm role",
        update: "Cập nhật role",
    }
};