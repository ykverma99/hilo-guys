import express from "express";
import UserSchema from "../model/UserSchema.js";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const users = await UserSchema.find().populate({
      path: "friends",
      populate: {
        path: "user1 user2",
        model: "UserSchema",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserSchema.findById(userId).populate({
      path: "friends",
      populate: {
        path: "user2",
        model: "UserSchema",
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
