var mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isdelete: { type: Boolean, default: false },
  order: { type: Number, required: true },
});

schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });

module.exports = mongoose.model("product", schema);
