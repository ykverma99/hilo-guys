const API ={
    userUrl:"https://jsonplaceholder.typicode.com/users",
    fetchUser: async ()=>{
        const res = await fetch(API.userUrl)
        return await res.json()
    }
}

export default API