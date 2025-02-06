const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  usersSocket(res);

  const userId = res.locals.user.id;

  const myUser = await User.findOne({ _id: userId });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;

  const users = await User.find({
    _id: { $ne: userId, $nin: [...requestFriends, ...acceptFriends] },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
module.exports.request = async (req, res) => {
  usersSocket(res);
  const userId = res.locals.user.id;

  const myUser = await User.findOne({ _id: userId });
  const requestFriends = myUser.requestFriends;

  const users = await User.find({
    _id: { $ne: userId, $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");
  
  res.render("client/pages/users/request", {
    users: users,
  });
};
