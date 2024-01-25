import {
  getUsers,
  isInteraction,
  setUser,
  showAllInteractions,
  singleUser,
} from "../services/Menu.js";

const socket = io();

let user = null;
document.addEventListener("DOMContentLoaded", async() => {
  user = getUsers();
  if (!user) {
    window.location.replace("http://localhost:3000/pages/login.html");
  }
try {
  const res = await singleUser(user.user._id)
  setUser(res)
} catch (error) {
  console.log(error);
}
});

const profileLink = document.getElementById("profile_link");
const chooseImage = document.getElementById("choose_image");
const imageSelected = document.getElementById("selected_image");
const uploadPost = document.getElementById("upload_image_btn");
const clossPostModal = document.getElementById("cross");
const openPostModal = document.getElementById("post_link");
const postModal = document.getElementById("post_modal");
const interactionList = document.getElementById("interaction_list");
const connectContainer = document.getElementById("connect_container");
const closeConnectModal = document.getElementById("cross_connect");
const openConnectModal = document.getElementById("connect_open");
const startMessage = document.getElementById("start_msg");
const inboxBox = document.getElementById("inbox_box");
const inboxContainer = document.getElementById("inbox_container");
const messageForm = document.getElementById("message_form");
const inboxMessages = document.getElementById("inbox_messages");

