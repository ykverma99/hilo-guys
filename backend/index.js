import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import mongoose from "mongoose";
// import userApi from './Api/usersApi.js'
import loginUser from './Api/loginUser.js'
import signupUser from './Api/signupUser.js'

// for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "../public");
// server variables
const app = express();
const http = createServer(app);

app.use(bodyParser.json());
app.use(express.static(staticPath));

// connnecting to the db

const db_connect = `mongodb+srv://yogi:yogi1234@hiloguys.3i1nj4y.mongodb.net/?retryWrites=true&w=majority`
const connectDB = async()=>{
    try {
        await mongoose.connect(db_connect)

        console.log("Mongodb connect");
    } catch (error) {
        console.log("Failed",error);
    }
}
connectDB()


// all apis
app.use(signupUser)
app.use(loginUser)

http.listen(3000, () => {
  console.log("server is running");
});
