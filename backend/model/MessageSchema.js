import mongoose from "mongoose";

const message = new mongoose.Schema({
    from:String,
    to:String,
    content:String
})

const MessageSchema = mongoose.model("MessageSchema",message)

export default MessageSchema