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
