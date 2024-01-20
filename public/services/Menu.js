// import API from "./API.js";

export async function setUser(user) {
  localStorage.setItem("user", JSON.stringify({ user }));
}

export function getUsers() {
  return JSON.parse(localStorage.getItem("user"));
}

export async function singleUser(user) {
  try {
    const res = await fetch(`http://localhost:3000/user/${user}`);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
export async function users(count,userId) {
  let res
  try {
    if(count>0){
      res = await fetch(`http://localhost:3000/users?count=${count}&id=${userId}`);
    }else{
      res = await fetch(`http://localhost:3000/users`);
    }
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function fetchPosts(){
  try {
    const res = await fetch("http://localhost:3000/posts")
    return await res.json()
  } catch (error) {
    console.log(error);
  }
}


