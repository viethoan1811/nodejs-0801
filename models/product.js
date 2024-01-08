var ProductSchema = require("../schema/product");

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

    return ProductSchema.find(search)
      .select("name price isdelete order category")
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .exec();
  },

  getOne: function (id) {
    return ProductSchema.findById(id);
  },

  createProduct: function (product) {
    return new ProductSchema(product).save();
  },

  updateProduct: function (id, updateData) {
    return ProductSchema.findByIdAndUpdate(id, updateData, { new: true });
  },

  deleteProduct: function (id) {
    return ProductSchema.findByIdAndDelete(id);
  },
};
