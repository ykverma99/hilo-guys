import { getUsers } from "../services/Menu.js"

let user = null
document.addEventListener('DOMContentLoaded',()=>{
    user = getUsers()
    if(!user){
        window.location.replace("http://localhost:3000/pages/login.html")
    }
})