import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
import { FileUploadWithPreview } from "https://unpkg.com/file-upload-with-preview/dist/index.js";

// Upload Image
const upload = new FileUploadWithPreview("upload-images", {
  multiple: true,
  maxFileCount: 6,
});
// End Upload Image

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  const inputContent = formSendData.querySelector("input[name='content']");
  formSendData.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = inputContent.value;
    const uploadImages = upload.cachedFileArray;
    if (content || uploadImages.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: uploadImages,
      });
      inputContent.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
      upload.resetPreviewPanel();
    }
  });
}
// End CLIENT_SEND_MESSAGE

// SERVER_SEND_MESSAGE
socket.on("SERVER_SEND_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  const div = document.createElement("div");
  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";

  if (myId != data.userId) {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  } else {
    div.classList.add("inner-outgoing");
  }

  if (data.content) {
    htmlContent = `<div class="inner-content">${data.content}</div>`;
  }

  if (data.images.length > 0) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.images) {
      htmlImages += `
        <img src="${image}">
      `;
    }

    htmlImages += `</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `;

  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight;
});
// End SERVER_SEND_MESSAGE

// Scroll to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
// End Scroll to bottom

//Enter to send message
document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".fa-paper-plane"); // Tìm nút với lớp "fa-paper-plane"

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // Kiểm tra nếu phím nhấn là Enter
      button.click(); // Tự động nhấp vào nút
    }
  });
});
//End Enter to send message

//Show Typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
//End Show Typing

//Show Icon Chat
const buttonIcon = document.querySelector(".button-icon");

if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  // Show Tooltip
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  });

  // buttonIcon.onclick =()=> {
  //   tooltip.classList.toggle('shown');
  // };

  // Insert Icon To Input
  const emojiPicker = document.querySelector("emoji-picker");
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;

    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();

    showTyping();
  });
}
//End Show Icon Chat

//Input Keyup

const inputChatTyping = document.querySelector(
  ".chat .inner-form input[name='content']"
);
inputChatTyping.addEventListener("keyup", () => {
  showTyping();
});
//End Input Keyup

//SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(
  ".chat .inner-body .inner-list-typing"
);

socket.on("SERVER_RETURN_TYPING", (data) => {
  if (data.type == "show") {
    const bodyChat = document.querySelector(".chat .inner-body");
    const existTyping = elementListTyping.querySelector(
      `.box-typing[user-id="${data.userId}"]`
    );

    if (!existTyping) {
      const boxTyping = document.createElement("div");
      boxTyping.classList.add("box-typing");
      boxTyping.setAttribute("user-id", data.userId);
      boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

      elementListTyping.appendChild(boxTyping);

      bodyChat.scrollTop = bodyChat.scrollHeight;
    } else {
      const boxTypingRemove = elementListTyping.querySelector(
        `.box-typing[user-id="${data.userId}"]`
      );
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  }
});
//END SERVER_RETURN_TYPING
