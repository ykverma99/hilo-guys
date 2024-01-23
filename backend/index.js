import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import mongoose from "mongoose";
import userApi from "./Api/usersApi.js";
import loginUser from "./Api/loginUser.js";
import signupUser from "./Api/signupUser.js";
import friendsApi from "./Api/friendsApi.js";
import postApi from "./Api/postApi.js";
import interactionRoutes from "./Api/interactionRoutes.js";
import { Server } from "socket.io";
import UserSchema from "./model/UserSchema.js";
import MessageSchema from "./model/MessageSchema.js";

// for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "../public");
// server variables
const app = express();
const http = createServer(app);
const io = new Server(http);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(staticPath));

// connnecting to the db

const db_connect = `mongodb+srv://yogi:yogi1234@hiloguys.3i1nj4y.mongodb.net/?retryWrites=true&w=majority`;
const connectDB = async () => {
  try {
    await mongoose.connect(db_connect);

    console.log("Mongodb connect");
  } catch (error) {
    console.log("Failed", error);
  }
};
connectDB();

// socket for messages

io.on("connection", (socket) => {
  // Event to join the user
  socket.on("join", async (username) => {
    try {
      const user = await UserSchema.findOneAndUpdate(
        { username: username },
        {
          socketId: socket.id,
        },
        { new: true }
      );
      console.log(`${username} ${user.socketId} is joined`);
    } catch (error) {
      console.log(error, "socket join");
    }
  });

  //   Event for send the message
  socket.on("send:message", async (data) => {
    try {
      const message = new MessageSchema({
        from: data.from,
        to: data.to,
        content: data.content,
      });
      await message.save();

      // send message to the reciver
      // io.to(data.to).emit("recive:message",{from:data.from,content:data.content})
      socket.broadcast.emit("recive:message", {
        content: data.content,
        from: data.from,
      });
    } catch (error) {
      console.log(error, "socket send message");
    }
  });

  //   Event Disconnect

  socket.on("disconnect", async () => {
    try {
      const user = await UserSchema.findOne({ socketId: socket.id });
      if (user) {
        console.log(`${user.username} left the chat`);
      }
    } catch (error) {
      console.log(error, "socket disconnect");
    }
  });
});

// all apis
app.use(signupUser);
app.use(loginUser);
app.use(userApi);
app.use(friendsApi);
app.use(postApi);
app.use(interactionRoutes);
http.listen(3000, () => {
  console.log("server is running");
});
