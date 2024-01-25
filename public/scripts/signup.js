import { getUsers, setUser } from "../services/Menu.js";

let user = null;
document.addEventListener("DOMContentLoaded", () => {
  user = getUsers();
  if (user) {
    window.location.replace("/");
  }
});

const form = document.getElementById("signup");
// const error = document.getElementById("error")

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    let email = document.getElementById("email").value
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value
    let name = document.getElementById("name").value
    let userData = {
        email,name,username,password
    }
    console.log(userData, "us");
    const res = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      window.location.replace("/");
    } else {
        // error.style.display = "block"
        console.log(res.status);
    }
  } catch (error) {
    console.log(error, "error");
  }
});
