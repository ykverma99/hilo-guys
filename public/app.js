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
const chooseImage = document.getElementById("choose_image");
const imageSelected = document.getElementById("selected_image");
const uploadPost = document.getElementById("upload_image_btn");
const clossPostModal = document.getElementById("cross");
const openPostModal = document.getElementById("post_link");
const postModal = document.getElementById("post_modal");

window.addEventListener("load", async () => {
  // user profile image show
  userProfileIcon.src = user.user.profilePhoto
    ? `${window.location.origin}/images/profilePic/${user.user.profilePhoto}`
    : "./images/user.png";

    rightSideProfileImg.src = user.user.profilePhoto
    ? `${window.location.origin}/images/profilePic/${user.user.profilePhoto}`
    : "./images/user.png";
    
    // user detail to show
    nameOfUser.textContent = user.user.name;
    userName.textContent = user.user.username;

    // all the post to show
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

// post likes counts

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

  // suggested user to show

  const suggestedUser = await users(4, user.user._id);
  suggestedUser.forEach((elm) => {
    suggestionUsers.innerHTML += `
            <div class="profile user">
              <div class="profile_info user_info">
                <div class="profile_img icon">
                  <img src="${
                    elm.profilePhoto
                      ? `${window.location.origin}/images/profilePic/${elm.profilePhoto}`
                      : `./images/user.png`
                  }" alt="User" />
                </div>
                <div class="profile_detail">
                  <p class="profile_username">${elm.username}</p>
                  <p class="profile_name">${elm.name}</p>
                </div>
              </div>
              <button data-user-id="${user.user._id}" data-friend-id="${
      elm._id
    }"  class="connect_btn send_friend_btn">connect</button>
            </div>`;
  });

  // sending friend requests

  document.querySelectorAll(".send_friend_btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const userId = e.target.dataset.userId;
      const friendId = e.target.dataset.friendId;
      const friendData = {
        user1: userId,
        user2: friendId,
      };
      try {
        const res = await fetch(`http://localhost:3000/friends`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(friendData),
        });
        const data = await res.json();
        if (res.ok) {
          e.target.classList.remove("connect_btn");
          e.target.textContent = "Friends";
          e.target.classList.add("profile_btn");
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    });
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
      const res = await fetch(`http://localhost:3000/upload`,{
        method:"POST",
        body:formData
      })
      const data = await res.json()
      if(res.ok){
        postModal.style.display = "none";
        window.location.reload()
      }else{
        console.log("error");
      }
    }
  } catch (error) {
    console.log(error);
  }
});
