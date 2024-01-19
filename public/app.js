import { fetchPosts, getUsers, users } from "./services/Menu.js";

let user = null;
document.addEventListener("DOMContentLoaded", () => {
  user = getUsers();
  if (!user) {
    window.location.replace("http://localhost:3000/pages/login.html");
  }
});

const profileLink = document.getElementById("profile_link");
const userProfileIcon = document.getElementById("user_img");
const postsContainer = document.getElementById("posts_container");
const userName = document.getElementById("right_username");
const nameOfUser = document.getElementById("right_user_name");
const rightSideProfileImg = document.getElementById("profile_img_right");
const suggestionUsers = document.getElementById("suggestion_users");

window.addEventListener("load", async () => {
  userProfileIcon.src = user.user.profilePhoto
    ? `${window.location.origin}/images/profilePic/${user.user.profilePhoto}`
    : "./images/user.png";
  userName.textContent = user.user.username;
  nameOfUser.textContent = user.user.name;
  rightSideProfileImg.src = user.user.profilePhoto
    ? `${window.location.origin}/images/profilePic/${user.user.profilePhoto}`
    : "./images/user.png";
  const posts = await fetchPosts();
  posts.map((post) => {
    postsContainer.innerHTML += `
        <div class="post_container">
          <div class="user">
            <div class="user_info">
              <div class="user_img icon">
                <img class="user_profile" src="${
                  post.user.profilePhoto
                    ? `${window.location.origin}/images/profilePic/${post.user.profilePhoto}`
                    : "./images/user.png"
                }" alt="User" />
              </div>
              <p id="user" class="username">${post.user.username}</p>
            </div>
            <div class="icon">
              <img class="menu" src="./images/options.png" alt="options" />
            </div>
          </div>
          <div class="post">
            <img src="${window.location.origin}/images/posts/${
      post.content
    }" alt="post" />
          </div>
          <div class="options">
            <div class="post_option">
              <div class="icon">
                <img class="heart-icon" src="${
                  post.likes.includes(user.user._id)
                    ? "./images/red-heart.png"
                    : "./images/heart.png"
                }" alt="Like" data-post-id="${post._id}" data-user-id="${
      user.user._id
    }" />
              </div>
              <div class="icon">
                <img src="./images/comment.png" alt="Comment" />
              </div>
              <div class="icon">
                <img src="./images/share.png" alt="Share" />
              </div>
            </div>
            <div class="icon">
              <img src="./images/save.png" alt="Save" />
            </div>
          </div>
          <span class="post_likes">${post.likes.length} likes</span>
          <div class="post_info">
            <span class="post_info_heading">${post.user.username}</span>
            ${post.caption}
          </div>
        </div>`;
  });

  document.querySelectorAll(".heart-icon").forEach((heartIcon) => {
    heartIcon.addEventListener("click", async (event) => {
      const postId = event.target.dataset.postId;
      const userId = event.target.dataset.userId;
      try {
        const res = await fetch(
          `http://localhost:3000/post/${postId}/${userId}`,
          {
            method: "PATCH",
          }
        );
        const data = await res.json();
        if (res.ok) {
          const likesElement = event.target
            .closest(".post_container")
            .querySelector(".post_likes");
          likesElement.textContent = `${data.likes.length} likes`;
          if (data.likes.includes(userId)) {
            heartIcon.src = "./images/red-heart.png";
          } else {
            heartIcon.src = "./images/heart.png";
          }
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  const suggestedUser = await users(4, user.user._id);
  suggestedUser.forEach((user) => {
    suggestionUsers.innerHTML = `
    <div class="profile user">
              <div class="profile_info user_info">
                <div class="profile_img icon">
                  <img src="${user.profilePhoto ? `${window.location.origin}/images/profilePic/${user.profilePhoto}`:`./images/user.png`}" alt="User" />
                </div>
                <div class="profile_detail">
                  <p class="profile_username">${user.username}</p>
                  <p class="profile_name">${user.name}</p>
                </div>
              </div>
              <button class="profile_btn">friend</button>
            </div>`;
  });
});

profileLink.addEventListener("click", () => {
  window.location.href = `/pages/profile.html?user=${user.user.username}`;
});
