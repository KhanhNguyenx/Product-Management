const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

//[GET] /cart
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
  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

//[POST] /add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  if (existProductInCart) {
    const quantityUpdate = existProductInCart.quantity + quantity;
    await Cart.updateOne(
      { _id: cartId, "products.product_id": productId },
      { $set: { "products.$.quantity": quantityUpdate } }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne({ _id: cartId }, { $push: { products: objectCart } });
  }

  req.flash("success", "Thêm thành công sản phẩm vào giỏ hàng");
  res.redirect("back");
};

//[GET] /delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  await Cart.updateOne(
    { _id: cartId },
    { $pull: { products: { product_id: productId } } }
  );
  req.flash("success", "Xóa sản phẩm khỏi giỏ hàng thành công");
  res.redirect("back");
};

//[GET] /update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity);
  await Cart.updateOne(
    { _id: cartId, "products.product_id": productId },
    { $set: { "products.$.quantity": quantity } }
  );
  req.flash("success", "Cập nhật giỏ hàng thành công");
  res.redirect("back");
};
