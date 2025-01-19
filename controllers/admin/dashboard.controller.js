const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model")
const User = require("../../models/user.model")
const Account = require("../../models/account.model")
// [GET] /admin/dashboard/
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  // Product
  statistic.product.total = await Product.countDocuments({
    deleted: false
  });
  statistic.product.active = await Product.countDocuments({
    status: "active",
    deleted: false
  });
  statistic.product.inactive = await Product.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End Product

  // ProductCategory
  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false
  });
  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    status: "active",
    deleted: false
  });
  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End ProductCategory
  
  // User
  statistic.user.total = await User.countDocuments({
    deleted: false
  });
  statistic.user.active = await User.countDocuments({
    status: "active",
    deleted: false
  });
  statistic.user.inactive = await User.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End User

  // Account
  statistic.account.total = await Account.countDocuments({
    deleted: false
  });
  statistic.account.active = await Account.countDocuments({
    status: "active",
    deleted: false
  });
  statistic.account.inactive = await Account.countDocuments({
    status: "inactive",
    deleted: false
  });
  // End Account

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic
  });
}