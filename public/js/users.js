
//Chức năng gửi yêu cầu kết bạn 
const listbuttonAddFriend = document.querySelectorAll('[btn-add-friend]');
listbuttonAddFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.add("add")

      const userId = button.getAttribute('btn-add-friend');

      socket.emit('CLIENT_ADD_FRIEND', userId);
    });
});
//Hết chức năng gửi yêu cầu kết bạn 

//Chức năng hủy yêu cầu kết bạn 
const listbuttonCancelFriend = document.querySelectorAll('[btn-cancel-friend]');
listbuttonCancelFriend.forEach(button => {
    button.addEventListener('click', () => {
      button.closest('.box-user').classList.remove("add")

      const userId = button.getAttribute('btn-cancel-friend');

      socket.emit('CLIENT_CANCEL_FRIEND', userId);
    });
});
//Hết chức năng hủy yêu cầu kết bạn 

// Từ chối kết bạn
const listbuttonRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if(listbuttonRefuseFriend.length > 0) {
  listbuttonRefuseFriend.forEach(button => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");

      const userId = button.getAttribute("btn-refuse-friend");
      
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// Hết Từ chối kết bạn