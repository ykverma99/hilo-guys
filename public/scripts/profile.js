import { getUsers, setUser, singleUser } from "../services/Menu.js";

let userAuth = null;
document.addEventListener("DOMContentLoaded", () => {
  userAuth = getUsers();
  if (!userAuth) {
    window.location.replace("http://localhost:3000/pages/login.html");
  }
});

function getUserNameFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("user");
}

const profileImage = document.getElementById("profile_image");
const userProfileIcon = document.getElementById("user_img")
const selectImageContainer = document.getElementById("select_image");
const modal = document.getElementById("open_modal");
const profileForm = document.getElementById("profile_form");
const profileBtn = document.getElementById("sendProfile");
const postContainer = document.getElementById("post_section");
const postCount = document.getElementById("post");
const friendsCount = document.getElementById("friends");
const noPost = document.getElementById("no_post");

modal.addEventListener("click", () => {
  selectImageContainer.style.display = "flex";
});

profileBtn.addEventListener("click", async (event) => {
  try {
    const formData = new FormData();
    const profileInputPic = document.querySelector(
      'input[name="profilePhoto"]'
    );
    if (profileInputPic.files.length > 0) {
      formData.append("profilePhoto", profileInputPic.files[0]);
      const res = await fetch(
        `http://localhost:3000/user/${userAuth.user._id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      const body = await res.json();
      if (res.ok) {
        setUser(body);
        profileImage.src = `${window.location.origin}/images/profilePic/${body.profilePhoto}`;
      } else {
        console.log("error", body);
      }
      selectImageContainer.style.display = "none";
    }
    console.log(formData);
  } catch (error) {
    console.log(error);
  }
});

window.addEventListener("load", async () => {
  userProfileIcon.src = userAuth.user.profilePhoto ? `${window.location.origin}/images/profilePic/${userAuth.user.profilePhoto}`:"../images/user.png"
  const usernameFromUrl = getUserNameFromUrl();
  const user = await singleUser(usernameFromUrl);
  document.getElementById("username").textContent = usernameFromUrl;
  const profileBtn_1 = document.getElementById("profile_btn_1");
  const profileBtn_2 = document.getElementById("profile_btn_2");
  profileImage.src = user.profilePhoto
    ? `${window.location.origin}/images/profilePic/${user.profilePhoto}`
    : "../images/user.png";
  postCount.textContent = user.post.length;
  friendsCount.textContent = user.friends.length;
  if (user._id === userAuth.user._id) {
    modal.removeAttribute("hidden");
    profileBtn_1.textContent = "Edit profile";
    profileBtn_2.textContent = "settings";
  } else {
    profileBtn_1.textContent = "Friends";
    profileBtn_2.textContent = "Message";
  }
  if (user.post.length > 0) {
    noPost.style.display = "none";
    postContainer.style.display = "flex";
    user.post.forEach((post) => {
      const imgContainer = document.createElement("div");
      imgContainer.className = "post_pic";
      const postImg = document.createElement("img");
      postImg.src = `${window.location.origin}/images/posts/${post.content}`;
      postImg.alt = `${post.caption}`;
      const postLikes = document.createElement("div");
      postLikes.className = "post_like";
      imgContainer.append(postImg, postLikes);
      postContainer.append(imgContainer);
      const heartImg = document.createElement("img");
      heartImg.src = post.likes.includes(user._id)
        ? "../images/red-heart.png"
        : "../images/white-heart.png";
      heartImg.style.cursor = "pointer";
      postLikes.append(heartImg);
      heartImg.addEventListener("click", async () => {
        try {
          const res = await fetch(
            `http://localhost:3000/post/${post._id}/${user._id}`,
            {
              method: "PATCH",
            }
          );
          const data = await res.json();
          if (res.ok) {
            if (data.likes.includes(user._id)) {
              heartImg.src = "../images/red-heart.png";
            } else {
              heartImg.src = "../images/white-heart.png";
            }
          } else {
            console.log(res.status);
          }
        } catch (error) {
          console.log(error);
        }
      });
      imgContainer.addEventListener("mouseenter", () => {
        postLikes.style.display = "flex";
      });
      imgContainer.addEventListener("mouseleave", () => {
        postLikes.style.display = "none";
      });
    });
  }
});
