const User = require("../../models/user.model");

const usersSocket = require("../../sockets/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  usersSocket(res);

  const userId = res.locals.user.id;

  const myUser = await User.findOne({ _id: userId });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  const friendsListIds = myUser.friendsList.map(user => user.user_id);
  const users = await User.find({
    _id: { $ne: userId, $nin: [...requestFriends, ...acceptFriends,...friendsListIds] },
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
    _id: {$in: requestFriends },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");

  res.render("client/pages/users/request", {
    users: users,
  });
};
module.exports.accept = async (req, res) => {
  usersSocket(res);
  const userId = res.locals.user.id;

  const myUser = await User.findOne({ _id: userId });
  const acceptFriends = myUser.acceptFriends;

  const users = await User.find({
    _id: {$in: acceptFriends },
    status: "active",
    deleted: false,
  }).select("id fullName avatar");
  res.render("client/pages/users/accept", {
    users: users,
  });
};

// [GET] /users/friends
module.exports.friends = async (req, res) => {
  const friendsList = res.locals.user.friendsList;
  const friendsListId = friendsList.map(item => item.user_id);  
  
  const users = await User.find({
    _id: { $in: friendsListId },
    status: "active",
    deleted: false
  }).select("id fullName avatar statusOnline");

  for (const user of users) {
    const infoUser = friendsList.find(item => item.user_id == user.id);
    user.roomChatId = infoUser.room_chat_id;
  }

  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách bạn bè",
    users: users
  });
};