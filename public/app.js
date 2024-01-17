import { getUsers } from "./services/Menu.js"

let user = null
document.addEventListener('DOMContentLoaded',()=>{
    user = getUsers()
    if(!user){
        window.location.replace("http://localhost:3000/pages/login.html")
    }
})

let profileLink = document.getElementById("profile_link")
profileLink.addEventListener("click",()=>{
    window.location.href = `/pages/profile.html?user=${user.user.username}`
})