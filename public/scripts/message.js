import { getUsers, showAllInteractions, singleUser } from "../services/Menu.js";

let user = null;
document.addEventListener("DOMContentLoaded", () => {
  user = getUsers();
  if (!user) {
    window.location.replace("http://localhost:3000/pages/login.html");
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

window.addEventListener("load", async () => {
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
    interactionList.innerHTML += `
    <div data-friend-username="${
      interaction.withUserId.username
    }" data-friend-id="${interaction.withUserId._id}" data-friend-profile="${
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
    // <--<button class="user_btn"></button>-->
    // document.querySelectorAll(".user_msg_list").forEach((friendUser) => {
    //   friendUser.addEventListener("click", (e) => {
    //     const friendUsername = e.target.dataset.friendUsername;
    //     const friendProfile = e.target.dataset?.friendProfile;
    //     const friendId = e.target.dataset.friendId;
    //     console.log(friendUsername);
    //     startMessage.style.display = "none";
    //     inboxContainer.removeAttribute("hidden");
    //     const inboxUsername = document.getElementById("inbox_username");
    //     inboxUsername.textContent = friendUsername;
    //     const inboxProfileImg = document.getElementById("inbox_profile");
    //     if(friendProfile != "undefined"){
    //       inboxProfileImg.src = `${window.location.origin}/images/profilePic/${friendProfile}`
    //     }else{
    //       inboxProfileImg.src = "../images/user.png"
    //     }
    //   });
    // });

    interactionList.addEventListener("click", (e) => {
      const userMsgList = e.target.closest(".user_msg_list");
      if (userMsgList) {
        const friendUsername = userMsgList.dataset.friendUsername;
        const friendProfile = userMsgList.dataset.friendProfile || '';
        const friendId = userMsgList.dataset.friendId;
        console.log(friendUsername,friendProfile);
        startMessage.style.display = "none";
        inboxContainer.removeAttribute("hidden");
        const inboxUsername = document.getElementById("inbox_username");
        inboxUsername.textContent = friendUsername;
        const inboxProfileImg = document.getElementById("inbox_profile");
        if (friendProfile != "undefined") {
          inboxProfileImg.src = `${window.location.origin}/images/profilePic/${friendProfile}`;
        } else {
          inboxProfileImg.src = "../images/user.png";
        }
      }
    });
  });
});

// webpage linking
profileLink.addEventListener("click", () => {
  window.location.href = `/pages/profile.html?user=${user.user.username}`;
});

// connect modal

openConnectModal.addEventListener("click", async () => {
  connectContainer.removeAttribute("hidden");
  const allFriends = document.getElementById("all_friends");
  user.user.friends.forEach((friend) => {
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
