const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  const categoryProducts = await ProductCategory.find({
    deleted: false,
  });

  const newCategoryProducts = createTreeHelper(categoryProducts);

  res.locals.layoutProductsCategory = newCategoryProducts;

  next();
}