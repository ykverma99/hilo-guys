import { getUsers, singleUser } from "../services/Menu.js";

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
    const formData = new FormData()
    const profileInputPic = document.querySelector('input[name="profilePhoto"]')
    if(profileInputPic.files.length>0){
      formData.append("profilePhoto",profileInputPic.files[0])
      const res = await fetch(`http://localhost:3000/user/${userAuth.user._id}`,{
        method:"PATCH",
        body:formData
      })
      const body = await res.json()
      if(res.ok){
        console.log(body);
      }else{
        console.log("error",body);
      }
      selectImageContainer.style.display = "none";
    }
    console.log(formData);
  } catch (error) {
    console.log(error);
  }
});

window.addEventListener("load", async () => {
  const usernameFromUrl = getUserNameFromUrl();
  const user = await singleUser(usernameFromUrl);
  document.getElementById("username").textContent = usernameFromUrl;
  const profileBtn_1 = document.getElementById("profile_btn_1");
  const profileBtn_2 = document.getElementById("profile_btn_2");
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
      const hearImg = document.createElement("img");
      hearImg.src = "../images/heart.png";
      postLikes.append(hearImg);
      hearImg.addEventListener("click", like.bind(post));
      imgContainer.addEventListener("mouseenter", () => {
        postLikes.style.display = "flex";
      });
      imgContainer.addEventListener("mouseleave", () => {
        postLikes.style.display = "none";
      });
    });
  }
});
function like(e) {
  console.log(this);
  console.log(e);
}
