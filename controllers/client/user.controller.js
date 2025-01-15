const User = require("../../models/user.model");
const md5 = require("md5");
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
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};
//[GET] /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};  