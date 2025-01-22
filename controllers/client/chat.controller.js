//[GET] /chat/
module.exports.index = (req, res) => {
  //Socket
  _io.on("connection", (socket) => {
    console.log("Kết nối thành công!", socket.id)
  });
  //End Socket

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
  });
};