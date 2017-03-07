module.exports = {
    label: "Module Name",
    slug: "_modules",
    singular_slug: "_module",
    documentId: "_moduleId",
    collection: "_Module", // as table name
    view: {
      index: "_module/view/index",
      create: "_module/view/create"
    },
    page_title: {
        index: "Quản lý Module",
        create: "Thêm Module",
        update: "Cập nhật Module",
    }
};