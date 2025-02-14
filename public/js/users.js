//Chức năng gửi yêu cầu kết bạn
const listbuttonAddFriend = document.querySelectorAll("[btn-add-friend]");
listbuttonAddFriend.forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("add");

    const userId = button.getAttribute("btn-add-friend");

    socket.emit("CLIENT_ADD_FRIEND", userId);
  });
});
//Hết chức năng gửi yêu cầu kết bạn

//Chức năng hủy yêu cầu kết bạn
const listbuttonCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
listbuttonCancelFriend.forEach((button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.remove("add");

    const userId = button.getAttribute("btn-cancel-friend");

    socket.emit("CLIENT_CANCEL_FRIEND", userId);
  });
});
//Hết chức năng hủy yêu cầu kết bạn

// Từ chối kết bạn
const listbuttonRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listbuttonRefuseFriend.length > 0) {
  listbuttonRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");

      const userId = button.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// Hết Từ chối kết bạn

// Chấp nhận kết bạn
const listbuttonAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listbuttonAcceptFriend.length > 0) {
  listbuttonAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");

      const userId = button.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
// Hết Chấp nhận kết bạn

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector(
    `[badge-users-accept="${data.userId}"]`
  );
  if (badgeUsersAccept) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

//SERVER_SEND_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector(
    `[data-users-accept="${data.userId}"]`
  );
  if (dataUsersAccept) {
    //Vẽ user ra giao diện
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.setAttribute("user-id", data.myUserInfo._id);

    newBoxUser.innerHTML = `
      <div class="box-user">
        <div class="inner-avatar">
          <img src="https://robohash.org/hicveldicta.png" alt="${data.myUserInfo.fullName}" />
        </div>
        <div class="inner-info">
            <div class="inner-name">
              ${data.myUserInfo.fullName}
            </div>
            <div class="inner-buttons">
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accept-friend="${data.myUserInfo._id}"
              >
                Chấp nhận
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-refuse-friend="${data.myUserInfo._id}"
              >
                Xóa
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-deleted-friend=""
                disabled=""
              >
                Đã xóa
              </button>
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accepted-friend=""
                disabled=""
              >
                Đã chấp nhận
              </button>
            </div>
        </div>
      </div>
    `;

    dataUsersAccept.appendChild(newBoxUser);
    //Hết vẽ user ra giao diện

    //Hủy lời mời kết bạn
    const buttonRefuse = newBoxUser.querySelector("[btn-refuse-friend]");
    buttonRefuse.addEventListener("click", () => {
      buttonRefuse.closest(".box-user").classList.add("refuse");

      const userId = buttonRefuse.getAttribute("btn-refuse-friend");

      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
    //Hết Hủy lời mời kết bạn

    //Chấp nhận kết bạn
    const buttonAccept = newBoxUser.querySelector("[btn-accept-friend]");
    buttonAccept.addEventListener("click", () => {
      buttonAccept.closest(".box-user").classList.add("accepted");

      const userId = buttonAccept.getAttribute("btn-accept-friend");

      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
    //Hết Chấp nhận kết bạn
  }
  // Khi A gửi kết bạn cho B, danh sách người dùng của B xóa đi A
  const dataUsersNotFriend = document.querySelector(
    `[data-users-not-friend="${data.userId}"]`
  );
  if (dataUsersNotFriend) {
    const boxUserDelete = dataUsersNotFriend.querySelector(
      `[user-id="${data.myUserInfo._id}"]`
    );
    if (boxUserDelete) {
      dataUsersNotFriend.removeChild(boxUserDelete);
    }
  }
});

// END SERVER_SEND_INFO_ACCEPT_FRIEND

// SERVER_RETURN_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_ID_CANCEL_FRIEND", (data) => {
  const dataUsersAccept = document.querySelector(
    `[data-users-accept="${data.userId}"]`
  );
  if (dataUsersAccept) {
    const boxUser = dataUsersAccept.querySelector(
      `[user-id="${data.myUserId}"]`
    );
    if (boxUser) {
      dataUsersAccept.removeChild(boxUser);
    }
  }
});
// End SERVER_RETURN_ID_CANCEL_FRIEND
