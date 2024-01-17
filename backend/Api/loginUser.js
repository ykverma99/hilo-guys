import express from "express";
import bcrypt from "bcrypt";
import UserSchema from "../model/UserSchema.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  // const {username,name,password,email} = req.body
  const body = req.body;
  if ((!body.username && !body.email) || !body.password ) {
    res.status(404).json({ error: "Please fill all the fields" });
    return;
  }
  try {
    const userEmail = await UserSchema.findOne({ email: body.email }).exec();
    const userUsername = await UserSchema.findOne({
      username: body.username,
    }).exec();
    if (!userEmail && !userUsername) {
      res.status(404).json({ error: "No User found" });
      return;
    }
    const user = userUsername ?? userEmail;
    const userPassword = user.password;
    if (userPassword) {
      const pass = await bcrypt.compare(body.password, userPassword);
      if (pass) {
        const userFind = await UserSchema.findById({ _id: user.id }).select(
          "-password"
        );
        return res.status(200).json(userFind);
      }else{
        
        return res.status(404).json({error:"Enter correct value"});
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
