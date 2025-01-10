const productRouters = require("./product.router");
const homeRouters = require("./home.router");
const searchRouters = require("./search.router");
const cartRouters = require("./cart.router");
const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cart);
  app.use("/", homeRouters);
  app.use("/products", productRouters);
  app.use("/search", searchRouters);
  app.use("/cart", cartRouters);
};
