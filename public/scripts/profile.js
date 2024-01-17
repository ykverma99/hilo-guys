import {getUsers, singleUser} from '../services/Menu.js'


let userAuth = null
document.addEventListener('DOMContentLoaded',()=>{
    userAuth = getUsers()
    if(!userAuth){
        window.location.replace("http://localhost:3000/pages/login.html")
    }
})

function getUserNameFromUrl(){
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("user")
}

const profileImage = document.getElementById("profile_image")
const selectImageContainer = document.getElementById("select_image")
const modal = document.getElementById("open_modal")
const profileForm = document.getElementById("profile_form")

modal.addEventListener("click",()=>{
    selectImageContainer.style.display = "flex"
})

profileForm.addEventListener("submit",(event)=>{
    event.preventDefault()
    console.log(profileForm.children.profilePic.value);
    selectImageContainer.style.display = "none"
})

window.addEventListener("load",async()=>{
    const usernameFromUrl = getUserNameFromUrl()
    const user = await singleUser(usernameFromUrl)
    document.getElementById("username").textContent = usernameFromUrl
    const profileBtn_1 = document.getElementById("profile_btn_1")
    const profileBtn_2 = document.getElementById("profile_btn_2")
    if(user._id === userAuth.user._id){
        profileBtn_1.textContent = "Edit profile"
        profileBtn_2.textContent = "settings"
    }else{
        profileBtn_1.textContent = "Edit profile"
        profileBtn_2.textContent = "settings"
    }
})



