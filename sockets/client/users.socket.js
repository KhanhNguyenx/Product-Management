const User = require("../../models/user.model");
module.exports = (res) => {
  _io.once("connection", (socket) => {
    // myUser gửi lời mời kết bạn cho user
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //Add AcceptFriends to myUserId
      const existAccept = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });

      if (!existAccept) {
        await User.updateOne(
          { _id: userId },
          { $push: { acceptFriends: myUserId } }
        );
      }
      //End Add AcceptFriends to myUserId

      //Add ResquestFriends to UserId
      const existRequest = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!existRequest) {
        await User.updateOne(
          { _id: myUserId },
          { $push: { requestFriends: userId } }
        );
      }
      //End Add ResquestFriends to UserId
    });

    // myUser hủy lời mời kết bạn cho user
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //Delete AcceptFriends to myUserId
      const existAccept = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });

      if (existAccept) {
        await User.updateOne(
          { _id: userId },
          { $pull: { acceptFriends: myUserId } }
        );
      }
      //End Delete AcceptFriends to myUserId

      //Delete ResquestFriends to UserId
      const existRequest = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (existRequest) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { requestFriends: userId } }
        );
      }
      //End Delete ResquestFriends to UserId
    });

    // user từ chối lời mời kết bạn từ myUser
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //Delete AcceptFriends to myUserId
      const existAccept = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });

      if (existAccept) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { acceptFriends: userId } }
        );
      }
      //End Delete AcceptFriends to myUserId

      //Delete ResquestFriends to UserId
      const existRequest = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existRequest) {
        await User.updateOne(
          { _id: userId },
          { $pull: { requestFriends: myUserId } }
        );
      }
      //End Delete ResquestFriends to UserId
    });

    // user chấp nhận lời mời kết bạn từ myUser
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //Add myUserId {user_id, room_chat_id} to userId friendsList
      //Delete AcceptFriends to myUserId
      const existAccept = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });

      if (existAccept) {
        await User.updateOne(
          { _id: myUserId },
          {
            $push: {
              friendsList: {
                user_id: userId,
                room_chat_id: ""
              }
            },
            $pull: { acceptFriends: userId }
          }
        );
      }
      //End Delete AcceptFriends to myUserId

      //Add userId {user_id, room_chat_id} to myUserId friendsList
      //Delete ResquestFriends to UserId
      const existRequest = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (existRequest) {
        await User.updateOne(
          { _id: userId },
          {
            $push: {
              friendsList: {
                user_id: myUserId,
                room_chat_id: ""
              }
            },
            $pull: { acceptFriends: myUserId }
          }
        );
      }
      //End Delete ResquestFriends to UserId
    });
  });
};
