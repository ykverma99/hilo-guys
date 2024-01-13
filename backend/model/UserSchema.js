import mongoose, { Types } from 'mongoose'

const user = new mongoose.Schema({
    username: String,
    name:String,
    email:String,
    password:String,
    profilePhoto:String,
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"FriendSchema"
    }],
    post:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PostSchema"
    }]
})

const UserSchema = mongoose.model("UserSchema",user)

export default UserSchema

