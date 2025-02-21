const uploadToCloundinary = require("../../helpers/uploadToCloundinary");
const Chat = require("../../models/chat.model");

module.exports = (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId;
  _io.once("connection", (socket) => {
    socket.join(roomChatId);

    // Người dùng gửi tin nhắn lên server
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      for (const imageBuffer of data.images) {
        const link = await uploadToCloundinary(imageBuffer);
        images.push(link);
      }

      // Lưu vào database
      const chat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: data.content,
        images: images,
      });

      await chat.save();

      // Trả data về client
      _io.to(roomChatId).emit("SERVER_SEND_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });
    });
    //Typing
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
    //End Typing
  });
};
