import API from "./API.js";

export async function getUsers(){
    const user = await API.fetchUser()
    localStorage.setItem("users",JSON.stringify({user}))
}