import { getUsers, showAllInteractions } from "../services/Menu.js";

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

window.addEventListener("load", async () => {
  const showInteractions = await showAllInteractions(user.user._id);
  if (showInteractions.length == 0) {
    interactionList.innerHTML = `<h2 class="no_chats">No Chats</h2>`
  }
  showInteractions.map((interaction) => {
    const timestamp = new Date(interaction.timestamp)
    const currentTime = new Date()
    const timeDiffrence = currentTime.getTime() - timestamp.getTime()
    const timeInMin = Math.floor(timeDiffrence / (1000  *60))
    const timeInHour = Math.floor(timeDiffrence / (1000 * 60 *60))
    let time;
    if(timeInMin >= 60){
      time = `${timeInHour}h`
    }else{
      time = `${timeInMin}m`
    }
    interactionList.innerHTML += `
    <div class="user">
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
  });
});

// webpage linking
profileLink.addEventListener("click", () => {
  window.location.href = `/pages/profile.html?user=${user.user.username}`;
});

// post section
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
