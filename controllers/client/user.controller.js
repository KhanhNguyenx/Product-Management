const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendmail");

//[GET] /user/register
module.exports.register = (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};
//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existedEmail = await User.findOne({
    email: req.body.email,
  });

  if (existedEmail) {
    req.flash("error", `Email đã tồn tại!`);
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password); // mã hóa mật khẩu
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
  console.log(user);
};
//[GET] /user/login
module.exports.login = (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập",
  });
};
//[POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", `Email không tồn tại!`);
    res.redirect("back");
    return;
  }

  if (md5(password) !== user.password) {
    req.flash("error", `Sai mật khẩu!`);
    res.redirect("back");
    return;
  }

  if (user.status === "inactive") {
    req.flash("error", `Tài khoản đã bị khóa!`);
    res.redirect("back");
    return;
  }

  //Khi đăng nhập tìm cart dựa vào user.id trong db
  //Khi đăng xuất xóa cartId
  const cart = await Cart.findOne({
    user_id: user.id,
  });
  if (cart) {
    res.cookie("cartId", cart.id);
  } else {
    await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });
  }

  //Khi đăng xuất không xóa cartId
  // await Cart.updateOne({ _id: req.cookies.cartId }, { user_id: user.id });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};
//[GET] /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
  res.redirect("/");
};
//[GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};
//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", `Email không tồn tại!`);
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // Nếu tồn tại email thì gửi mã OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút.`;
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};
//[GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};
//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", `Mã OTP không đúng!`);
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};
//[GET] /user/password/reset-password
module.exports.resetPassword = (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};
//[POST] /user/password/reset-password
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );
  res.redirect("/");
};
//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin tài khoản",
  });
};
//[GET] /user/info/edit
module.exports.edit = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: res.locals.user.id,
    });
    res.render("client/pages/user/info-edit", {
      pageTitle: "Thay đổi thông tin",
      user: user,
    });
  } catch (error) {
    req.flash("error", `Không tồn tại tài khoản`);
    res.redirect(`/user/info`);
  }
};
// [PATCH]/user/info/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;
  const user = await User.findOne({ _id: id });

  // Lấy mật khẩu cũ và mật khẩu mới
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  // Kiểm tra người dùng có tồn tại không
  if (!user) {
    req.flash("error", "Tài khoản không tồn tại");
    return res.redirect("/user/info");
  }

  // Kiểm tra mật khẩu cũ và mật khẩu mới
  if (currentPassword) {
    // Kiểm tra mật khẩu cũ có đúng không
    if (md5(currentPassword) === user.password) {
      user.password = md5(newPassword);
    } else {
      req.flash("error", "Mật khẩu cũ không chính xác");
      return res.redirect("/user/info/edit");
    }
  } else {
    // Nếu không thay đổi mật khẩu, xóa các trường liên quan đến mật khẩu khỏi req.body
    delete req.body.currentPassword;
    delete req.body.newPassword;
    delete req.body.confirmPassword;
  }

  console.log(req.body)
  // Cập nhật thông tin người dùng
  await User.updateOne({ _id: id }, { $set: { password: user.password, ...req.body } });
  req.flash("success", "Cập nhật tài khoản thành công");

  return res.redirect("/user/info");
};
