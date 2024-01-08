var express = require("express");
var router = express.Router();
var responseData = require("../helper/responseData");
var modelCategory = require("../models/category"); // Thay đổi đường dẫn model
var validate = require("../validates/category"); // Thay đổi đường dẫn validate
const { validationResult } = require("express-validator");

router.get("/", async function (req, res, next) {
  console.log(req.query);
  var categoriesAll = await modelCategory.getAll(req.query); // Thay đổi từ modelUser sang modelCategory
  responseData.responseReturn(res, 200, true, categoriesAll);
});

router.get("/:id", async function (req, res, next) {
  try {
    var category = await modelCategory.getOne(req.params.id);
    responseData.responseReturn(res, 200, true, category);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy category");
  }
});

router.post("/add", validate.validator(), async function (req, res, next) {
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    responseData.responseReturn(
      res,
      400,
      false,
      errors.array().map((error) => error.msg)
    );
    return;
  }
  var category = await modelCategory.getByName(req.body.name); // Thay đổi từ modelUser sang modelCategory
  if (category) {
    responseData.responseReturn(res, 404, false, "Category đã tồn tại");
  } else {
    const newCategory = await modelCategory.createCategory({
      name: req.body.name,
      order: req.body.order,
      isdelete: false,
    });

    responseData.responseReturn(res, 200, true, newCategory);
  }
});

router.put("/edit/:id", async function (req, res, next) {
  try {
    var category = await modelCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    responseData.responseReturn(res, 200, true, category);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy category");
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  try {
    var category = await modelCategory.findByIdAndDelete(req.params.id);
    responseData.responseReturn(res, 200, true, "Xóa thành công");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy category");
  }
});

module.exports = router;
