const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    res.redirect(`/user/login`);
    return;
  }

  try {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
      status: "active",
    }).select("-password");

    if (!user) {
      res.redirect(`/user/login`);
      return;
    }

    res.locals.user = user;

    next();
  } catch (error) {
    res.redirect(`/user/login`);
  }
};
