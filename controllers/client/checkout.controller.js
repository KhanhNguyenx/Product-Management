const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const productsHelper = require("../../helpers/products");

//[GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({ _id: cartId });

  cart.totalPrice = 0;

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const product = await Product.findOne({
        _id: productId,
      }).select("thumbnail title slug price discountPercentage");

      product.priceNew = productsHelper.priceNewProduct(product);

      item.productInfo = product;

      item.totalPrice = item.quantity * product.priceNew;

      cart.totalPrice += item.totalPrice;
    }
  }

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

//[POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne({ _id: cartId });

  const products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products,
  };
  const order = new Order(orderInfo);
  order.save();

  await Cart.updateOne({ _id: cartId }, { products: [] });

  res.redirect(`/checkout/success/${order.id}`);
};

//[GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({ _id: orderId });

  order.totalPrice = 0;

  if (order.products.length > 0) {
    for (const product of order.products) {
      const productId = product.product_id;
      const infoProduct = await Product.findOne({
        _id: productId,
      }).select("thumbnail title price discountPercentage");

      product.title = infoProduct.title;

      product.thumbnail = infoProduct.thumbnail;

      product.priceNew = productsHelper.priceNewProduct(product);

      product.totalPrice = product.priceNew * product.quantity;

      order.totalPrice += product.totalPrice;
    }
  }
  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
