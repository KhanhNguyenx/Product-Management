const productsHelper = require("../../helpers/products");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productCategoryHelper = require("../../helpers/product-category");
// [GET]/products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  res.render("client/pages/products/index.pug", {
    pageTitle: "Trang danh sách sản phẩm",
    products: newProducts,
  });
};
// [GET]/products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active",
    };
    const product = await Product.findOne(find);

    res.render("client/pages/products/detail.pug", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại sản phẩm`);
    res.redirect(`/products`);
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  const category = await ProductCategory.findOne({
    slug: slugCategory,
    status: "active",
    deleted: false,
  });

  const listSubCategory = await productCategoryHelper.getSubCategory(
    category.id
  );

  const listSubCategoryId = listSubCategory.map((item) => item.id);

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);

  console.log(products);

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts,
  });
};
