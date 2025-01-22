const productRouters = require("./product.router");
const homeRouters = require("./home.router");
const searchRouters = require("./search.router");
const cartRouters = require("./cart.router");
const checkoutRouters = require("./checkout.router");
const userRouters = require("./user.router");
const chatRouters = require("./chat.router");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");
const settingsMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cart);
  app.use(userMiddleware.infoUser);
  app.use(settingsMiddleware.settingGeneral);

  app.use("/", homeRouters);
  app.use("/products", productRouters);
  app.use("/search", searchRouters);
  app.use("/cart", cartRouters);
  app.use("/checkout", checkoutRouters);
  app.use("/user", userRouters);
  app.use("/chat", authMiddleware.requireAuth, chatRouters);
};
