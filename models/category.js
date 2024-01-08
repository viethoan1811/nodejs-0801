var CategorySchema = require("../schema/category");

module.exports = {
  getAll: function (query) {
    var sort = {};
    var search = {};

    if (query.sort) {
      sort[query.sort] = query.sort[0] === "-" ? "desc" : "asc";
    }

    if (query.key) {
      search.name = new RegExp(query.key, "i");
    }

    var limit = parseInt(query.limit) || 10;
    var page = parseInt(query.page) || 1;
    var skip = (page - 1) * limit;

    return CategorySchema.find(search)
      .select("name order isdelete")
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .exec();
  },

  getOne: function (id) {
    return CategorySchema.findById(id);
  },

  createCategory: function (category) {
    return new CategorySchema(category).save();
  },

  updateCategory: function (id, updateData) {
    return CategorySchema.findByIdAndUpdate(id, updateData, { new: true });
  },

  deleteCategory: function (id) {
    return CategorySchema.findByIdAndDelete(id);
  },
};
