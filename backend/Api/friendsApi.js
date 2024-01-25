import express from "express";
import FriendSchema from "../model/FriendSchema.js";
import UserSchema from "../model/UserSchema.js";

const router = express.Router();

router.post("/friends", async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    const user_1 = await UserSchema.findById(user1)
    const user_2 = await UserSchema.findById(user2);
    if (!user_1 || !user_2) {
      res.status(404).json({ error: "One or more users not found" });
    }
    const friendShip = new FriendSchema({ user1, user2 });
    const friends = await friendShip.save();

    user_1.friends.push(friends._id);
    user_2.friends.push(friends._id);
    await Promise.all([user_1.save(), user_2.save()]);
    const user = await UserSchema.findById(user1).populate({
      path: "friends",
      populate: {
        path: "user2",
        model: "UserSchema",
      },
    }).populate({
      path: "friends",
      populate: {
        path: "user1",
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
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/friends", async (req, res) => {
  try {
    const friendShip = await FriendSchema.find();
    res.status(200).json({ friendShip });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});
router.get("/friends/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const friends = await FriendSchema.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    });
    res.status(200).json(friends)
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
});
router.delete("/friends/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    // Find the friendship by the user IDs
    const friendship = await FriendSchema.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ error: "Friendship not found" });
    }

    // Remove the friendship ID from the users' friends arrays
    const user1Instance = await UserSchema.findById(user1);
    const user2Instance = await UserSchema.findById(user2);

    if (user1Instance && user2Instance) {
      user1Instance.friends.pull(friendship._id);
      user2Instance.friends.pull(friendship._id);
      await Promise.all([user1Instance.save(), user2Instance.save()]);
    }

    // Delete the friendship document from MongoDB
    // await friendship.remove();
    const friends = await FriendSchema.findOneAndDelete({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 },
      ],
    });

    res.status(200).json({ message: "Friendship deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
