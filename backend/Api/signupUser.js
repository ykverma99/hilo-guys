import express from "express";
import bcrypt from 'bcrypt'
import UserSchema from '../model/UserSchema.js'
const router = express.Router();

router.post("/signup", async (req, res) => {
  // const {username,name,password,email} = req.body
  const body = req.body;
  if (!body.username || !body.name || !body.password || !body.email) {
    res.status(404).json({ error: "Please fill all the fields" });
    return
  }
  try {
  const userEmail = await UserSchema.findOne({email:body.email}).exec()
  const userUsername = await UserSchema.findOne({username:body.username}).exec()
  if(userEmail){
    res.status(404).json({ error: "Email is Already exist" });
    return
  }
  if(userUsername){
    res.status(404).json({ error: "Username is Already exist" });
    return
  }
  const pass = await bcrypt.hash(body.password,12)
    const newUser = new UserSchema({
        username:body.username,
        name:body.name,
        password:pass,
        email:body.email
    });
    const savedUser = await newUser.save();
    const { password, ...data } = savedUser._doc;
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
