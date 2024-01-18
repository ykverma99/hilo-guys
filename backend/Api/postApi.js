import express from "express";
import multer from "multer";
import UserSchema from "../model/UserSchema.js";
import PostSchema from "../model/PostSchema.js";
import {promises as fspromises} from 'fs'

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/posts/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/upload", upload.single("postImage"), async (req, res) => {
  try {
    const { user, caption } = req.body;
    const imagePath = req.file.filename;
    const User = await UserSchema.findById(user)
    if(!User){
        res.status(404).json({error:"No user found"})
        return
    }
    const post = new PostSchema({
        user,
        content:imagePath,
        caption
    })
    const newPost = await post.save()
    User.post.push(newPost._id)
    console.log(typeof newPost.user);
    await User.save()
    res.status(200).json(newPost)
  } catch (error) {
    console.log(error);
    return res.status(500).json({error:"Something went wrong"})
  }
});

router.get("/posts",async (req,res)=>{
    try {
        const posts = await PostSchema.find().populate("user")
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({error:"Something wen wrong"})
    }
})

router.get("/posts/:userId",async (req,res)=>{
    try {
        const userId = req.params.userId
        const user = await UserSchema.findById(userId)
        if(!user){
            res.status(404).json({error:"No User found"})
        }
        const posts = await PostSchema.find({user:userId}).populate("user")
        res.status(200).json(posts)
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something wen wrong"})
    }
})

router.delete("/post/:id",async(req,res)=>{
    try {
        const postId = req.params.id
        const post = await PostSchema.findById(postId)
        await fspromises.unlink(post.content)
        const user = await UserSchema.findById(post.user)
        if(user){
            user.post.pull(postId)
            await user.save()
        }
        const postDelete = await PostSchema.findByIdAndDelete(postId)
        if(!post){
            return res.status(404).json({error:"NO Post found"})
        }
        res.status(200).json({msg:"Post deleted successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Something went wrong"})
    }
})

export default router;
