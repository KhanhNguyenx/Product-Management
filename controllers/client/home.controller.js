const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
// [GET]
module.exports.index = async (req, res) => {
  //Lấy sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });
  const newProducts = productsHelper.priceNewProducts(productsFeatured);

  //Lấy sản phẩm mới nhất 
  const latestProducts = await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" }).limit(8);
  const newLatestProducts = productsHelper.priceNewProducts(latestProducts);

  res.render("client/pages/home/index.pug", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts,
    latestProducts: newLatestProducts,
  });
};
