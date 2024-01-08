var express = require("express");
var router = express.Router();
var responseData = require("../helper/responseData");
var modelProduct = require("../models/product"); // Đảm bảo import model sản phẩm
var modelCategory = require("../models/category"); // Đảm bảo import model danh mục
// const { validationResult } = require("express-validator");

router.get("/", async function (req, res, next) {
  try {
    // Lấy tất cả sản phẩm có isdelete = false và sắp xếp theo order tăng dần
    var productsAll = await modelProduct.getAll(
      { isdelete: false },
      { order: 1 }
    );
    responseData.responseReturn(res, 200, true, productsAll);
  } catch (error) {
    responseData.responseReturn(res, 500, false, "Lỗi server");
  }
});

router.post("/add", async function (req, res, next) {
  try {
    // Kiểm tra xem category có tồn tại không
    var category = await modelCategory.getByName(req.body.categoryName);
    if (!category) {
      responseData.responseReturn(res, 404, false, "Không tìm thấy category");
      return;
    }

    // Tạo mới sản phẩm
    const newProduct = await modelProduct.createProduct({
      name: req.body.name,
      price: req.body.price,
      isdelete: false,
      order: req.body.order,
      category: category._id,
    });

    responseData.responseReturn(res, 200, true, newProduct);
  } catch (error) {
    responseData.responseReturn(res, 500, false, "Lỗi server");
  }
});

router.put("/edit/:id", async function (req, res, next) {
  try {
    // Sửa thông tin sản phẩm
    var product = await modelProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    responseData.responseReturn(res, 200, true, product);
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  try {
    // Xóa sản phẩm (thay đổi isdelete thành true)
    var product = await modelProduct.findByIdAndUpdate(
      req.params.id,
      { isdelete: true },
      { new: true }
    );
    responseData.responseReturn(res, 200, true, "Xóa thành công");
  } catch (error) {
    responseData.responseReturn(res, 404, false, "Không tìm thấy sản phẩm");
  }
});

router.get("/categories", async function (req, res, next) {
  try {
    // Lấy tất cả danh mục có isdelete = false và sắp xếp theo order tăng dần
    var categories = await modelCategory.getAll(
      { isdelete: false },
      { order: 1 }
    );

    // Lấy danh sách sản phẩm cho từng danh mục
    const categoriesWithProducts = await Promise.all(
      categories.map(async (category) => {
        const products = await modelProduct.getAll(
          { category: category._id, isdelete: false },
          { order: 1 }
        );
        return { ...category.toObject(), products };
      })
    );

    responseData.responseReturn(res, 200, true, categoriesWithProducts);
  } catch (error) {
    responseData.responseReturn(res, 500, false, "Lỗi server");
  }
});

module.exports = router;