window.addEventListener("load", async () => {
  user = getUsers()
  const showInteractions = await showAllInteractions(user.user._id);
  if (showInteractions.length == 0) {
    interactionList.innerHTML = `<h2 class="no_chats">No Chats</h2>`;
  }
  showInteractions.map((interaction) => {
    const timestamp = new Date(interaction.timestamp);
    const currentTime = new Date();
    const timeDiffrence = currentTime.getTime() - timestamp.getTime();
    const timeInMin = Math.floor(timeDiffrence / (1000 * 60));
    const timeInHour = Math.floor(timeDiffrence / (1000 * 60 * 60));
    let time;
    if (timeInMin >= 60) {
      time = `${timeInHour}h`;
    } else {
      time = `${timeInMin}m`;
    }
    if (interaction.withUserId._id != user.user._id) {
      interactionList.innerHTML += `
    <div data-friend-username="${
      interaction.withUserId.username
    }" data-interaction-id="${interaction._id}" data-friend-profile="${
        interaction.withUserId.profilePhoto
      }" class="user user_msg_list">
      <div class="user_info">
        <div class="user_img icon">
          <img src="${
            interaction.withUserId.profilePhoto
              ? `${window.location.origin}/images/profilePic/${interaction.withUserId.profilePhoto}`
              : `../images/user.png`
          }" alt="profile_pic" />
        </div>
        <div class="user_detail">
          <p class="user_username">${interaction.withUserId.username}</p>
          <p class="user_name">${interaction.withUserId.name}</p>
        </div>
      </div>
      <small class="time_chat">${time}</small>
      </div>
      `;
    } else {
      interactionList.innerHTML += `
    <div data-friend-username="${
      interaction.currUserId.username
    }" data-interaction-id="${interaction._id}" data-friend-profile="${
        interaction.currUserId.profilePhoto
      }" class="user user_msg_list">
      <div class="user_info">
        <div class="user_img icon">
          <img src="${
            interaction.currUserId.profilePhoto
              ? `${window.location.origin}/images/profilePic/${interaction.currUserId.profilePhoto}`
              : `../images/user.png`
          }" alt="profile_pic" />
        </div>
        <div class="user_detail">
          <p class="user_username">${interaction.currUserId.username}</p>
          <p class="user_name">${interaction.currUserId.name}</p>
        </div>
      </div>
      <small class="time_chat">${time}</small>
      </div>
      `;
    }
    // <--<button class="user_btn"></button>-->

    // sowing the inbox on click to the friend
    interactionList.addEventListener("click", async (e) => {
      const userMsgList = e.target.closest(".user_msg_list");
      try {
        if (userMsgList) {
          const friendUsername = userMsgList.dataset.friendUsername;
          const friendProfile = userMsgList.dataset.friendProfile || "";
          const interactionId = userMsgList.dataset.interactionId;
          const updateInteraction = await fetch(
            `http://localhost:3000/interaction/${interactionId}`,
            {
              method: "PATCH",
            }
          );
          const interaction = await updateInteraction.json();
          if (updateInteraction.ok) {
            const timestamp = new Date(interaction.timestamp);
            const currentTime = new Date();
            const timeDiffrence = currentTime.getTime() - timestamp.getTime();
            const timeInMin = Math.floor(timeDiffrence / (1000 * 60));
            const timeInHour = Math.floor(timeDiffrence / (1000 * 60 * 60));
            let time;
            if (timeInMin >= 60) {
              time = `${timeInHour}h`;
            } else {
              time = `${timeInMin}m`;
            }
            const interactTimeUpdate = userMsgList.children[1].textContent = time
            startMessage.style.display = "none";
            inboxContainer.removeAttribute("hidden");
            messageForm.setAttribute("data", `${friendUsername}`);
            const inboxUsername = document.getElementById("inbox_username");
            inboxUsername.textContent = friendUsername;
            const inboxProfileImg = document.getElementById("inbox_profile");
            if (friendProfile != "undefined") {
              inboxProfileImg.src = `${window.location.origin}/images/profilePic/${friendProfile}`;
            } else {
              inboxProfileImg.src = "../images/user.png";
            }
            socket.emit("join", friendUsername);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
});

function chats(content, className, profileImg) {
  const chatBox = document.createElement("div");
  chatBox.className = "chats";
  chatBox.classList.add(className);
  const imageContainer = document.createElement("div");
  imageContainer.className = "icon user_profile";
  const img = document.createElement("img");
  img.src = profileImg;
  imageContainer.appendChild(img);
  const chat = document.createElement("p");
  chat.className = "text";
  chat.textContent = content;
  if (className == "you") {
    chatBox.append(chat, imageContainer);
  } else {
    chatBox.append(imageContainer, chat);
  }
  inboxMessages.append(chatBox);
}

// Event for sennding the message

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const to = messageForm.getAttribute("data");
  const content = messageForm.children.message;
  const profileImg = user.user.profilePhoto
    ? `${window.location.origin}/images/profilePic/${user.user.profilePhoto}`
    : "../images/user.png";
  chats(content.value, "you", profileImg);
  socket.emit("send:message", {
    from: user.user.username,
    to,
    content: content.value,
  });
  content.value = "";
});

// Event for recive message
socket.on("recive:message", async (data) => {
  try {
    const user = await singleUser(data.from);
    const profile = user.profilePhoto
      ? `${window.location.origin}/images/profilePic/${user.profilePhoto}`
      : "../images/user.png";
    if (user) {
      chats(data.content, "friend_user", profile);
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error);
  }
});

// webpage linking
profileLink.addEventListener("click", () => {
  window.location.href = `/pages/profile.html?user=${user.user.username}`;
});

// connect modal

openConnectModal.addEventListener("click", async () => {
  connectContainer.removeAttribute("hidden");
  const allFriends = document.getElementById("all_friends");
  allFriends.innerHTML = "";
  user.user.friends.forEach((friend) => {
    if (user.user._id == friend.user2._id) {
      allFriends.innerHTML += `
              <div class="user">
                <div class="user_info">
                  <div class="user_img icon">
                    <img src="${
                      friend.user1.profilePhoto
                        ? `${window.location.origin}/images/profilePic/${friend.user1.profilePhoto}`
                        : `../images/user.png`
                    }" alt="profile_piic" />
                  </div>
                  <div class="user_detail">
                    <p class="user_username">${friend.user1.username}</p>
                    <p class="user_name">${friend.user1.name}</p>
                  </div>
                </div>
                <button data-user-id="${user.user._id}" data-friend-id="${
        friend.user1._id
      }"  class="connect_btn">Chat</button>
              </div>`;
    } else {
      allFriends.innerHTML += `
              <div class="user">
                <div class="user_info">
                  <div class="user_img icon">
                    <img src="${
                      friend.user2.profilePhoto
                        ? `${window.location.origin}/images/profilePic/${friend.user2.profilePhoto}`
                        : `../images/user.png`
                    }" alt="profile_piic" />
                  </div>
                  <div class="user_detail">
                    <p class="user_username">${friend.user2.username}</p>
                    <p class="user_name">${friend.user2.name}</p>
                  </div>
                </div>
                <button data-user-id="${user.user._id}" data-friend-id="${
        friend.user2._id
      }"  class="connect_btn">Chat</button>
              </div>`;
    }
  });

  // button to add in message lists

  document.querySelectorAll(".connect_btn").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const userId = e.target.dataset.userId;
      const friendId = e.target.dataset.friendId;
      const data = {
        withUserId: friendId,
        currUserId: userId,
      };
      const isInteract = await isInteraction(userId, friendId);
      if (isInteract.message) {
        try {
          const res = await fetch(`http://localhost:3000/interaction`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (res.ok) {
            window.location.reload();
          } else {
            console.log("error");
          }
        } catch (error) {
          console.log(error);
        }
      }else{
        window.location.reload()
      }
    });
  });
});

closeConnectModal.addEventListener("click", () => {
  connectContainer.setAttribute("hidden", "true");
});

// post section modal

openPostModal.addEventListener("click", () => {
  postModal.style.display = "block";
});
clossPostModal.addEventListener("click", () => {
  postModal.style.display = "none";
});

chooseImage.addEventListener("change", () => {
  const file = chooseImage.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      imageSelected.src = e.target.result;
    };
    imageSelected.parentElement.classList.add("after_selected");
    reader.readAsDataURL(file);
  } else {
    imageSelected.src = "./images/gallery.png";
    imageSelected.parentElement.classList.remove("after_selected");
  }
});

uploadPost.addEventListener("click", async () => {
  try {
    const file = chooseImage.files[0];
    const captionInput = document.getElementById("caption");
    const caption = captionInput.value.length > 0 ? captionInput.value : "";
    if (file) {
      const formData = new FormData();
      formData.append("postImage", file);
      formData.append("caption", caption);
      formData.append("user", user.user._id);
      const res = await fetch(`http://localhost:3000/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        postModal.style.display = "none";
        window.location.reload();
      } else {
        console.log("error");
      }
    }
  } catch (error) {
    console.log(error);
  }
});
