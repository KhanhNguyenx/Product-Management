
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