const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
// [GET]
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let Products = [];
  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    Products = await Product.find({
      title: keywordRegex,
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });
  }

  newProducts = productHelper.priceNewProducts(Products);
  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
