const { body } = require("express-validator");
const message = require("../helper/message");
const util = require("util");

var options = {
  name: {
    min: 6,
    max: 80,
  },
  order: {
    min: 1, // Số tối thiểu cho trường order
  },
};

module.exports = {
  validator: function () {
    return [
      body(
        "name",
        util.format(
          message.size_string_message,
          "name",
          options.name.min,
          options.name.max
        )
      ).isLength(options.name),
      body(
        "order",
        util.format(message.min_value_message, "order", options.order.min)
      ).isInt({ min: options.order.min }),
    ];
  },
};
