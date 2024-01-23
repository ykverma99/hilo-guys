import express from "express";
import UserSchema from "../model/UserSchema.js";
import mongoose, { Types } from "mongoose";
import PostSchema from "../model/PostSchema.js";
import FriendSchema from "../model/FriendSchema.js";
import multer from "multer";
import { promises as fspromises } from "fs";
import { addAbortListener } from "events";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/profilePic/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/users", async (req, res) => {
  const count = req.query.count;
  const userId = req.query.id;
  try {
    let users;
    if (count > 0) {
      const userFriends = await FriendSchema.find({$or:[{user1:userId},{user2:userId}]})
      const friendUserIds = userFriends.flatMap(friend => [friend.user1, friend.user2]);
      const excludedUserIds = [...friendUserIds,new mongoose.Types.ObjectId(userId)]
      users = await UserSchema.find({
        $and:[
          {_id: { $ne: userId }},
          {_id:{$nin:excludedUserIds}}  

        ]     
      })
        .limit(count)
        .populate({
          path: "friends",
          populate: {
            path: "user1 user2",
            model: "UserSchema",
          },
        });
    } else {
      users = await UserSchema.find().populate({
        path: "friends",
        populate: {
          path: "user1 user2",
          model: "UserSchema",
        },
      });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/user/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const isObjectId = Types.ObjectId.isValid(identifier);
    let user;
    if (isObjectId) {
      user = await UserSchema.findById(identifier)
        .populate({
          path: "friends",
          populate: {
            path: "user2",
            model: "UserSchema",
          },
        })
        .populate({
          path: "post",
          populate: {
            path: "user",
            model: "UserSchema",
          },
        });
    } else {
      user = await UserSchema.findOne({ username: identifier })
        .populate({
          path: "friends",
          populate: {
            path: "user2",
            model: "UserSchema",
          },
        })
        .populate({
          path: "post",
          populate: {
            path: "user",
            model: "UserSchema",
          },
        });
    }
    if (!user) {
      return res.status(404).json({ error: "NO User Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.patch(
  "/user/:userId",
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      let updatedData = req.body;
      // if(Object.keys(updatedData).length === 0){
      //   return res.status(400).json({error:"No data provided for update"})
      // }
      if (req.file) {
        updatedData.profilePhoto = req.file.filename;
      }
      const userUpdate = await UserSchema.findByIdAndUpdate(
        userId,
        updatedData,
        {
          new: true,
        }
      ).populate({
        path: "friends",
        populate: {
          path: "user2",
          model: "UserSchema",
        },
      })
      .populate({
        path: "post",
        populate: {
          path: "user",
          model: "UserSchema",
        },
      });
      if (!userUpdate) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(userUpdate);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

router.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserSchema.findById(userId);
    const deleteUser = await UserSchema.findByIdAndDelete(userId);
    if (user.profilePhoto) {
      await fspromises.unlink(user.profilePhoto);
    }
    if (!deleteUser) {
      return res.status(404).json({ error: "User not found" });
    }
    await PostSchema.deleteMany({ user: userId });
    await FriendSchema.deleteMany({
      $or: [{ user1: userId }, { user2: userId }],
    });
    res.status(200).json({ deleteUser, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
