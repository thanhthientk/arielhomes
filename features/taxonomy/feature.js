module.exports = {
    label: "Taxonomies",
    slug: "taxonomies",
    singular_slug: "taxonomy",
    documentId: "taxonomyId",
    collection: "Taxonomy", // as table name
    view: {
      index: "taxonomy/view/index",
      create: "taxonomy/view/create"
    },
    page_title: {
        index: "Quản lý taxonomy",
        create: "Thêm taxonomy",
        update: "Cập nhật taxonomy",
    }
};