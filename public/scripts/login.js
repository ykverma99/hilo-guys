import { getUsers, setUser } from "../services/Menu.js";

let user = null;
document.addEventListener("DOMContentLoaded", () => {
  user = getUsers();
  console.log(user,"dom");
  if (user) {
    window.location.replace("http://localhost:3000/");
  }
});

const form = document.getElementById("login");
const error = document.getElementById("error")

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let username = form.children.user.value;
    let password = form.children.password.value;
    let userData;
    if (username.includes("@")) {
      userData = {
        email: username,
        password: password,
      };
    } else {
      userData = {
        username,
        password,
      };
    }
    console.log(userData, "us");
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      window.location.replace("http://localhost:3000/");
    } else {
        error.style.display = "block"
    }
  } catch (error) {
    console.log(error, "error");
  }
});
