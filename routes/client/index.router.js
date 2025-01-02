const productRouters = require("./product.router");
const homeRouters = require("./home.router");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use("/", homeRouters);
  app.use("/products", productRouters);
};
