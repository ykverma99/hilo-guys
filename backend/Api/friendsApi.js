import express from "express";
import FriendSchema from "../model/FriendSchema.js";
import UserSchema from "../model/UserSchema.js";

const router = express.Router();

// router.get("/users",async(req,res)=>{
//     try {

//         const users = await FriendSchema.find()
//         res.status(200).json(users)
//     } catch (error) {
//         res.status(500).json({error:"Something went wrong"})
//     }
// })

// router.get("/user/:userId",async(req,res)=>{
//     try {
//         const userId = req.params.userId
//         const user = await FriendSchema.findById(userId)
//         res.status(200).json(user)
//     } catch (error) {
//         res.status(500).json({error:"Something went wrong"})
//     }
// })

router.post("/friends", async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    const user_1 = await UserSchema.findById(user1);
    const user_2 = await UserSchema.findById(user2);
    if (!user_1 || !user_2) {
      res.status(404).json({ error: "One or more users not found" });
    }
    const friendShip = new FriendSchema({ user1, user2 });
    const friends = await friendShip.save();

    user_1.friends.push(friends._id)
    user_2.friends.push(friends._id)
    await Promise.all([user_1.save(),user_2.save()])
    res.status(200).json(friends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
