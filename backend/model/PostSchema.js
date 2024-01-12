import mongoose from "mongoose";

const post = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserSchema",
    },
    content:String
})

const PostSchema = mongoose.model("PostSchema",post)
export default PostSchema