const systemConfig = require("../../config/system");
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productsCategory = require("./product-category.route");
const roles = require("./roles.route");
const restored = require("./restored.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
  app.use(PATH_ADMIN + "/products", productRoutes);
  app.use(PATH_ADMIN + "/products-category", productsCategory);
  app.use(PATH_ADMIN + "/roles", roles);
  app.use(PATH_ADMIN + "/restored", restored);
};
