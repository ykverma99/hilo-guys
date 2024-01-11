import mongoose from 'mongoose'

const user = new mongoose.Schema({
    username: String,
    name:String,
    email:String,
    password:String,
    profilePhoto:String,
    posts:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"PostSchema"
    },
    friends:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"FriendSchema"
    }
})

const UserSchema = mongoose.model("UserSchema",user)

export default UserSchema

