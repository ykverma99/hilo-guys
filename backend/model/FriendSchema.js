import mongoose from "mongoose";

const friend = new mongoose.Schema({
    user1:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserSchema",
    },
    user2:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserSchema",
    },
})

const FriendSchema = mongoose.model("FriendSchema",friend)

export default FriendSchema